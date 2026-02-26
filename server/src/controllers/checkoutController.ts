import { Request, Response } from 'express';
import Stripe from 'stripe';
import { prisma } from '../lib/prisma';
import { sendOrderConfirmationEmail } from '../services/emailService';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

/**
 * 🏛️ Initialisation de la Session de Paiement
 * Gère la tarification duale sur une fiche unique de séance.
 */
export const createCheckoutSession = async (req: any, res: Response) => {
    const userId = req.user?.userId;
    const { items } = req.body;

    if (!userId) return res.status(401).json({ error: "Identification requise." });

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).json({ error: "Dossier utilisateur introuvable." });

        const hasInstitutionalAdvantage = user.role === 'PRO' || user.isEmployee;

        for (const item of items) {
            if (item.workshopId) {
                const ws = await prisma.workshop.findUnique({ where: { id: item.workshopId } });
                if (!ws) throw new Error("Séance de formation introuvable.");

                // 1️⃣ LOGIQUE DE QUOTAS
                if (item.quantity >= 25) {
                    if (user.role !== "PRO") {
                        return res.status(403).json({ error: "L'achat de packs est réservé aux comptes PRO." });
                    }
                    item.isBusiness = true;
                } else {
                    item.isBusiness = false;
                }

                // 2️⃣ RÉCUPÉRATION DES DONNÉES POUR STRIPE
                item.price = hasInstitutionalAdvantage ? ws.priceInstitutional : ws.price;
                item.name = ws.title;
                // 🏺 Capture de la description et de l'image de l'atelier
                item.description = ws.description;
                item.image = ws.image;

            } else if (item.volumeId) {
                const vol = await prisma.productVolume.findUnique({
                    where: { id: item.volumeId },
                    include: { product: true }
                });
                if (!vol || vol.stock < item.quantity) {
                    return res.status(400).json({ error: `Stock insuffisant.` });
                }

                // 🏺 Capture des données du produit (Bouteille)
                item.price = vol.price;
                item.name = `${vol.product.name} (${vol.size}${vol.unit})`;
                item.description = vol.product.description;
                item.image = vol.product.image;
                item.isBusiness = false;
            }
        }

        const totalAmount = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
        const hasBusinessItem = items.some((i: any) => i.isBusiness);

        // 3️⃣ CRÉATION DU DOSSIER DE VENTE
        const pendingOrder = await prisma.order.create({
            data: {
                userId,
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

        // 4️⃣ GÉNÉRATION DE LA SESSION STRIPE AVEC CONTENU DYNAMIQUE
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: items.map((item: any) => ({
                price_data: {
                    currency: 'eur',
                    unit_amount: Math.round(item.price * 100),
                    product_data: {
                        name: item.name,
                        // 🏺 On utilise la description réelle de la DB + mention d'avantage si besoin
                        description: item.isBusiness
                            ? `Pack institutionnel - ${item.description}`
                            : `${item.description}${hasInstitutionalAdvantage ? ' (Tarif privilégié appliqué)' : ''}`,
                        // 🏺 On injecte l'image réelle pour Stripe Checkout
                        images: item.image ? [item.image] : [],
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
                userId: userId
            }
        });

        res.status(200).json({ url: session.url });
    } catch (error: any) {
        res.status(500).json({ error: "Échec de l'initialisation du paiement." });
    }
};

/**
 * 🏛️ Confirmation Technique et Archivage (Webhook Stripe)
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
                    if (item.volumeId) {
                        await tx.productVolume.update({
                            where: { id: item.volumeId },
                            data: { stock: { decrement: item.quantity } }
                        });
                    }

                    // Création de la cohorte pour les achats Business (PRO)
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