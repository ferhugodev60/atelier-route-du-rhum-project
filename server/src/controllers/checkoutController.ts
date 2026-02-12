import { Request, Response } from 'express';
import Stripe from 'stripe';
import { prisma } from '../lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const createCheckoutSession = async (req: any, res: Response) => {
    console.log("--- 🏺 DÉBUT DE CRÉATION DE SESSION ---");
    const userId = req.user?.userId;
    const { items } = req.body;

    console.log("👤 User ID récupéré:", userId);
    console.log("📦 Items reçus du panier:", JSON.stringify(items, null, 2));

    if (!userId) {
        console.error("❌ Erreur: Pas de userId dans la requête");
        return res.status(401).json({ error: "Identification requise." });
    }

    try {
        const line_items = [];

        for (const item of items) {
            console.log(`🧪 Traitement de l'item: ${item.name}`);

            let priceData: any = {
                currency: 'eur',
                unit_amount: 0,
                product_data: {
                    name: item.name,
                    images: item.image ? [item.image] : []
                },
            };

            if (item.workshopId) {
                console.log(`🔍 Recherche Workshop en base: ${item.workshopId}`);
                const ws = await prisma.workshop.findUnique({ where: { id: item.workshopId } });
                if (!ws) {
                    console.error(`❌ Workshop non trouvé: ${item.workshopId}`);
                    throw new Error(`Atelier ${item.name} introuvable.`);
                }
                priceData.unit_amount = Math.round(ws.price * 100);
                console.log(`✅ Workshop trouvé. Prix centimes: ${priceData.unit_amount}`);
            } else if (item.volumeId) {
                console.log(`🔍 Recherche Volume en base: ${item.volumeId}`);
                const vol = await prisma.productVolume.findUnique({ where: { id: item.volumeId } });
                if (!vol) {
                    console.error(`❌ Volume non trouvé: ${item.volumeId}`);
                    throw new Error(`Produit ${item.name} introuvable.`);
                }
                priceData.unit_amount = Math.round(vol.price * 100);
                console.log(`✅ Volume trouvé. Prix centimes: ${priceData.unit_amount}`);
            }

            line_items.push({ price_data: priceData, quantity: item.quantity });
        }

        console.log("📡 Envoi à Stripe avec line_items:", JSON.stringify(line_items, null, 2));
        console.log("🔗 URL Success prévue:", `${process.env.FRONTEND_URL}/mon-compte?payment_success=true`);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/mon-compte?payment_success=true`,
            cancel_url: `${process.env.FRONTEND_URL}/#workshops?payment_cancelled=true`,
            metadata: {
                userId: userId,
                cartItems: JSON.stringify(items.map((i: any) => ({
                    workshopId: i.workshopId || null,
                    volumeId: i.volumeId || null,
                    qty: i.quantity,
                    price: i.price,
                    participants: i.participants || []
                })))
            }
        });

        console.log("✨ Session Stripe créée avec succès ! URL:", session.url);
        res.status(200).json({ url: session.url });

    } catch (error: any) {
        console.error("🔥 [STRIPE_SESSION_ERROR] L'ALCHIMIE A ÉCHOUÉ :");
        console.error("Message d'erreur:", error.message);
        console.error("Stack Trace:", error.stack);
        if (error.raw) console.error("Détails Stripe Raw:", JSON.stringify(error.raw, null, 2));

        res.status(500).json({
            error: "L'alchimie financière a échoué.",
            debug: error.message
        });
    }
};

/**
 * 🏺 TRAITEMENT DU WEBHOOK
 */
export const handleWebhook = async (req: Request, res: Response) => {
    console.log("--- 🔔 WEBHOOK REÇU DE STRIPE ---");
    const sig = req.headers['stripe-signature'] as string;
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET as string
        );
        console.log("✅ Webhook vérifié. Type d'événement:", event.type);
    } catch (err: any) {
        console.error("❌ Erreur de signature Webhook:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("💰 Paiement complété pour la session:", session.id);

        const userId = session.metadata?.userId;
        const cartItems = JSON.parse(session.metadata?.cartItems || '[]');

        console.log("👤 Metadata UserId:", userId);
        console.log("🛒 Items à traiter:", cartItems.length);

        try {
            await prisma.$transaction(async (tx) => {
                console.log("📝 Début de la transaction Prisma...");

                const order = await tx.order.create({
                    data: {
                        userId: userId as string,
                        reference: `ORD-${Date.now()}`,
                        total: (session.amount_total || 0) / 100,
                        status: "PAYÉ",
                        items: {
                            create: cartItems.map((item: any) => ({
                                quantity: item.qty,
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
                console.log("✅ Commande créée ID:", order.id);

                for (const item of cartItems) {
                    if (item.workshopId) {
                        const workshop = await tx.workshop.findUnique({ where: { id: item.workshopId } });
                        if (workshop && workshop.level > 0) {
                            console.log(`🆙 Mise à jour niveau user vers: ${workshop.level}`);
                            await tx.user.update({
                                where: { id: userId },
                                data: { conceptionLevel: { set: workshop.level } }
                            });
                        }
                    }
                }
            });
            console.log("🏺 Tout est scellé en base de données avec succès.");
        } catch (error: any) {
            console.error("🔥 Erreur fatale dans la transaction Webhook:", error.message);
        }
    }
    res.json({ received: true });
};