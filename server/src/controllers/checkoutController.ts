import { Request, Response } from 'express';
import Stripe from 'stripe';
import crypto from 'crypto';
import { prisma } from '../lib/prisma';
import { sendOrderConfirmationEmail, sendGiftCardEmail } from '../services/emailService';
import { generateGiftCardPDF } from '../services/pdf';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

/**
 * 📜 PROTOCOLE DE SCELLAGE DE SESSION DE PAIEMENT
 * Gère l'hybridation des flux et l'application des crédits.
 * Version : 2026.03.15 - Sécurisation des contraintes relationnelles.
 */
export const createCheckoutSession = async (req: any, res: Response) => {
    const userId = req.user?.userId;
    const { items, giftCardCode } = req.body;

    if (!userId) return res.status(401).json({ error: "Identification requise au Registre." });

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).json({ error: "Dossier utilisateur introuvable." });

        const isInstitutional = user.role === 'PRO' || user.isEmployee;

        // --- 🏺 1. CERTIFICATION ET IDENTIFICATION DES ARTICLES ---
        const processedItems = await Promise.all(items.map(async (item: any) => {
            let verifiedPrice = 0;
            let itemName = item.name || "Article";
            let itemDesc = "";
            let itemImg = null;

            // 🛡️ Identification robuste par la présence des IDs techniques
            const isGiftCard = item.type === 'GIFT_CARD';
            const wId = item.workshopId || (item.type === 'WORKSHOP' ? item.id : null);
            const vId = item.volumeId || (item.type === 'PRODUCT' ? item.id : null);

            if (isGiftCard) {
                const amount = parseFloat(item.amount || item.price);
                if (isNaN(amount) || amount < 1) throw new Error("Montant du Titre invalide.");
                verifiedPrice = amount;
                itemName = "TITRE DE CURSUS";
                itemDesc = `Titre au porteur - Crédit de ${amount}€ (Validité 12 mois).`;
            }
            else if (wId) {
                const ws = await prisma.workshop.findUnique({ where: { id: wId } });
                if (!ws) throw new Error("Séance technique introuvable. Veuillez vider votre panier.");
                verifiedPrice = isInstitutional ? ws.priceInstitutional : ws.price;
                itemName = ws.title;
                itemDesc = ws.description;
                itemImg = ws.image;
                item.workshopId = wId; // On harmonise l'ID pour la suite
            }
            else if (vId) {
                const vol = await prisma.productVolume.findUnique({
                    where: { id: vId },
                    include: { product: true }
                });
                if (!vol) throw new Error("Référence boutique introuvable. Veuillez vider votre panier.");
                verifiedPrice = isInstitutional ? vol.price * 0.9 : vol.price;
                itemName = `${vol.product.name} (${vol.size}${vol.unit})`;
                itemDesc = vol.product.description || "";
                itemImg = vol.product.image;
                item.volumeId = vId; // On harmonise l'ID
            } else {
                // 🚨 C'est ici que ça bloquait : le serveur ne trouvait aucune des 3 options
                throw new Error("Structure d'article non reconnue par l'Établissement.");
            }

            return {
                ...item,
                name: itemName,
                description: itemDesc,
                image: itemImg,
                price: verifiedPrice,
                quantity: Math.max(1, parseInt(item.quantity) || 1),
                workshopId: isGiftCard ? null : item.workshopId,
                volumeId: isGiftCard ? null : item.volumeId,
                type: isGiftCard ? 'GIFT_CARD' : (item.workshopId ? 'WORKSHOP' : 'PRODUCT')
            };
        }));

        // --- 🏺 2. CALCULS ET QUOTAS ---
        const subTotal = processedItems.reduce((acc, i) => acc + (i.price * i.quantity), 0);

        let discountAmount = 0;
        let giftCardIdUsed = null;
        let stripeCouponId: string | undefined = undefined;

        if (giftCardCode) {
            const giftCard = await prisma.giftCard.findUnique({ where: { code: giftCardCode } });
            if (giftCard && giftCard.status === 'ACTIF' && new Date(giftCard.expiresAt) > new Date()) {
                discountAmount = Math.min(subTotal, giftCard.balance);
                giftCardIdUsed = giftCard.id;
                const coupon = await stripe.coupons.create({
                    amount_off: Math.round(discountAmount * 100),
                    currency: 'eur',
                    duration: 'once',
                    name: `TITRE : ${giftCardCode}`
                });
                stripeCouponId = coupon.id;
            }
        }

        const finalTotal = subTotal - discountAmount; // Le frais de port est sélectionné par le client sur Stripe et enregistré via le webhook
        const isOrderBusiness = processedItems.some(i => i.isBusiness);

        // La livraison ne concerne que les produits physiques (bouteilles).
        // Les ateliers et cartes cadeaux n'ont pas besoin d'adresse de livraison.
        const hasPhysicalProducts = processedItems.some(i => i.type === 'PRODUCT');

        // --- 🏺 3. CRÉATION DE LA COMMANDE ---
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

        // --- 4. SESSION STRIPE ---
        const pickupRateId = process.env.STRIPE_SHIPPING_RATE_PICKUP;
        const deliveryRateId = process.env.STRIPE_SHIPPING_RATE_DELIVERY;
        if (!pickupRateId || !deliveryRateId) {
            throw new Error("Variables STRIPE_SHIPPING_RATE_PICKUP / STRIPE_SHIPPING_RATE_DELIVERY manquantes. Redémarrez le serveur.");
        }

        // Stripe interdit de combiner shipping_options et discounts dans le même appel.
        // On construit l'objet de session dynamiquement pour n'inclure que l'un ou l'autre.
        const sessionParams: Stripe.Checkout.SessionCreateParams = {
            payment_method_types: ['card'],
            line_items: processedItems.map((item) => ({
                price_data: {
                    currency: 'eur',
                    unit_amount: Math.round(item.price * 100),
                    product_data: {
                        name: item.name,
                        description: item.description || "",
                        images: (item.image && item.image.startsWith('http')) ? [item.image] : []
                    },
                },
                quantity: item.quantity,
            })),
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/mon-compte?payment_success=true&orderId=${pendingOrder.id}`,
            cancel_url: `${process.env.FRONTEND_URL}/boutique`,
            customer_email: user.email,
            metadata: { orderId: pendingOrder.id, giftCardIdUsed, discountApplied: discountAmount.toString() }
        };

        if (stripeCouponId) {
            // Coupon appliqué : on utilise discounts, pas de shipping_options (limitation Stripe)
            sessionParams.discounts = [{ coupon: stripeCouponId }];
        } else if (hasPhysicalProducts) {
            // Produits physiques sans coupon : on affiche le sélecteur de livraison
            sessionParams.shipping_address_collection = { allowed_countries: ['FR'] };
            sessionParams.shipping_options = [
                { shipping_rate: pickupRateId },
                { shipping_rate: deliveryRateId }
            ];
        }
        // Ateliers / cartes cadeaux uniquement : pas de livraison, PDF + QR code généré à la confirmation

        const session = await stripe.checkout.sessions.create(sessionParams);

        res.status(200).json({ url: session.url });
    } catch (error: any) {
        console.error("❌ ERREUR REGISTRE :", error.message);
        res.status(500).json({ error: error.message });
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

            // --- 🏺 EXTRACTION DES DONNÉES DE LIVRAISON STRIPE ---
            const shippingAmountCents = session.shipping_cost?.amount_total ?? 0;
            const shippingRateId = typeof session.shipping_cost?.shipping_rate === 'string'
                ? session.shipping_cost.shipping_rate
                : session.shipping_cost?.shipping_rate?.id;
            const deliveryMethodFromStripe: 'PICKUP' | 'DELIVERY' =
                shippingRateId === process.env.STRIPE_SHIPPING_RATE_DELIVERY ? 'DELIVERY' : 'PICKUP';
            const shippingCostFromStripe = shippingAmountCents / 100;
            const addr = (session as any).shipping_details?.address;
            const shippingAddressFromStripe = addr
                ? JSON.stringify({ street: addr.line1, zip: addr.postal_code, city: addr.city })
                : null;
            console.log(`🏺 [DEBUG_SHIPPING] Méthode: ${deliveryMethodFromStripe} | Coût: ${shippingCostFromStripe}€`);

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

                // 2. MISE À JOUR DU STATUT ET DES INFOS DE LIVRAISON
                console.log(`   ➡️ [DB_STEP_1] Passage du dossier ${orderId} au statut PAYÉ...`);
                const order = await tx.order.update({
                    where: { id: orderId },
                    data: {
                        status: "PAYÉ",
                        deliveryMethod: deliveryMethodFromStripe,
                        shippingCost: shippingCostFromStripe,
                        shippingAddress: shippingAddressFromStripe,
                        total: { increment: shippingCostFromStripe }
                    },
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
                // Si la commande ne contient QUE des cartes cadeaux, le client a déjà reçu
                // un email dédié par carte cadeau (avec PDF). On évite le doublon.
                const isOnlyGiftCards = finalOrder.items.every(item => item.groupNames === 'GIFT_CARD');

                if (!isOnlyGiftCards) {
                    console.log(`🏺 [DEBUG_SEND] Envoi de la confirmation de commande à ${finalOrder.user.email}`);
                    await sendOrderConfirmationEmail(finalOrder.user.email, finalOrder);
                    console.log("✅ [FINAL] Confirmation de commande expédiée.");
                } else {
                    console.log("ℹ️ [FINAL] Commande 100% carte cadeau — confirmation globale omise (déjà envoyée).");
                }
            }

        } catch (error: any) {
            console.error("❌ [DEBUG_ROLLBACK] Échec critique détecté !");
            console.error("❌ [ERREUR_DÉTAILLÉE] :", error.message);
        }
    }

    console.log("🏺 [DEBUG_END] --- FIN DU PROTOCOLE ---");
    res.json({ received: true });
};