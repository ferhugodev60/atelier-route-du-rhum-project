import { Request, Response } from 'express';
import Stripe from 'stripe';
import { prisma } from '../lib/prisma';
import { sendOrderConfirmationEmail } from '../services/emailService';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

/**
 * 📜 PROTOCOLE DE SCELLAGE DE SESSION DE PAIEMENT
 * Gère l'hybridation des flux : Packs Institutionnels vs Réservations nominatives.
 */
export const createCheckoutSession = async (req: any, res: Response) => {
    const userId = req.user?.userId;
    const { items } = req.body;

    if (!userId) return res.status(401).json({ error: "Identification requise. Accès au Registre refusé." });

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).json({ error: "Dossier utilisateur introuvable." });

        // 🏺 Identification des membres éligibles (PRO ou Bénéficiaire CE)
        const isInstitutional = user.role === 'PRO' || user.isEmployee;

        for (const item of items) {
            if (item.workshopId) {
                const ws = await prisma.workshop.findUnique({ where: { id: item.workshopId } });
                if (!ws) throw new Error("Séance technique introuvable.");

                // 1. DÉTERMINATION DU MODE : RÉSERVATION vs PACK
                const isReservation = item.participants && item.participants.length > 0;

                if (user.role === 'PRO' && !isReservation) {
                    // 🏺 LOGIQUE DE QUOTAS PAR PALIER TECHNIQUE
                    const workshopLevel = ws.level;

                    const previousOrdersForLevel = await prisma.order.count({
                        where: {
                            userId,
                            status: 'PAYÉ',
                            isBusiness: true,
                            items: {
                                some: { workshop: { level: workshopLevel } }
                            }
                        }
                    });

                    // Règle : 25 places pour la première fois, puis par 10
                    if (previousOrdersForLevel === 0 && item.quantity !== 25) {
                        return res.status(400).json({
                            error: `La première acquisition pour le Niveau ${workshopLevel} doit être de 25 places exactement.`
                        });
                    }
                    if (previousOrdersForLevel > 0 && item.quantity % 10 !== 0) {
                        return res.status(400).json({
                            error: `Les recharges pour le Niveau ${workshopLevel} se font par packs de 10 places.`
                        });
                    }
                    item.isBusiness = true;
                } else {
                    item.isBusiness = false;
                }

                // 2. VÉRIFICATION DES PARTICIPANTS (SÉCURITÉ DU CURSUS)
                if (isReservation) {
                    const isConceptionCursus = ws.level > 0;
                    for (const p of item.participants) {
                        if (isConceptionCursus) {
                            if (!p.memberCode) return res.status(400).json({ error: "Passeport obligatoire pour le Cursus de Conception." });
                            const guest = await prisma.user.findUnique({ where: { memberCode: p.memberCode.toUpperCase() } });
                            if (!guest) return res.status(400).json({ error: `Le code ${p.memberCode} est inconnu au Registre.` });
                        } else if (!p.firstName || !p.lastName || !p.email) {
                            return res.status(400).json({ error: "Identité complète requise pour la séance Découverte." });
                        }
                    }
                }

                item.price = isInstitutional ? ws.priceInstitutional : ws.price;
                item.name = ws.title;
                item.description = ws.description;
                item.image = ws.image;

            } else if (item.volumeId) {
                // 🏺 3. LOGIQUE BOUTIQUE : REMISE DE 10%
                const vol = await prisma.productVolume.findUnique({
                    where: { id: item.volumeId },
                    include: { product: true }
                });

                if (!vol || vol.stock < item.quantity) return res.status(400).json({ error: "Disponibilité insuffisante." });

                // Formule : $price = basePrice \times 0.9$
                item.price = isInstitutional ? vol.price * 0.9 : vol.price;
                item.name = `${vol.product.name} (${vol.size}${vol.unit})`;
                item.description = vol.product.description;
                item.image = vol.product.image;
                item.isBusiness = false;
            }
        }

        const totalAmount = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
        const isOrderBusiness = items.some((i: any) => i.isBusiness);

        // 4. CRÉATION DU DOSSIER DE VENTE
        const pendingOrder = await prisma.order.create({
            data: {
                userId,
                reference: isOrderBusiness ? `CORP-${Date.now()}` : `ORD-${Date.now()}`,
                total: totalAmount,
                status: 'EN_ATTENTE_PAIEMENT',
                isBusiness: isOrderBusiness,
                items: {
                    create: items.map((item: any) => ({
                        quantity: item.quantity,
                        price: item.price,
                        workshopId: item.workshopId || null,
                        volumeId: item.volumeId || null,
                        participants: (!item.isBusiness && item.participants) ? {
                            create: item.participants.map((p: any) => ({
                                firstName: p.firstName, lastName: p.lastName, email: p.email,
                                phone: p.phone || "", memberCode: p.memberCode?.toUpperCase(), isValidated: true
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
                        description: isInstitutional ? `${item.description} (Tarif préférentiel scellé)` : item.description,
                        images: item.image ? [item.image] : []
                    },
                },
                quantity: item.quantity,
            })),
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/mon-compte?payment_success=true&orderId=${pendingOrder.id}`,
            cancel_url: `${process.env.FRONTEND_URL}/boutique?payment_cancelled=true`,
            customer_email: user.email,
            metadata: { orderId: pendingOrder.id, userId: userId }
        });

        res.status(200).json({ url: session.url });
    } catch (error: any) {
        console.error("❌ Erreur Checkout :", error.message);
        res.status(500).json({ error: "Échec technique du Registre." });
    }
};

/**
 * 📜 WEBHOOK STRIPE : Confirmation et Scellage des Slots PRO
 */
export const handleWebhook = async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'] as string;
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET as string);
    } catch (err: any) { return res.status(400).send(`Webhook Error: ${err.message}`); }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;

        try {
            await prisma.$transaction(async (tx) => {
                const updatedOrder = await tx.order.update({
                    where: { id: orderId },
                    data: { status: "PAYÉ" },
                    include: { items: { include: { workshop: true, participants: true } } }
                });

                for (const item of updatedOrder.items) {
                    if (item.volumeId) {
                        await tx.productVolume.update({
                            where: { id: item.volumeId }, data: { stock: { decrement: item.quantity } }
                        });
                    }

                    if (item.workshop && item.participants.length === 0) {
                        let companyGroupId = null;
                        if (updatedOrder.isBusiness) {
                            const group = await tx.companyGroup.create({
                                data: {
                                    name: `Contrat ${updatedOrder.reference}`,
                                    ownerId: updatedOrder.userId,
                                    currentLevel: item.workshop.level,
                                }
                            });
                            companyGroupId = group.id;
                        }

                        const participantsData = Array.from({ length: item.quantity }).map(() => ({
                            orderItemId: item.id, companyGroupId, isValidated: false
                        }));
                        await tx.participant.createMany({ data: participantsData });
                    }
                }

                const finalOrder = await tx.order.findUnique({
                    where: { id: orderId },
                    include: { user: true, items: { include: { workshop: true, participants: true } } }
                });

                if (finalOrder?.user) await sendOrderConfirmationEmail(finalOrder.user.email, finalOrder);
            });
        } catch (error: any) { console.error("❌ Incident Webhook :", error.message); }
    }
    res.json({ received: true });
};