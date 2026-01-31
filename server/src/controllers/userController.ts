import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

/**
 * RÉCUPÉRATION : GET /api/users/me
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

/**
 * MISE À JOUR : PATCH /api/users/me
 */
export const updateMe = async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.user?.userId;

    // 🏺 SÉCURITÉ : On extrait uniquement les champs autorisés
    // On ignore volontairement 'conceptionLevel' et 'role' même s'ils sont envoyés
    const { firstName, lastName, email, phone } = req.body;

    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                firstName,
                lastName,
                email,
                phone // ✅ Désormais reconnu
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                conceptionLevel: true // On renvoie le niveau pour le front, mais on ne le modifie pas
            }
        });

        console.log(`👤 [USER] Profil mis à jour pour : ${updatedUser.email}`);
        return res.json(updatedUser);
    } catch (error: any) {
        console.error("🔥 [UPDATE_ME ERROR]:", error.message);
        return res.status(500).json({ error: "Échec de la mise à jour du profil." });
    }
};