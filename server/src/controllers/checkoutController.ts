import { Request, Response } from 'express';
import Stripe from 'stripe';
import crypto from 'crypto';
import { prisma } from '../lib/prisma';
import { sendOrderConfirmationEmail, sendGiftCardEmail } from '../services/emailService';
import { generateGiftCardPDF } from '../services/pdf';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

/**
 * 📜 PROTOCOLE DE SCELLAGE DE SESSION DE PAIEMENT
 * Gère l'hybridation des flux et l'application des crédits (Titres de Cursus).
 */
export const createCheckoutSession = async (req: any, res: Response) => {
    const userId = req.user?.userId;
    const { items, giftCardCode } = req.body;

    if (!userId) return res.status(401).json({ error: "Identification requise au Registre." });

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).json({ error: "Dossier utilisateur introuvable." });

        const isInstitutional = user.role === 'PRO' || user.isEmployee;

        // 1. Traitement des articles et certification des prix en base
        const processedItems = await Promise.all(items.map(async (item: any) => {
            let verifiedPrice = 0;
            let itemName = item.name || "Article";
            let itemDesc = "";
            let itemImg = null;

            const isGiftCardItem = item.type === 'GIFT_CARD' || (!item.workshopId && !item.volumeId && (item.amount > 0 || item.price > 0));

            if (isGiftCardItem) {
                const amount = parseFloat(item.amount || item.price);
                if (isNaN(amount) || amount < 1) throw new Error("Le montant du Titre est invalide.");
                verifiedPrice = amount;
                itemName = "TITRE DE CURSUS"; // 🏺 Terme professionnel scellé
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

            return {
                ...item,
                price: verifiedPrice,
                name: itemName,
                description: itemDesc,
                image: itemImg,
                quantity: Math.max(1, parseInt(item.quantity) || 1)
            };
        }));

        // Sécurité Quota (Limite de 25 places pour les séances techniques)
        const workshopTotals: Record<string, number> = {};
        processedItems.forEach(item => {
            if (item.workshopId) workshopTotals[item.workshopId] = (workshopTotals[item.workshopId] || 0) + item.quantity;
        });

        if (isInstitutional) {
            for (const total of Object.values(workshopTotals)) {
                if (total > 25) throw new Error("Le protocole institutionnel limite la réservation à 25 places par séance technique.");
            }
        }

        const subTotal = processedItems.reduce((acc, i) => acc + (i.price * i.quantity), 0);

        // --- 🏺 2. LOGIQUE DE RÉDUCTION (CARTE CADEAU) ---
        let discountAmount = 0;
        let giftCardIdUsed = null;
        let stripeCouponId: string | undefined = undefined;

        if (giftCardCode) {
            const giftCard = await prisma.giftCard.findUnique({ where: { code: giftCardCode } });

            // Vérification de validité : active, solde > 0 et non expirée
            if (giftCard && giftCard.status === 'ACTIF' && new Date(giftCard.expiresAt) > new Date()) {
                discountAmount = Math.min(subTotal, giftCard.balance);
                giftCardIdUsed = giftCard.id;

                // 🏺 CRÉATION DU COUPON VISUEL POUR STRIPE
                const coupon = await stripe.coupons.create({
                    amount_off: Math.round(discountAmount * 100), // Stripe utilise les centimes
                    currency: 'eur',
                    duration: 'once',
                    name: `TITRE : ${giftCardCode}` // S'affichera dans le résumé Stripe à gauche
                });
                stripeCouponId = coupon.id;
            }
        }

        const finalTotal = subTotal - discountAmount;
        if (finalTotal > 0 && finalTotal < 0.5) throw new Error("Le montant résiduel est inférieur au minimum autorisé.");

        const isOrderBusiness = processedItems.some(i => i.isBusiness);

        // 3. Création de la commande en base (Total net scellé)
        const pendingOrder = await prisma.order.create({
            data: {
                userId,
                reference: isOrderBusiness ? `CORP-${Date.now()}` : `ORD-${Date.now()}`,
                total: finalTotal,
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

        // --- 🏺 4. ÉMISSION SESSION STRIPE AVEC COUPON ---
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: processedItems.map((item) => ({
                price_data: {
                    currency: 'eur',
                    unit_amount: Math.round(item.price * 100), // Prix plein unitaire
                    product_data: {
                        name: item.name,
                        description: item.description || "",
                        images: (item.image && item.image.startsWith('http')) ? [item.image] : []
                    },
                },
                quantity: item.quantity,
            })),
            // On applique le coupon de réduction ici pour un affichage explicite
            discounts: stripeCouponId ? [{ coupon: stripeCouponId }] : [],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/mon-compte?payment_success=true&orderId=${pendingOrder.id}`,
            cancel_url: `${process.env.FRONTEND_URL}/boutique`,
            customer_email: user.email,
            metadata: {
                orderId: pendingOrder.id,
                giftCardIdUsed: giftCardIdUsed,
                discountApplied: discountAmount.toString()
            }
        });

        res.status(200).json({ url: session.url });
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Échec technique du Registre financier." });
    }
};

/**
 * 📜 WEBHOOK STRIPE : Confirmation et Scellage des Droits
 */
export const handleWebhook = async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'] as string;
    let event: Stripe.Event;

    console.log("🏺 [DEBUG_START] --- RÉCEPTION WEBHOOK STRIPE ---");

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET as string);
        console.log(`✅ [DEBUG_SIGNATURE] Signature Stripe certifiée : ${event.type}`);
    } catch (err: any) {
        console.error(`❌ [DEBUG_FATAL] Signature Stripe invalide : ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;
        const giftCardIdUsed = session.metadata?.giftCardIdUsed;
        const discountApplied = parseFloat(session.metadata?.discountApplied || "0");

        console.log(`🏺 [DEBUG_DATA] Session validée. ID Dossier : ${orderId}`);

        if (!orderId) {
            console.error("❌ [DEBUG_ERROR] Pas de 'orderId' dans les métadonnées Stripe !");
            return res.status(400).json({ error: "Missing orderId" });
        }

        try {
            console.log("🏺 [DEBUG_DB] Ouverture de la transaction Prisma...");

            await prisma.$transaction(async (tx) => {

                // 1. DÉBIT DU CRÉDIT (Si applicable)
                if (giftCardIdUsed && discountApplied > 0) {
                    const card = await tx.giftCard.findUnique({ where: { id: giftCardIdUsed } });
                    if (card) {
                        const newBalance = Math.max(0, card.balance - discountApplied);
                        await tx.giftCard.update({
                            where: { id: giftCardIdUsed },
                            data: { balance: newBalance, status: newBalance <= 0 ? 'ÉPUISÉ' : 'ACTIF' }
                        });
                        console.log(`   ✅ [DB_CREDIT] Solde mis à jour : ${newBalance}€`);
                    }
                }

                // 2. MISE À JOUR DU STATUT DU DOSSIER
                console.log(`   ➡️ [DB_STEP_1] Passage du dossier ${orderId} au statut PAYÉ...`);
                const order = await tx.order.update({
                    where: { id: orderId },
                    data: { status: "PAYÉ" },
                    include: { items: { include: { workshop: true } }, user: true }
                });
                console.log(`   ✅ [DB_SUCCESS] Statut scellé pour ${order.reference}`);

                // 3. TRAITEMENT DES ARTICLES
                for (const item of order.items) {
                    console.log(`      🔎 [ITEM_CHECK] Article: "${item.name}" (Qty: ${item.quantity})`);

                    // --- 🏺 CAS A : TITRE DE CURSUS (Génération du Code) ---
                    if (item.groupNames === 'GIFT_CARD') {
                        console.log("      🚀 [ACTION] Génération d'un Titre de Cursus...");

                        const giftCard = await tx.giftCard.create({
                            data: {
                                code: `RHUM-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
                                amount: item.price,
                                balance: item.price,
                                expiresAt: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
                            }
                        });

                        // 🏺 SCELLAGE DU NOM : On injecte le code RHUM- dans le nom de l'article en base
                        await tx.orderItem.update({
                            where: { id: item.id },
                            data: { name: `TITRE DE CURSUS : ${giftCard.code}` }
                        });

                        console.log(`      ✅ [DB_SUCCESS] Code généré et scellé : ${giftCard.code}`);

                        // Envoi immédiat du titre solo par email
                        const pdfBytes = await generateGiftCardPDF(giftCard);
                        await sendGiftCardEmail(order.user.email, giftCard, Buffer.from(pdfBytes));
                    }

                    // --- 🏺 CAS B : SÉANCE TECHNIQUE (Participants) ---
                    if (item.workshopId) {
                        console.log(`      🚀 [ACTION] Séance technique détectée. Création de ${item.quantity} participants...`);

                        let companyGroupId = null;
                        if (order.isBusiness) {
                            const group = await tx.companyGroup.create({
                                data: {
                                    name: `Contrat ${order.reference}`,
                                    ownerId: order.userId,
                                    currentLevel: item.workshop?.level || 0
                                }
                            });
                            companyGroupId = group.id;
                            console.log(`      ✅ [DB_SUCCESS] Groupe institutionnel créé : ${group.id}`);
                        }

                        const pData = Array.from({ length: item.quantity }).map(() => ({
                            orderItemId: item.id,
                            companyGroupId,
                            isValidated: false
                        }));

                        await tx.participant.createMany({ data: pData });
                        console.log(`      ✅ [DB_SUCCESS] ${pData.length} participants inscrits.`);
                    }

                    // --- 🏺 CAS C : STOCKS BOUTIQUE ---
                    if (item.volumeId) {
                        await tx.productVolume.update({
                            where: { id: item.volumeId },
                            data: { stock: { decrement: item.quantity } }
                        });
                        console.log("      ✅ [DB_SUCCESS] Stock boutique décrémenté.");
                    }
                }
            });

            console.log("🏺 [DEBUG_COMMIT] Transaction Prisma validée (COMMIT).");

            // --- 🏺 PHASE B : ÉMISSION DU DOSSIER GLOBAL (Hors transaction) ---
            console.log("🏺 [DEBUG_PDF] Rechargement du dossier final pour émission PDF...");
            const finalOrder = await prisma.order.findUnique({
                where: { id: orderId },
                include: {
                    user: true,
                    items: {
                        include: {
                            workshop: true,
                            participants: true,
                            volume: { include: { product: true } }
                        }
                    }
                }
            });

            if (finalOrder) {
                // Ici, finalOrder.items[x].name contiendra désormais "TITRE DE CURSUS : RHUM-XXXX"
                console.log(`🏺 [DEBUG_SEND] Lancement du moteur d'email global pour ${finalOrder.user.email}`);
                await sendOrderConfirmationEmail(finalOrder.user.email, finalOrder);
                console.log("✅ [FINAL] Dossier global expédié.");
            }

        } catch (error: any) {
            console.error("❌ [DEBUG_ROLLBACK] Échec critique détecté !");
            console.error("❌ [ERREUR_DÉTAILLÉE] :", error.message);
        }
    }

    console.log("🏺 [DEBUG_END] --- FIN DU PROTOCOLE ---");
    res.json({ received: true });
};