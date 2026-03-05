import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import crypto from 'crypto';

/**
 * 🏺 GÉNÉRATION D'UN TITRE DE CURSUS (Carte Cadeau)
 * Scelle un montant avec une validité de 12 mois.
 */
export const createGiftCard = async (req: Request, res: Response) => {
    const { amount } = req.body;

    try {
        const uniqueCode = `RHUM-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

        // 🏺 Calcul de l'échéance : +12 mois
        const expirationDate = new Date();
        expirationDate.setFullYear(expirationDate.getFullYear() + 1);

        const giftCard = await prisma.giftCard.create({
            data: {
                code: uniqueCode,
                amount: parseFloat(amount),
                balance: parseFloat(amount),
                expiresAt: expirationDate
            }
        });

        res.json({
            message: "Titre de Cursus généré avec succès.",
            giftCard
        });
    } catch (error) {
        res.status(500).json({ error: "Échec technique lors de la création du titre." });
    }
};

/**
 * 🏺 VÉRIFICATION ET CONTRÔLE DE CADUCITÉ
 * Vérifie le solde et l'échéance des 12 mois au Registre.
 */
export const validateGiftCode = async (req: Request, res: Response) => {
    const { code } = req.body;

    try {
        const giftCard = await prisma.giftCard.findUnique({
            where: { code: code.toUpperCase() }
        });

        if (!giftCard || giftCard.balance <= 0) {
            return res.status(404).json({ error: "Ce code est inconnu ou épuisé." });
        }

        const now = new Date();
        if (now > giftCard.expiresAt) {
            // 🏺 SCELLAGE : On aligne l'orthographe sur le schéma (EXSPIRÉ avec un S)
            if (giftCard.status !== "EXSPIRÉ") {
                await prisma.giftCard.update({
                    where: { id: giftCard.id },
                    data: { status: "EXSPIRÉ" }
                });
            }
            return res.status(400).json({ error: "Ce titre est désormais caduc (12 mois dépassés)." });
        }

        res.json({ message: "Titre certifié.", balance: giftCard.balance });
    } catch (error) {
        res.status(500).json({ error: "Erreur de contrôle du flux." });
    }
};