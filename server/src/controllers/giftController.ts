import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import crypto from 'crypto';

/**
 * 🏺 GÉNÉRATION D'UN TITRE DE CURSUS (Carte Cadeau)
 * Scelle un montant avec une validité de 12 mois.
 * Peut être lié à un userId ou rester anonyme (Titre au porteur).
 */
export const createGiftCard = async (req: Request, res: Response) => {
    const { amount, userId } = req.body;

    try {
        const uniqueCode = `RHUM-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

        // 🏺 Calcul de l'échéance institutionnelle : +12 mois
        const expirationDate = new Date();
        expirationDate.setFullYear(expirationDate.getFullYear() + 1);

        const giftCard = await prisma.giftCard.create({
            data: {
                code: uniqueCode,
                amount: parseFloat(amount),
                balance: parseFloat(amount),
                expiresAt: expirationDate,
                userId: userId || null
            }
        });

        res.json({
            message: "Titre de Cursus scellé au Registre.",
            giftCard
        });
    } catch (error) {
        res.status(500).json({ error: "Échec technique lors de la création du titre." });
    }
};

/**
 * 🏺 RECHERCHE PAR SUFFIXE (Administration)
 * Permet d'identifier un titre via les derniers caractères du code (ex: A2B3).
 */
export const searchGiftCards = async (req: Request, res: Response) => {
    // 🏺 SCELLAGE : Assertion de type pour éviter les erreurs TS sur toUpperCase()
    const suffix = req.query.suffix as string;

    if (!suffix) return res.status(400).json({ error: "Suffixe de recherche manquant." });

    try {
        const giftCards = await prisma.giftCard.findMany({
            where: {
                code: {
                    endsWith: suffix.toUpperCase()
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(giftCards);
    } catch (error) {
        res.status(500).json({ error: "Erreur de lecture du Registre des titres." });
    }
};

/**
 * 🏺 DÉBIT MANUEL (Régularisation Physique)
 * Utilisé à l'accueil pour déduire une dépense effectuée sur place.
 */
export const debitGiftCardManually = async (req: Request, res: Response) => {
    const code = req.params.code as string;
    const { amountToDebit } = req.body;

    if (!code) return res.status(400).json({ error: "Code de titre manquant." });

    try {
        const result = await prisma.$transaction(async (tx) => {
            const card = await tx.giftCard.findUnique({
                where: { code: code.toUpperCase() }
            });

            if (!card) throw new Error("Titre introuvable au Registre.");
            if (card.status !== 'ACTIF') throw new Error("Ce titre est désormais caduc ou épuisé.");
            if (card.balance < amountToDebit) throw new Error("Solde insuffisant pour cette opération.");

            const newBalance = card.balance - amountToDebit;

            return await tx.giftCard.update({
                where: { code: code.toUpperCase() },
                data: {
                    balance: newBalance,
                    status: newBalance <= 0 ? 'ÉPUISÉ' : 'ACTIF'
                }
            });
        });

        res.json({
            message: "Régularisation physique scellée.",
            newBalance: result.balance
        });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

/**
 * 🏺 VÉRIFICATION DE VALIDITÉ (Public / Client)
 * Vérifie le solde et l'échéance des 12 mois avant application au panier.
 */
export const validateGiftCode = async (req: Request, res: Response) => {
    const code = req.body.code as string;

    if (!code) return res.status(400).json({ error: "Code manquant." });

    try {
        const giftCard = await prisma.giftCard.findUnique({
            where: { code: code.toUpperCase() }
        });

        if (!giftCard || giftCard.balance <= 0) {
            return res.status(404).json({ error: "Ce code est inconnu ou épuisé." });
        }

        const now = new Date();
        if (now > giftCard.expiresAt) {
            // 🏺 Mise à jour du statut si la date est dépassée
            if (giftCard.status !== "EXSPIRÉ") {
                await prisma.giftCard.update({
                    where: { id: giftCard.id },
                    data: { status: "EXSPIRÉ" }
                });
            }
            return res.status(400).json({ error: "Ce titre est désormais caduc (Validité 12 mois)." });
        }

        res.json({
            message: "Titre certifié.",
            balance: giftCard.balance
        });
    } catch (error) {
        res.status(500).json({ error: "Erreur de contrôle du flux financier." });
    }
};