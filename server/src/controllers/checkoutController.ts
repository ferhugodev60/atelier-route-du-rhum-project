import { Request, Response } from 'express';
import Stripe from 'stripe';
import { prisma } from '../lib/prisma';
import { sendOrderConfirmationEmail } from '../services/emailService';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

/**
 * 📜 PROTOCOLE DE SCELLAGE DE SESSION DE PAIEMENT
 * Gère l'hybridation des flux : Packs Entreprise vs Réservations nominatives.
 */
export const createCheckoutSession = async (req: any, res: Response) => {
    const userId = req.user?.userId;
    const { items } = req.body;

    if (!userId) return res.status(401).json({ error: "Identification requise. Accès au Registre refusé." });

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).json({ error: "Dossier utilisateur introuvable." });

        // Détermination de l'éligibilité aux tarifs préférentiels
        const isInstitutional = user.role === 'PRO' || user.isEmployee;

        for (const item of items) {
            if (item.workshopId) {
                const ws = await prisma.workshop.findUnique({ where: { id: item.workshopId } });
                if (!ws) throw new Error("Séance technique introuvable.");

                // 🏺 1. DÉTERMINATION DU MODE : RÉSERVATION vs PACK
                // Si des participants sont listés, on bascule en mode Réservation (pas de quota bloquant)
                const isReservation = item.participants && item.participants.length > 0;

                if (user.role === 'PRO' && !isReservation) {
                    // MODE PACK : Appliqué seulement pour l'achat de slots anonymes
                    const previousOrders = await prisma.order.count({
                        where: { userId, status: 'PAYÉ', isBusiness: true }
                    });

                    if (previousOrders === 0 && item.quantity !== 25) {
                        return res.status(400).json({ error: "Le premier pack Entreprise doit contenir 25 places." });
                    }
                    if (previousOrders > 0 && item.quantity % 10 !== 0) {
                        return res.status(400).json({ error: "Les recharges institutionnelles se font par packs de 10 places." });
                    }
                    item.isBusiness = true;
                } else {
                    // MODE RÉSERVATION : Standard, mixte ou bénéficiaire
                    item.isBusiness = false;
                }

                // 🏺 2. VÉRIFICATION DES PARTICIPANTS (SÉCURITÉ DU CURSUS)
                if (isReservation) {
                    // On vérifie si la séance appartient au Cursus de Conception (Level > 0)
                    const isConceptionCursus = ws.level > 0;

                    for (const p of item.participants) {
                        if (isConceptionCursus) {
                            // Cursus Conception : Le Passeport (Code client) est impératif
                            if (!p.memberCode) return res.status(400).json({ error: "Passeport obligatoire pour le Cursus de Conception." });
                            const guest = await prisma.user.findUnique({ where: { memberCode: p.memberCode.toUpperCase() } });
                            if (!guest) return res.status(400).json({ error: `Le code ${p.memberCode} est inconnu au Registre.` });
                        } else {
                            // Séance Découverte : Informations d'identité basiques
                            if (!p.firstName || !p.lastName || !p.email) {
                                return res.status(400).json({ error: "Identité complète requise pour la séance Découverte." });
                            }
                        }
                    }
                }

                // Attribution du tarif selon le rang du membre
                item.price = isInstitutional ? ws.priceInstitutional : ws.price;
                item.name = ws.title;
                item.description = ws.description;
                item.image = ws.image;

            } else if (item.volumeId) {
                // 🏺 3. LOGIQUE BOUTIQUE (Remise institutionnelle de 10%)
                const vol = await prisma.productVolume.findUnique({
                    where: { id: item.volumeId },
                    include: { product: true }
                });
                if (!vol || vol.stock < item.quantity) return res.status(400).json({ error: "Disponibilité insuffisante au Registre." });

                const basePrice = vol.price;
                item.price = isInstitutional ? basePrice * 0.9 : basePrice;

                item.name = `${vol.product.name} (${vol.size}${vol.unit})`;
                item.description = vol.product.description;
                item.isBusiness = false;
            }
        }

        const totalAmount = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
        const isOrderBusiness = items.some((i: any) => i.isBusiness);

        // 🏺 4. CRÉATION DU DOSSIER DE VENTE
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
                        // Scellage immédiat pour les réservations nominatives
                        participants: (!item.isBusiness && item.participants) ? {
                            create: item.participants.map((p: any) => ({
                                firstName: p.firstName,
                                lastName: p.lastName,
                                email: p.email,
                                phone: p.phone || "", // Protection contre les valeurs nulles
                                memberCode: p.memberCode?.toUpperCase(),
                                isValidated: true
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
                        description: isInstitutional ? `${item.description} (Tarif préférentiel certifié)` : item.description,
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
        console.error("❌ Erreur de scellage Checkout :", error.message);
        res.status(500).json({ error: "Échec technique lors de la génération du dossier de vente." });
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
    } catch (err: any) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

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

                    // 🏺 CRÉATION DES PLACES VIDES POUR LES ENTREPRISES (PRO)
                    // Déclenchera l'affichage des QR codes dans le PDF
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
                            orderItemId: item.id,
                            companyGroupId: companyGroupId,
                            isValidated: false // Force le mode QR Code
                        }));

                        await tx.participant.createMany({ data: participantsData });
                    }
                }

                const finalOrder = await tx.order.findUnique({
                    where: { id: orderId },
                    include: { user: true, items: { include: { workshop: true, participants: true } } }
                });

                if (finalOrder?.user) {
                    await sendOrderConfirmationEmail(finalOrder.user.email, finalOrder);
                }
            });
        } catch (error: any) {
            console.error("❌ Incident Webhook :", error.message);
        }
    }
    res.json({ received: true });
};