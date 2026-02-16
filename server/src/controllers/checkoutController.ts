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
        // 🏺 VERROU DE SÉCURITÉ : Vérification des stocks avant paiement
        for (const item of items) {
            if (item.volumeId) {
                const vol = await prisma.productVolume.findUnique({
                    where: { id: item.volumeId },
                    select: { stock: true, product: { select: { name: true } } }
                });

                if (!vol || vol.stock < item.quantity) {
                    return res.status(400).json({
                        error: `Stock insuffisant pour ${vol?.product.name || 'un flacon'}. Disponible : ${vol?.stock || 0}`
                    });
                }
            }
        }

        const totalAmount = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);

        // 1. Création de la commande "EN ATTENTE" (sauvegarde des participants et articles)
        const pendingOrder = await prisma.order.create({
            data: {
                userId,
                reference: `ORD-${Date.now()}`,
                total: totalAmount,
                status: 'EN_ATTENTE_PAIEMENT',
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
                                phone: p.phone || null
                            }))
                        } : undefined
                    }))
                }
            }
        });

        // 2. Préparation des lignes pour l'interface Stripe
        const line_items = items.map((item: any) => ({
            price_data: {
                currency: 'eur',
                unit_amount: Math.round(item.price * 100),
                product_data: {
                    name: item.name,
                    description: item.workshopId ? "Séance de formation technique" : `Flacon de ${item.size} ${item.unit}`,
                    images: item.image ? [item.image] : []
                },
            },
            quantity: item.quantity,
        }));

        // 3. Création de la session avec redirection vers /boutique en cas d'annulation
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/profile?payment_success=true&orderId=${pendingOrder.id}`,
            cancel_url: `${process.env.FRONTEND_URL}/boutique?payment_cancelled=true`,
            customer_email: req.user.email,
            metadata: { orderId: pendingOrder.id, userId: userId }
        });

        res.status(200).json({ url: session.url });
    } catch (error: any) {
        res.status(500).json({ error: "Erreur lors de la validation du dossier de vente." });
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

                // 🏺 MISE À JOUR DES STOCKS ET DU CURSUS
                for (const item of order.items) {
                    // Décrémentation du stock pour les flacons
                    if (item.volumeId) {
                        await tx.productVolume.update({
                            where: { id: item.volumeId },
                            data: { stock: { decrement: item.quantity } }
                        });
                    }
                    // Mise à jour du niveau si c'est une formation
                    if (item.workshop && item.workshop.level > 0) {
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
            console.error("Erreur traitement Webhook:", error.message);
        }
    }
    res.json({ received: true });
};