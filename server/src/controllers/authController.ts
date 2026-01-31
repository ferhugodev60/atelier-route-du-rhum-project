import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const login = async (req: Request, res: Response) => {
    console.log("🔑 [CONTROLLER] Tentative de login...");
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });

        if (user && await bcrypt.compare(password, user.password)) {
            const secret = process.env.JWT_SECRET || 'dev_secret_2026';
            const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '24h' });

            return res.status(200).json({
                token,
                user: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    conceptionLevel: user.conceptionLevel
                }
            });
        }
        return res.status(401).json({ error: "Identifiants incorrects" });
    } catch (error: any) {
        console.error("🔥 [ERROR LOGIN]:", error.message);
        return res.status(500).json({ error: "Erreur serveur" });
    }
};

export const register = async (req: Request, res: Response) => {
    console.log("📝 [CONTROLLER] Tentative d'inscription...");
    try {
        const { email, password, firstName, lastName } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: { email, password: hashedPassword, firstName, lastName, conceptionLevel: 0 }
        });

        return res.status(201).json({ message: "Utilisateur créé", userId: user.id });
    } catch (error: any) {
        console.error("🔥 [ERROR REGISTER]:", error.message);
        return res.status(400).json({ error: "Email déjà utilisé ou données invalides" });
    }
};

export const changePassword = async (req: Request, res: Response) => {
    // @ts-ignore - Le userId est injecté par le middleware d'authentification
    const userId = req.user?.userId;
    const { currentPassword, newPassword } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).json({ error: "Utilisateur introuvable." });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ error: "Le mot de passe actuel est incorrect." });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        });

        return res.status(200).json({ message: "Le secret a été mis à jour." });
    } catch (error: any) {
        return res.status(500).json({ error: "Erreur lors de la mise à jour." });
    }
};