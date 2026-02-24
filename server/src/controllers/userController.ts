import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

/**
 * --- 👤 PARTIE CLIENT (Auto-gestion) ---
 */

export const getMe = async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Session invalide." });

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                memberCode: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                conceptionLevel: true,
                role: true,
                createdAt: true
            }
        });
        if (!user) return res.status(404).json({ error: "Profil introuvable." });
        return res.json(user);
    } catch (error) {
        return res.status(500).json({ error: "Erreur de lecture du profil." });
    }
};

export const updateMe = async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.user?.userId;
    const { firstName, lastName, email, phone } = req.body;

    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { firstName, lastName, email, phone },
            select: {
                id: true,
                memberCode: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                conceptionLevel: true
            }
        });
        return res.json(updatedUser);
    } catch (error) {
        return res.status(500).json({ error: "Échec de la mise à jour." });
    }
};

/**
 * --- 🏛️ PARTIE ADMINISTRATION ---
 */

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            where: { role: 'USER' },
            select: {
                id: true,
                memberCode: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                conceptionLevel: true,
                createdAt: true,
                _count: { select: { orders: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de l'accès au registre." });
    }
};

export const getUserDetails = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    try {
        const customer = await prisma.user.findUnique({
            where: { id },
            include: {
                orders: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        });
        if (!customer) return res.status(404).json({ error: "Client introuvable." });
        res.json(customer);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la lecture du dossier." });
    }
};

export const updateUserProfile = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { firstName, lastName, phone, conceptionLevel, email } = req.body;

    try {
        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                firstName,
                lastName,
                email,
                phone,
                conceptionLevel: (conceptionLevel !== undefined && conceptionLevel !== null)
                    ? parseInt(String(conceptionLevel))
                    : undefined
            }
        });
        res.json(updatedUser);
    } catch (error) {
        res.status(404).json({ error: "Erreur de mise à jour du dossier." });
    }
};

export const validateUserLevel = async (req: Request, res: Response) => {
    const userId = req.params.userId as string;
    const { newLevel } = req.body;

    try {
        // 🏺 Correction : On force la conversion et on valide que c'est un nombre
        const level = parseInt(String(newLevel));

        if (isNaN(level)) {
            return res.status(400).json({ error: "Le palier technique doit être une valeur numérique." });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { conceptionLevel: level }
        });

        res.json({
            message: "Palier technique certifié avec succès.",
            userLevel: updatedUser.conceptionLevel
        });
    } catch (error) {
        res.status(404).json({ error: "Impossible de valider le palier technique." });
    }
};

export const verifyMemberCode = async (req: Request, res: Response) => {
    const code = req.params.code as string;

    if (!code) {
        return res.status(400).json({ error: "Code manquant." });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { memberCode: code },
            select: {
                firstName: true,
                lastName: true,
                conceptionLevel: true
            }
        });
        if (!user) return res.status(404).json({ error: "Code membre invalide." });
        return res.json(user);
    } catch (error) {
        return res.status(500).json({ error: "Erreur de vérification technique." });
    }
};