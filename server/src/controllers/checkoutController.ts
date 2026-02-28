import { Request, Response } from 'express';
import Stripe from 'stripe';
import { prisma } from '../lib/prisma';
import { sendOrderConfirmationEmail } from '../services/emailService';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

/**
 * 🏛️ INITIALISATION DE LA SESSION DE PAIEMENT
 * Intègre le Verrou d'Homogénéité et la détection des quotas institutionnels.
 */
export const createCheckoutSession = async (req: any, res: Response) => {
    const userId = req.user?.userId;
    const { items } = req.body;

    if (!userId) return res.status(401).json({ error: "Identification requise." });

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).json({ error: "Dossier utilisateur introuvable." });

        const isBookerInstitutional = user.role === 'PRO' || user.isEmployee;

        for (const item of items) {
            if (item.workshopId) {
                const ws = await prisma.workshop.findUnique({ where: { id: item.workshopId } });
                if (!ws) throw new Error("Séance de formation introuvable.");

                // 1️⃣ VÉRIFICATION DU VERROU D'HOMOGÉNÉITÉ
                if (item.participants && item.participants.length > 0) {
                    for (const participant of item.participants) {
                        if (participant.memberCode) {
                            const guest = await prisma.user.findUnique({
                                where: { memberCode: participant.memberCode.toUpperCase() }
                            });
                            if (!guest) return res.status(400).json({ error: `Le code ${participant.memberCode} est inconnu.` });

                            const isGuestInstitutional = guest.role === 'PRO' || guest.isEmployee;
                            if (isBookerInstitutional !== isGuestInstitutional) {
                                return res.status(400).json({ error: "La mixité entre membres standards et entreprises est interdite." });
                            }
                        } else if (isBookerInstitutional) {
                            return res.status(400).json({ error: "Les membres CE doivent certifier l'identité via un code membre." });
                        }
                    }
                }

                // 2️⃣ DÉTERMINATION DU STATUT BUSINESS (CE / GROUPES)
                item.isBusiness = item.quantity >= 25 || user.role === "PRO";
                item.price = isBookerInstitutional ? ws.priceInstitutional : ws.price;
                item.name = ws.title;
                item.description = ws.description;
                item.image = ws.image;

            } else if (item.volumeId) {
                const vol = await prisma.productVolume.findUnique({ where: { id: item.volumeId }, include: { product: true } });
                if (!vol || vol.stock < item.quantity) return res.status(400).json({ error: "Stock insuffisant." });
                item.price = vol.price;
                item.name = `${vol.product.name} (${vol.size}${vol.unit})`;
                item.description = vol.product.description;
                item.isBusiness = false;
            }
        }

        const totalAmount = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
        const isOrderBusiness = items.some((i: any) => i.isBusiness);

        // 3️⃣ CRÉATION DU DOSSIER EN ATTENTE
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
                        // Pour les commandes non-business (individuelles), on crée les participants de suite
                        participants: (item.workshopId && !item.isBusiness) ? {
                            create: item.participants?.map((p: any) => ({
                                firstName: p.firstName, lastName: p.lastName, phone: p.phone || "", email: p.email || "",
                                memberCode: p.memberCode?.toUpperCase()
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
                    currency: 'eur', unit_amount: Math.round(item.price * 100),
                    product_data: { name: item.name, description: item.description, images: item.image ? [item.image] : [] },
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
        res.status(500).json({ error: "Échec technique du registre de vente." });
    }
};

/**
 * 📜 CONFIRMATION TECHNIQUE (WEBHOOK STRIPE)
 * Assure le scellage des places en base de données pour les commandes de groupe.
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
                // 1. Validation du Dossier
                const updatedOrder = await tx.order.update({
                    where: { id: orderId },
                    data: { status: "PAYÉ" },
                    include: { items: { include: { workshop: true, participants: true } } }
                });

                // 2. Scellage des stocks et des places (Slots)
                for (const item of updatedOrder.items) {
                    if (item.volumeId) {
                        await tx.productVolume.update({
                            where: { id: item.volumeId }, data: { stock: { decrement: item.quantity } }
                        });
                    }

                    // 🏺 LOGIQUE DE GÉNÉRATION MASSIVE DES PLACES
                    // Indispensable pour les 25 places CE (isBusiness) ou toute séance sans participants identifiés
                    if (item.workshop && item.participants.length === 0) {

                        // Si c'est un achat Business, on crée d'abord le groupe institutionnel
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

                        // 🏺 Gravure des identifiants réels pour le PDF (25 places)
                        const participantsData = Array.from({ length: item.quantity }).map(() => ({
                            orderItemId: item.id,
                            companyGroupId: companyGroupId,
                            isValidated: false
                        }));

                        await tx.participant.createMany({ data: participantsData });
                        console.log(`✅ ${item.quantity} slots participants scellés pour l'item ${item.id}`);
                    }
                }

                // 3. Extraction finale pour confirmation
                const finalOrder = await tx.order.findUnique({
                    where: { id: orderId },
                    include: { user: true, items: { include: { workshop: true, participants: true } } }
                });

                if (finalOrder?.user) {
                    await sendOrderConfirmationEmail(finalOrder.user.email, finalOrder);
                }
            });
        } catch (error: any) {
            console.error("❌ Incident de scellage Webhook :", error.message);
        }
    }
    res.json({ received: true });
};