import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

/**
 * 🏺 Génération du Code Passeport Membre
 * Format institutionnel : RR-26-XXXX [cite: 2026-02-12]
 */
const generateMemberCode = () => {
    const year = "26";
    const random = crypto.randomBytes(2).toString('hex').toUpperCase();
    return `RR-${year}-${random}`;
};

/**
 * 🏺 Enregistrement au Registre
 * Gestion hybride : Particulier ou Professionnel (CE)
 */
export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, firstName, lastName, phone, companyName, siret } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return res.status(400).json({ error: "Cet email est déjà répertorié." });

        // 🏺 Validation du SIRET si profil Entreprise
        if (siret) {
            const existingSiret = await prisma.user.findUnique({ where: { siret } });
            if (existingSiret) return res.status(400).json({ error: "Ce numéro SIRET est déjà associé à un compte." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const memberCode = generateMemberCode();

        // 🏺 Détermination du statut institutionnel
        const role = (companyName && siret) ? "PRO" : "USER";

        const user = await prisma.user.create({
            data: {
                email,
                memberCode,
                password: hashedPassword,
                firstName,
                lastName,
                phone,
                role,
                companyName: companyName || null,
                siret: siret || null,
                conceptionLevel: 0
            }
        });

        return res.status(201).json({
            message: "Inscription réussie !",
            memberCode: user.memberCode,
            role: user.role
        });
    } catch (error: any) {
        return res.status(400).json({ error: "Échec de l'enregistrement dans le registre." });
    }
};

/**
 * 🏺 Authentification & Ouverture de Session
 */
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
                    companyName: user.companyName,
                    siret: user.siret,
                    conceptionLevel: user.conceptionLevel
                }
            });
        }
        return res.status(401).json({ error: "Identifiants non reconnus." });
    } catch (error: any) {
        return res.status(500).json({ error: "Erreur technique de session." });
    }
};

/**
 * 🏺 Mise à jour du secret de connexion
 */
export const changePassword = async (req: Request, res: Response) => {
    // @ts-ignore - Injecté par le middleware d'authentification
    const userId = req.user?.userId;
    const { currentPassword, newPassword } = req.body;

    if (!userId) return res.status(401).json({ error: "Session non identifiée." });

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).json({ error: "Dossier introuvable." });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ error: "Le secret actuel est erroné." });

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