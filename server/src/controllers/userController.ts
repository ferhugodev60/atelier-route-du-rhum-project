import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

/**
 * --- 👤 PARTIE CLIENT (Auto-gestion) ---
 */

// Récupérer son propre profil
export const getMe = async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.user?.userId;

    if (!userId) return res.status(401).json({ error: "Session invalide." });

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
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
    } catch (error: any) {
        return res.status(500).json({ error: "Erreur de lecture du profil." });
    }
};

// Mettre à jour ses informations personnelles
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
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                conceptionLevel: true
            }
        });
        return res.json(updatedUser);
    } catch (error: any) {
        return res.status(500).json({ error: "Échec de la mise à jour." });
    }
};

/**
 * --- 🏛️ PARTIE ADMINISTRATION (Gestion Clientèle) ---
 */

// Récupérer l'intégralité de la clientèle
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            where: { role: 'USER' }, // On exclut les administrateurs du listing
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                conceptionLevel: true,
                createdAt: true,
                _count: { select: { orders: true } } // Statistiques d'achat
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de l'accès au registre." });
    }
};

// Modifier une fiche client (Admin uniquement)
export const updateUserProfile = async (req: Request, res: Response) => {
    const id = req.params.id as string; // Sécurité de type Prisma
    const { firstName, lastName, phone, conceptionLevel, email } = req.body;

    try {
        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                firstName,
                lastName,
                email,
                phone,
                conceptionLevel: conceptionLevel ? parseInt(conceptionLevel) : undefined
            }
        });
        res.json(updatedUser);
    } catch (error) {
        res.status(404).json({ error: "Client introuvable ou erreur de données." });
    }
};

// Valider spécifiquement un niveau de cursus
export const validateUserLevel = async (req: Request, res: Response) => {
    const userId = req.params.userId as string;
    const { newLevel } = req.body;

    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { conceptionLevel: parseInt(newLevel) }
        });
        res.json({ message: "Progression validée", userLevel: updatedUser.conceptionLevel });
    } catch (error) {
        res.status(404).json({ error: "Impossible de valider le niveau." });
    }
};