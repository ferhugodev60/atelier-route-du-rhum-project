import { Request, Response } from 'express';
import Stripe from 'stripe';
import { prisma } from '../lib/prisma';
import { sendOrderConfirmationEmail } from '../services/emailService';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const createCheckoutSession = async (req: any, res: Response) => {
    const userId = req.user?.userId;
    const { items } = req.body;

    if (!userId) return res.status(401).json({ error: "Identification requise." });

    try {
        // 🏺 VALIDATION DES ARTICLES ET DES PRIX EN BASE
        for (const item of items) {
            if (item.workshopId) {
                const ws = await prisma.workshop.findUnique({ where: { id: item.workshopId } });
                if (!ws) throw new Error("Séance de formation introuvable.");

                // 🏺 VERROU ENTREPRISE : Vérification du quota de 25 participants
                if (ws.type === "ENTREPRISE" && item.quantity < 25) {
                    return res.status(400).json({ error: "Les réservations entreprises requièrent un minimum de 25 places." });
                }

                // 🏺 SÉCURITÉ : On utilise le prix défini en base (50€ ou 120€ pour entreprise)
                item.price = ws.price;
                item.isBusiness = (ws.type === "ENTREPRISE");
            } else if (item.volumeId) {
                const vol = await prisma.productVolume.findUnique({ where: { id: item.volumeId } });
                if (!vol || vol.stock < item.quantity) {
                    return res.status(400).json({ error: `Stock insuffisant pour ${item.name}.` });
                }
            }
        }

        const totalAmount = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
        const hasBusinessItem = items.some((i: any) => i.isBusiness);

        // 1. Création du dossier de vente
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
                        participants: item.workshopId ? {
                            create: item.participants?.map((p: any) => ({
                                firstName: p.firstName,
                                lastName: p.lastName,
                                phone: p.phone || ""
                            }))
                        } : undefined
                    }))
                }
            }
        });

        // 2. Interface Stripe
        const line_items = items.map((item: any) => ({
            price_data: {
                currency: 'eur',
                unit_amount: Math.round(item.price * 100),
                product_data: {
                    name: item.name,
                    description: item.isBusiness ? "Offre Séminaire & Cohésion" : "Formation Technique Individuelle",
                    images: item.image ? [item.image] : []
                },
            },
            quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/mon-compte?payment_success=true&orderId=${pendingOrder.id}`,
            cancel_url: `${process.env.FRONTEND_URL}/boutique?payment_cancelled=true`,
            customer_email: req.user.email,
            metadata: { orderId: pendingOrder.id, userId: userId }
        });

        res.status(200).json({ url: session.url });
    } catch (error: any) {
        console.error("Erreur Session Stripe:", error.message);
        res.status(500).json({ error: "Échec de l'initialisation du dossier de vente." });
    }
};

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
        const userId = session.metadata?.userId;

        try {
            await prisma.$transaction(async (tx) => {
                const order = await tx.order.update({
                    where: { id: orderId },
                    data: { status: "PAYÉ" },
                    include: { items: { include: { workshop: true } }, user: true }
                });

                for (const item of order.items) {
                    if (item.volumeId) {
                        await tx.productVolume.update({
                            where: { id: item.volumeId },
                            data: { stock: { decrement: item.quantity } }
                        });
                    }
                    // 🏺 Validation du cursus : uniquement pour les particuliers
                    if (item.workshop && item.workshop.level > 0 && !order.isBusiness) {
                        await tx.user.update({
                            where: { id: userId as string },
                            data: { conceptionLevel: { set: item.workshop.level } }
                        });
                    }
                }

                if (order.user) {
                    await sendOrderConfirmationEmail(order.user.email, {
                        reference: order.reference, total: order.total, items: order.items
                    });
                }
            });
        } catch (error: any) {
            console.error("Erreur Webhook traitement:", error.message);
        }
    }
    res.json({ received: true });
};