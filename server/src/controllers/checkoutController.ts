import { Request, Response } from 'express';
import Stripe from 'stripe';
import { prisma } from '../lib/prisma';
import { sendOrderConfirmationEmail } from '../services/emailService';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

/**
 * 🏺 Initialisation de la Session de Paiement
 * Gère les quotas Particuliers (1-10) et Pros (25+) [cite: 2026-02-12]
 */
export const createCheckoutSession = async (req: any, res: Response) => {
    const userId = req.user?.userId;
    const { items } = req.body;

    if (!userId) return res.status(401).json({ error: "Identification requise." });

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).json({ error: "Dossier utilisateur introuvable." });

        for (const item of items) {
            if (item.workshopId) {
                const ws = await prisma.workshop.findUnique({ where: { id: item.workshopId } });
                if (!ws) throw new Error("Séance de formation introuvable.");

                // 🏺 LOGIQUE DE SEGMENTATION DU REGISTRE
                if (ws.type === "ENTREPRISE") {
                    // 🏢 RÈGLE PRO : Réservée aux comptes "PRO" (Gestionnaires CE)
                    if (user.role !== "PRO") {
                        return res.status(403).json({ error: "L'offre entreprise est réservée aux comptes gestionnaires de CE." });
                    }

                    // Validation du seuil minimal (25 places)
                    if (item.quantity < 25) {
                        return res.status(400).json({ error: "L'offre entreprise requiert un minimum de 25 places." });
                    }
                    // Validation des paliers de 10 (25, 35, 45, etc.)
                    if ((item.quantity - 25) % 10 !== 0) {
                        return res.status(400).json({ error: "Le volume de places professionnelles doit progresser par paliers de 10." });
                    }
                    item.isBusiness = true;
                } else {
                    // 👤 RÈGLE PARTICULIER (Indépendant ou Salarié CE) [cite: 2026-02-12]
                    // Limite stricte de 1 à 10 personnes maximum
                    if (item.quantity < 1 || item.quantity > 10) {
                        return res.status(400).json({
                            error: "Pour les particuliers (y compris salariés), les réservations sont limitées de 1 à 10 personnes."
                        });
                    }
                    item.isBusiness = false;
                }

                item.price = ws.price;
            } else if (item.volumeId) {
                const vol = await prisma.productVolume.findUnique({ where: { id: item.volumeId } });
                if (!vol || vol.stock < item.quantity) {
                    return res.status(400).json({ error: `Stock insuffisant pour le produit sélectionné.` });
                }
            }
        }

        const totalAmount = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
        const hasBusinessItem = items.some((i: any) => i.isBusiness);

        // 🏺 CRÉATION DU DOSSIER DE VENTE
        const pendingOrder = await prisma.order.create({
            data: {
                userId,
                // CORP pour les gros contrats, ORD pour les particuliers/salariés
                reference: hasBusinessItem ? `CORP-${Date.now()}` : `ORD-${Date.now()}`,
                total: totalAmount,
                status: 'EN_ATTENTE_PAIEMENT',
                isBusiness: hasBusinessItem,
                items: {
                    create: items.map((item: any) => ({
                        quantity: item.quantity,
                        price: item.price,
                        workshopId: item.workshopId || null,
                        volumeId: item.volumeId || null,
                        // Les participants sont nominatifs uniquement pour les particuliers/salariés
                        participants: (item.workshopId && !item.isBusiness) ? {
                            create: item.participants?.map((p: any) => ({
                                firstName: p.firstName,
                                lastName: p.lastName,
                                phone: p.phone || "",
                                email: p.email || "",
                            }))
                        } : undefined
                    }))
                }
            }
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: items.map((item: any) => ({
                price_data: {
                    currency: 'eur',
                    unit_amount: Math.round(item.price * 100),
                    product_data: {
                        name: item.name,
                        description: item.isBusiness
                            ? `Pack de ${item.quantity} bons de formation vierges (PDF). Capacité max 15 pers/session. Contacter l'Atelier pour réserver.`
                            : "Séance Particulier / Salarié - Inscription nominative"
                    },
                },
                quantity: item.quantity,
            })),
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/mon-compte?payment_success=true&orderId=${pendingOrder.id}`,
            cancel_url: `${process.env.FRONTEND_URL}/boutique?payment_cancelled=true`,
            customer_email: user.email,
            metadata: {
                orderId: pendingOrder.id,
                userId: userId,
                isBusiness: hasBusinessItem ? "true" : "false"
            }
        });

        res.status(200).json({ url: session.url });
    } catch (error: any) {
        console.error("❌ Erreur Session Checkout:", error);
        res.status(500).json({ error: "Échec de l'initialisation du dossier de vente." });
    }
};

/**
 * 🏺 Confirmation Technique et Archivage : Webhook
 */
export const handleWebhook = async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'] as string;
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET as string);
    } catch (err: any) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;

        try {
            await prisma.$transaction(async (tx) => {
                const order = await tx.order.update({
                    where: { id: orderId },
                    data: { status: "PAYÉ" },
                    include: {
                        items: {
                            include: {
                                workshop: true,
                                volume: { include: { product: true } }
                            }
                        },
                        user: true
                    }
                });

                for (const item of order.items) {
                    // Mise à jour des stocks pour les bouteilles
                    if (item.volumeId) {
                        await tx.productVolume.update({
                            where: { id: item.volumeId },
                            data: { stock: { decrement: item.quantity } }
                        });
                    }

                    // Création du groupe de cohorte pour les comptes PRO
                    if (item.workshop && order.isBusiness) {
                        await tx.companyGroup.create({
                            data: {
                                name: `Contrat ${order.reference} - ${item.quantity} places`,
                                ownerId: order.userId,
                                currentLevel: item.workshop.level,
                            }
                        });
                    }
                }

                if (order.user) {
                    await sendOrderConfirmationEmail(order.user.email, {
                        reference: order.reference,
                        total: order.total,
                        items: order.items,
                        isBusiness: order.isBusiness
                    });
                }
            });
        } catch (error: any) {
            console.error("❌ Erreur Webhook:", error.message);
        }
    }
    res.json({ received: true });
};