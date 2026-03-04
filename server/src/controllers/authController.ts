import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

/**
 * 🏺 GÉNÉRATEUR DE MATRICULE
 * Format certifié : RR-26-XXXX
 */
const generateMemberCode = () => {
    const year = "26";
    const random = crypto.randomBytes(2).toString('hex').toUpperCase();
    return `RR-${year}-${random}`;
};

/**
 * 📜 INSCRIPTION AU REGISTRE
 * Gère les Particuliers, les Bénéficiaires CE (Toggle) et les PRO.
 */
export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, firstName, lastName, phone, companyName, siret, isEmployee } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
        if (existingUser) return res.status(400).json({ error: "Cet email est déjà répertorié au Registre." });

        const hashedPassword = await bcrypt.hash(password, 10);
        const memberCode = generateMemberCode();

        // 🏺 DÉTERMINATION DU RÔLE INSTITUTIONNEL
        // PRO : Entreprise avec SIRET (non-salarié)
        // USER : Particulier (Standard ou Salarié via Toggle isEmployee)
        const role = (companyName && siret && !isEmployee) ? "PRO" : "USER";

        const user = await prisma.user.create({
            data: {
                email: email.toLowerCase(),
                memberCode,
                password: hashedPassword,
                firstName: firstName.toUpperCase(),
                lastName: lastName.toUpperCase(),
                phone: phone || null,
                role,
                isEmployee: !!isEmployee,
                companyName: companyName || null,
                siret: siret || null,
                conceptionLevel: 0
            }
        });

        return res.status(201).json({
            message: "Inscription réussie au Registre.",
            memberCode: user.memberCode,
            role: user.role
        });
    } catch (error: any) {
        return res.status(400).json({ error: "Échec de l'enregistrement." });
    }
};

/**
 * 📜 OUVERTURE DE SESSION
 */
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

        // Vérification du secret et du dossier
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
                    isEmployee: user.isEmployee,
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
 * 📜 MISE À JOUR DU MOT DE PASSE
 */
export const changePassword = async (req: any, res: Response) => {
    const userId = req.user?.userId;
    const { currentPassword, newPassword } = req.body;

    if (!userId) return res.status(401).json({ error: "Session non identifiée." });

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).json({ error: "Dossier introuvable." });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ error: "Le secret actuel est erroné." });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({ where: { id: userId }, data: { password: hashedPassword } });

        return res.status(200).json({ message: "Le secret a été mis à jour." });
    } catch (error: any) {
        return res.status(500).json({ error: "Échec technique du changement de secret." });
    }
};

export const setupFinalPassword = async (req: Request, res: Response) => {
    const { token, password } = req.body;

    if (!token || !password) {
        return res.status(400).json({ error: "Données de scellage incomplètes." });
    }

    try {
        // 🏺 On cherche l'utilisateur qui a ce token (envoyé par mail)
        // Note: Vous devrez ajouter 'resetToken' et 'resetTokenExpires' à votre modèle User
        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpires: { gt: new Date() }
            }
        });

        if (!user) return res.status(400).json({ error: "Le lien est expiré ou invalide." });

        // 🏺 Scellage du nouveau mot de passe (Hashage)
        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpires: null
            }
        });

        res.status(200).json({ message: "Votre secret est désormais scellé." });
    } catch (error) {
        res.status(500).json({ error: "Échec technique du Registre." });
    }
};