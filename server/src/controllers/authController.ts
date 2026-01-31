import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });

        if (user && await bcrypt.compare(password, user.password)) {
            // 🏺 CRUCIAL : On injecte le rôle dans le payload pour le middleware isAdmin
            const token = jwt.sign(
                { userId: user.id, role: user.role },
                process.env.JWT_SECRET!,
                { expiresIn: '24h' }
            );

            return res.status(200).json({
                token,
                user: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    conceptionLevel: user.conceptionLevel
                }
            });
        }
        return res.status(401).json({ error: "Identifiants incorrects" });
    } catch (error: any) {
        console.error("🔥 [ERROR LOGIN]:", error.message);
        return res.status(500).json({ error: "L'alambic a rencontré un problème technique." });
    }
};

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, firstName, lastName, phone } = req.body;

        // On vérifie si l'utilisateur existe déjà pour éviter une erreur Prisma brute
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return res.status(400).json({ error: "Cet email est déjà utilisé." });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                phone, // Ajouté pour correspondre à votre nouveau schéma
                conceptionLevel: 0
            }
        });

        return res.status(201).json({ message: "Inscription réussie !", userId: user.id });
    } catch (error: any) {
        console.error("🔥 [ERROR REGISTER]:", error.message);
        return res.status(400).json({ error: "Données invalides ou manquantes." });
    }
};

export const changePassword = async (req: Request, res: Response) => {
    // @ts-ignore - Injecté par authenticateToken
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

        return res.status(200).json({ message: "Le secret a été mis à jour avec succès." });
    } catch (error: any) {
        return res.status(500).json({ error: "Impossible de modifier le mot de passe." });
    }
};