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
        const line_items = [];
        for (const item of items) {
            let priceData: any = {
                currency: 'eur',
                unit_amount: 0,
                product_data: {
                    name: item.name,
                    images: item.image ? [item.image] : []
                },
            };

            if (item.workshopId) {
                const ws = await prisma.workshop.findUnique({ where: { id: item.workshopId } });
                if (!ws) throw new Error(`Article ${item.name} introuvable.`);
                priceData.unit_amount = Math.round(ws.price * 100);
            } else if (item.volumeId) {
                const vol = await prisma.productVolume.findUnique({ where: { id: item.volumeId } });
                if (!vol) throw new Error(`Produit ${item.name} introuvable.`);
                priceData.unit_amount = Math.round(vol.price * 100);
            }
            line_items.push({ price_data: priceData, quantity: item.quantity });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/mon-compte?payment_success=true`,
            cancel_url: `${process.env.FRONTEND_URL}/#workshops?payment_cancelled=true`,
            metadata: {
                userId: userId,
                // Synchronisation de la clé "quantity" pour le service d'e-mail
                cartItems: JSON.stringify(items.map((i: any) => ({
                    workshopId: i.workshopId || null,
                    volumeId: i.volumeId || null,
                    name: i.name,
                    quantity: i.quantity,
                    price: i.price,
                    participants: i.participants || []
                })))
            }
        });

        res.status(200).json({ url: session.url });
    } catch (error: any) {
        res.status(500).json({ error: "Erreur lors de la création de la session de paiement." });
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
        const userId = session.metadata?.userId;
        const cartItems = JSON.parse(session.metadata?.cartItems || '[]');

        try {
            await prisma.$transaction(async (tx) => {
                const order = await tx.order.create({
                    data: {
                        userId: userId as string,
                        reference: `ORD-${Date.now()}`,
                        total: (session.amount_total || 0) / 100,
                        status: "PAYÉ",
                        items: {
                            create: cartItems.map((item: any) => ({
                                quantity: item.quantity,
                                price: item.price,
                                workshopId: item.workshopId,
                                volumeId: item.volumeId,
                                participants: item.workshopId ? {
                                    create: item.participants.map((p: any) => ({
                                        firstName: p.firstName,
                                        lastName: p.lastName,
                                        phone: p.phone
                                    }))
                                } : undefined
                            }))
                        }
                    }
                });

                const user = await tx.user.findUnique({ where: { id: userId as string } });
                if (user) {
                    // Transmission des données nettoyées au service d'e-mail
                    await sendOrderConfirmationEmail(user.email, {
                        reference: order.reference,
                        total: order.total,
                        items: cartItems
                    });
                }

                for (const item of cartItems) {
                    if (item.workshopId) {
                        const workshop = await tx.workshop.findUnique({ where: { id: item.workshopId } });
                        if (workshop && workshop.level > 0) {
                            await tx.user.update({
                                where: { id: userId },
                                data: { conceptionLevel: { set: workshop.level } }
                            });
                        }
                    }
                }
            });
        } catch (error: any) {
            console.error("Erreur Webhook lors du traitement de la commande:", error.message);
        }
    }
    res.json({ received: true });
};