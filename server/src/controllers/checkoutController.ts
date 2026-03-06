import { Request, Response } from 'express';
import Stripe from 'stripe';
import crypto from 'crypto';
import { prisma } from '../lib/prisma';
import { sendOrderConfirmationEmail, sendGiftCardEmail } from '../services/emailService';
import { generateGiftCardPDF } from '../services/pdf';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

/**
 * 📜 PROTOCOLE DE SCELLAGE DE SESSION DE PAIEMENT
 * Gère l'hybridation des flux et l'application des crédits (Cartes Cadeaux).
 */
export const createCheckoutSession = async (req: any, res: Response) => {
    const userId = req.user?.userId;
    // 🏺 SCELLAGE : Récupération des articles ET du code de réduction éventuel
    const { items, giftCardCode } = req.body;

    if (!userId) return res.status(401).json({ error: "Identification requise au Registre." });

    console.log("--------------------------------------------------");
    console.log("🏺 [ENTRÉE] RÉCEPTION FLUX BRUT DU PANIER :");
    console.dir({ items, giftCardCode }, { depth: null });

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).json({ error: "Dossier utilisateur introuvable." });

        const isInstitutional = user.role === 'PRO' || user.isEmployee;

        // 1. Traitement des articles et vérification des prix en base
        const processedItems = await Promise.all(items.map(async (item: any, index: number) => {
            let verifiedPrice = 0;
            let itemName = item.name || "Article";
            let itemDesc = "";
            let itemImg = null;

            const isGiftCardItem = item.type === 'GIFT_CARD' || (!item.workshopId && !item.volumeId && (item.amount > 0 || item.price > 0));

            if (isGiftCardItem) {
                const amount = parseFloat(item.amount || item.price);
                if (isNaN(amount) || amount < 1) throw new Error("Le montant du Titre est invalide.");
                verifiedPrice = amount;
                itemName = "CARTE CADEAU ÉTABLISSEMENT";
                itemDesc = `Titre au porteur - Crédit de ${amount}€ (Validité 12 mois).`;
                item.type = 'GIFT_CARD';
            }
            else if (item.workshopId) {
                const ws = await prisma.workshop.findUnique({ where: { id: item.workshopId } });
                if (!ws) throw new Error(`Séance technique ${item.workshopId} introuvable.`);
                verifiedPrice = isInstitutional ? ws.priceInstitutional : ws.price;
                itemName = ws.title;
                itemDesc = ws.description;
                itemImg = ws.image;
            }
            else if (item.volumeId) {
                const vol = await prisma.productVolume.findUnique({ where: { id: item.volumeId }, include: { product: true } });
                if (!vol) throw new Error(`Référence boutique ${item.volumeId} introuvable.`);
                verifiedPrice = isInstitutional ? vol.price * 0.9 : vol.price;
                itemName = `${vol.product.name} (${vol.size}${vol.unit})`;
                itemDesc = vol.product.description || "";
                itemImg = vol.product.image;
            }

            console.log(`🏺 [TRAITEMENT #${index}] Name: "${itemName}" | Price: ${verifiedPrice}`);

            return {
                ...item,
                price: verifiedPrice,
                name: itemName,
                description: itemDesc,
                image: itemImg,
                quantity: Math.max(1, parseInt(item.quantity) || 1)
            };
        }));

        const workshopTotals: Record<string, number> = {};
        processedItems.forEach(item => {
            if (item.workshopId) {
                workshopTotals[item.workshopId] = (workshopTotals[item.workshopId] || 0) + item.quantity;
            }
        });

        if (isInstitutional) {
            for (const [id, total] of Object.entries(workshopTotals)) {
                if (total > 25) {
                    console.error(`❌ [SÉCURITÉ] Tentative de cumul illégal : ${total} places pour workshop ${id}`);
                    throw new Error("Le protocole institutionnel limite la réservation à 25 places par séance technique.");
                }
            }
        }

        const subTotal = processedItems.reduce((acc, i) => acc + (i.price * i.quantity), 0);

        // 🏺 2. LOGIQUE DE RÉDUCTION (CARTE CADEAU)
        let discountAmount = 0;
        let giftCardIdUsed = null;

        if (giftCardCode) {
            const giftCard = await prisma.giftCard.findUnique({ where: { code: giftCardCode } });

            // Vérification de validité : active, solde > 0 et non expirée
            if (giftCard && giftCard.status === 'ACTIF' && new Date(giftCard.expiresAt) > new Date()) {
                discountAmount = Math.min(subTotal, giftCard.balance);
                giftCardIdUsed = giftCard.id;
                console.log(`🏺 [PROMO] Application du code ${giftCardCode} : -${discountAmount}€`);
            }
        }

        const finalTotal = subTotal - discountAmount;

        // Stripe refuse les paiements inférieurs à 0.50€
        if (finalTotal > 0 && finalTotal < 0.5) {
            throw new Error(`Le montant résiduel (${finalTotal}€) est inférieur au minimum autorisé.`);
        }

        const isOrderBusiness = processedItems.some(i => i.isBusiness);

        // 3. Création de la commande avec le total RÉEL (déduit)
        const pendingOrder = await prisma.order.create({
            data: {
                userId,
                reference: isOrderBusiness ? `CORP-${Date.now()}` : `ORD-${Date.now()}`,
                total: finalTotal, // On scelle le montant net en base
                status: 'EN_ATTENTE_PAIEMENT',
                isBusiness: isOrderBusiness,
                items: {
                    create: processedItems.map((item) => ({
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price,
                        workshopId: item.workshopId || null,
                        volumeId: item.volumeId || null,
                        groupNames: item.type === 'GIFT_CARD' ? 'GIFT_CARD' : null,
                    }))
                }
            }
        });

        // 🏺 4. ÉMISSION SESSION STRIPE AVEC PRIX AJUSTÉS
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: processedItems.map((item) => {
                // On applique la réduction proportionnellement sur chaque article pour Stripe
                const itemTotal = item.price * item.quantity;
                const ratio = subTotal > 0 ? itemTotal / subTotal : 0;
                const itemDiscount = discountAmount * ratio;
                const adjustedPrice = (itemTotal - itemDiscount) / item.quantity;

                return {
                    price_data: {
                        currency: 'eur',
                        unit_amount: Math.round(adjustedPrice * 100), // Conversion en centimes
                        product_data: {
                            name: item.name,
                            description: discountAmount > 0 ? "Prix après déduction crédit" : (item.description || ""),
                            images: (item.image && item.image.startsWith('http')) ? [item.image] : []
                        },
                    },
                    quantity: item.quantity,
                };
            }),
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/mon-compte?payment_success=true&orderId=${pendingOrder.id}`,
            cancel_url: `${process.env.FRONTEND_URL}/boutique`,
            customer_email: user.email,
            // 🏺 Métadonnées pour le Webhook
            metadata: {
                orderId: pendingOrder.id,
                giftCardIdUsed: giftCardIdUsed,
                discountApplied: discountAmount.toString()
            }
        });

        res.status(200).json({ url: session.url });

    } catch (error: any) {
        console.error("❌ [ERREUR FATALE REGISTRE] :", error.message);
        res.status(500).json({ error: error.message || "Échec technique du Registre financier." });
    }
};

/**
 * 📜 WEBHOOK STRIPE : Confirmation et Débit du crédit
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
        const giftCardIdUsed = session.metadata?.giftCardIdUsed;
        const discountApplied = parseFloat(session.metadata?.discountApplied || "0");

        try {
            await prisma.$transaction(async (tx) => {
                // 🏺 1. DÉBIT DU SOLDE DE LA CARTE UTILISÉE
                if (giftCardIdUsed && discountApplied > 0) {
                    const card = await tx.giftCard.findUnique({ where: { id: giftCardIdUsed } });
                    if (card) {
                        const newBalance = Math.max(0, card.balance - discountApplied);
                        await tx.giftCard.update({
                            where: { id: giftCardIdUsed },
                            data: {
                                balance: newBalance,
                                status: newBalance <= 0 ? 'ÉPUISÉ' : 'ACTIF'
                            }
                        });
                        console.log(`🏺 [CREDIT] Débit de ${discountApplied}€ effectué sur la carte ${card.code}`);
                    }
                }

                // 2. Mise à jour de la commande
                const order = await tx.order.update({
                    where: { id: orderId },
                    data: { status: "PAYÉ" },
                    include: { items: { include: { workshop: true, participants: true } }, user: true }
                });

                for (const item of order.items) {
                    // Création de nouvelles Gift Cards si achetées
                    if (item.groupNames === 'GIFT_CARD') {
                        const expirationDate = new Date();
                        expirationDate.setFullYear(expirationDate.getFullYear() + 1);

                        const giftCard = await tx.giftCard.create({
                            data: {
                                code: `RHUM-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
                                amount: item.price, balance: item.price, expiresAt: expirationDate
                            }
                        });

                        await tx.orderItem.update({
                            where: { id: item.id },
                            data: { name: `CARTE CADEAU : ${giftCard.code}` }
                        });

                        const pdfUint8Array = await generateGiftCardPDF(giftCard);
                        await sendGiftCardEmail(order.user.email, giftCard, Buffer.from(pdfUint8Array));
                    }

                    if (item.volumeId) {
                        await tx.productVolume.update({ where: { id: item.volumeId }, data: { stock: { decrement: item.quantity } } });
                    }

                    if (item.workshop && item.participants.length === 0) {
                        let companyGroupId = null;
                        if (order.isBusiness) {
                            const group = await tx.companyGroup.create({
                                data: { name: `Contrat ${order.reference}`, ownerId: order.userId, currentLevel: item.workshop.level }
                            });
                            companyGroupId = group.id;
                        }
                        const pData = Array.from({ length: item.quantity }).map(() => ({ orderItemId: item.id, companyGroupId, isValidated: false }));
                        await tx.participant.createMany({ data: pData });
                    }
                }
                await sendOrderConfirmationEmail(order.user.email, order);
                console.log(`✅ [WEBHOOK] Scellage terminé avec succès pour ${orderId}`);
            });
        } catch (error: any) {
            console.error("❌ Incident Webhook :", error.message);
        }
    }
    res.json({ received: true });
};