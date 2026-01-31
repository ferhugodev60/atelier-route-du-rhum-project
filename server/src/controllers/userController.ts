import { Request, Response } from 'express';
import { prisma } from '../lib/prisma'; // Utilisation de l'instance centralisée

/**
 * RÉCUPÉRATION : GET /api/users/me
 * Permet de récupérer les informations du membre connecté.
 */
export const getMe = async (req: Request, res: Response) => {
    // @ts-ignore - userId injecté par authenticateToken
    const userId = req.user?.userId;

    if (!userId) {
        console.error("🚫 [USER] Tentative d'accès sans identifiant de session.");
        return res.status(401).json({ error: "Votre session a expiré ou est invalide." });
    }

    try {
        console.log(`🔍 [USER] Lecture du registre pour l'ID : ${userId}`);

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true, // Ajouté pour correspondre à ton interface Profile
                conceptionLevel: true,
                role: true,
                createdAt: true
            }
        });

        if (!user) {
            console.error("❌ [USER] Membre introuvable dans la base de données.");
            return res.status(404).json({ error: "Profil introuvable." });
        }

        return res.json(user);
    } catch (error: any) {
        console.error("🔥 [ERROR GET_ME]:", error.message);
        return res.status(500).json({ error: "L'alambic a échoué à lire vos informations." });
    }
};

/**
 * MISE À JOUR : PATCH /api/users/me
 */
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
        console.error("🔥 [ERROR UPDATE_ME]:", error.message);
        return res.status(500).json({ error: "Erreur lors de la mise à jour du profil." });
    }
};