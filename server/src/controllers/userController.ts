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
                createdAt: true,
                companyName: true,
                siret: true
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
                conceptionLevel: true,
                companyName: true,
                siret: true
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
            where: {
                role: { in: ['USER', 'PRO'] }
            },
            select: {
                id: true,
                memberCode: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                role: true,
                companyName: true,
                siret: true,
                conceptionLevel: true,
                createdAt: true,
                _count: { select: { orders: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(users);
    } catch (error) {
        console.error("Erreur Registre Users:", error);
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
    const { firstName, lastName, phone, conceptionLevel, email, role, companyName, siret } = req.body;

    try {
        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                firstName,
                lastName,
                email,
                phone,
                role,
                companyName,
                siret,
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

    // 🏺 On récupère les deux variantes pour être compatible avec le Front
    const { level, conceptionLevel } = req.body;

    // On choisit la valeur qui n'est pas undefined
    const rawValue = level !== undefined ? level : conceptionLevel;

    try {
        const targetLevel = parseInt(String(rawValue));

        // Si la valeur est toujours invalide, on renvoie l'erreur 400
        if (isNaN(targetLevel)) {
            return res.status(400).json({
                error: "Le palier technique transmis est invalide ou manquant au Registre."
            });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { conceptionLevel: targetLevel }
        });

        res.json({
            message: "Palier technique certifié avec succès.",
            userLevel: updatedUser.conceptionLevel
        });
    } catch (error) {
        console.error("🔥 [ERREUR_REGISTRE]:", error);
        res.status(500).json({ error: "Échec technique lors du scellage du niveau." });
    }
};

export const verifyMemberCode = async (req: Request, res: Response) => {
    const code = req.params.code as string;

    if (!code) {
        return res.status(400).json({ error: "Code manquant." });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { memberCode: code.toUpperCase() },
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