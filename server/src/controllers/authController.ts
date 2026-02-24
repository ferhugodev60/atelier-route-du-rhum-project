import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

/**
 * 🏺 Génération du Code Passeport Membre
 * Format institutionnel : RR-26-XXXX
 */
const generateMemberCode = () => {
    const year = "26"; // Année 2026 [cite: 2026-02-12]
    const random = crypto.randomBytes(2).toString('hex').toUpperCase();
    return `RR-${year}-${random}`;
};

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, firstName, lastName, phone } = req.body;
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return res.status(400).json({ error: "Cet email est déjà utilisé." });

        const hashedPassword = await bcrypt.hash(password, 10);
        const memberCode = generateMemberCode();

        const user = await prisma.user.create({
            data: {
                email,
                memberCode,
                password: hashedPassword,
                firstName,
                lastName,
                phone,
                conceptionLevel: 0
            }
        });

        return res.status(201).json({ message: "Inscription réussie !", memberCode: user.memberCode });
    } catch (error: any) {
        return res.status(400).json({ error: "Échec de l'enregistrement dans le registre." });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });

        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign(
                { userId: user.id, role: user.role },
                process.env.JWT_SECRET!,
                { expiresIn: '24h' }
            );

            return res.status(200).json({
                token,
                user: {
                    id: user.id,
                    memberCode: user.memberCode,
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
        return res.status(500).json({ error: "Erreur technique de session." });
    }
};

/**
 * 🏺 Mise à jour du secret de connexion
 * Cette fonction était manquante, causant l'erreur au démarrage
 */
export const changePassword = async (req: Request, res: Response) => {
    // @ts-ignore - Injecté par authenticateToken
    const userId = req.user?.userId;
    const { currentPassword, newPassword } = req.body;

    if (!userId) return res.status(401).json({ error: "Session non identifiée." });

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).json({ error: "Dossier introuvable." });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ error: "Le mot de passe actuel est incorrect." });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        });

        return res.status(200).json({ message: "Le secret a été mis à jour avec succès." });
    } catch (error: any) {
        return res.status(500).json({ error: "Échec technique du changement de secret." });
    }
};