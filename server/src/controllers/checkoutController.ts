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
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).json({ error: "Dossier utilisateur introuvable." });

        for (const item of items) {
            if (item.workshopId) {
                const ws = await prisma.workshop.findUnique({ where: { id: item.workshopId } });
                if (!ws) throw new Error("Séance de formation introuvable.");

                // 🏺 NOUVELLE LOGIQUE GRANDS COMPTES
                if (ws.type === "ENTREPRISE") {
                    // Autorise désormais l'incrémentation libre à partir de 50
                    if (item.quantity < 50) {
                        return res.status(400).json({ error: "L'offre Grand Compte requiert un minimum de 50 participants." });
                    }
                }

                item.price = ws.price;
                item.isBusiness = (ws.type === "ENTREPRISE");
            } else if (item.volumeId) {
                const vol = await prisma.productVolume.findUnique({ where: { id: item.volumeId } });
                if (!vol || vol.stock < item.quantity) {
                    return res.status(400).json({ error: `Stock insuffisant pour le produit sélectionné.` });
                }
            }
        }

        const totalAmount = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
        const businessItem = items.find((i: any) => i.isBusiness);

        const pendingOrder = await prisma.order.create({
            data: {
                userId,
                reference: businessItem ? `CORP-${Date.now()}` : `ORD-${Date.now()}`,
                total: totalAmount,
                status: 'EN_ATTENTE_PAIEMENT',
                isBusiness: !!businessItem,
                items: {
                    create: items.map((item: any) => ({
                        quantity: item.quantity,
                        price: item.price,
                        workshopId: item.workshopId || null,
                        volumeId: item.volumeId || null,
                        companyGroupId: item.companyGroupId || null,
                        participants: item.workshopId ? {
                            create: item.participants?.map((p: any) => ({
                                firstName: p.firstName,
                                lastName: p.lastName,
                                phone: p.phone || "",
                                email: p.email || "",
                                memberCode: p.memberCode || null,
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
                        description: item.isBusiness ? `Privatisation Grand Compte - ${item.quantity} pers.` : "Séance Particulier"
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
                // 🏺 On stocke les noms des groupes sous forme de chaîne JSON pour le Webhook
                groupNames: businessItem?.groupNames ? JSON.stringify(businessItem.groupNames) : ""
            }
        });

        res.status(200).json({ url: session.url });
    } catch (error: any) {
        console.error("Erreur Checkout Session:", error);
        res.status(500).json({ error: "Échec de l'initialisation du dossier de vente." });
    }
};

/**
 * 🏺 GESTION DU WEBHOOK : Décomposition en paquets de 25
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
        const groupNames = session.metadata?.groupNames ? JSON.parse(session.metadata.groupNames) : [];

        try {
            await prisma.$transaction(async (tx) => {
                const order = await tx.order.update({
                    where: { id: orderId },
                    data: { status: "PAYÉ" },
                    include: {
                        items: { include: { workshop: true, participants: true } },
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

                    // 🏺 DÉCOMPOSITION AUTOMATIQUE DES COHORTES
                    if (item.workshop && order.isBusiness) {
                        const allParticipants = item.participants;

                        // On découpe les participants en paquets de 25
                        for (let i = 0; i < allParticipants.length; i += 25) {
                            const chunk = allParticipants.slice(i, i + 25);
                            const packetIndex = Math.floor(i / 25);
                            const groupName = groupNames[packetIndex] || `Cohorte ${order.reference} - ${packetIndex + 1}`;

                            // Création d'une CompanyGroup pour chaque paquet de 25
                            const newGroup = await tx.companyGroup.create({
                                data: {
                                    name: groupName,
                                    ownerId: order.userId,
                                    currentLevel: item.workshop.level,
                                }
                            });

                            // On lie physiquement ces 25 participants à ce nouveau groupe
                            await tx.participant.updateMany({
                                where: { id: { in: chunk.map(p => p.id) } },
                                data: { companyGroupId: newGroup.id }
                            });
                        }
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