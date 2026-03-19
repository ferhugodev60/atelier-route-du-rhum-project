import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { OAuth2Client } from 'google-auth-library';

// 🏺 Initialisation du client Google
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
 * 📜 INSCRIPTION STANDARD (Email/Mdp)
 */
export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, firstName, lastName, phone, companyName, siret, isEmployee } = req.body;
        const lowerEmail = email.toLowerCase();

        // 🛡️ Recherche insensible à la casse pour éviter les doublons
        const existingUser = await prisma.user.findFirst({
            where: { email: { equals: lowerEmail, mode: 'insensitive' } }
        });

        if (existingUser) {
            return res.status(400).json({ error: "Cet email est déjà répertorié au Registre." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const memberCode = generateMemberCode();

        const role = (companyName && siret && !isEmployee) ? "PRO" : "USER";

        const user = await prisma.user.create({
            data: {
                email: lowerEmail,
                memberCode,
                password: hashedPassword,
                firstName: firstName.toUpperCase(),
                lastName: lastName.toUpperCase(),
                phone: phone || null,
                role,
                isEmployee: !!isEmployee,
                companyName: companyName || null,
                siret: siret || null,
                isProfileComplete: true,
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
 * 📜 OUVERTURE DE SESSION STANDARD
 */
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // 🛡️ Recherche robuste de l'utilisateur
        const user = await prisma.user.findFirst({
            where: { email: { equals: email.toLowerCase(), mode: 'insensitive' } }
        });

        if (!user || !user.password) {
            return res.status(401).json({ error: "Identifiants non reconnus ou connexion via Google requise." });
        }

        if (await bcrypt.compare(password, user.password)) {
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
                    role: user.role,
                    isProfileComplete: user.isProfileComplete
                }
            });
        }
        return res.status(401).json({ error: "Identifiants non reconnus." });
    } catch (error: any) {
        return res.status(500).json({ error: "Erreur technique de session." });
    }
};

/**
 * 📜 AUTHENTIFICATION SOCIALE GOOGLE
 * Liaison automatique et détection de nouveaux membres.
 */
export const googleLogin = async (req: Request, res: Response) => {
    const { idToken } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();

        if (!payload || !payload.email_verified) {
            return res.status(401).json({ error: "Authentification Google invalide." });
        }

        const { email, sub: googleId, given_name, family_name } = payload;
        const lowerEmail = email!.toLowerCase();

        // 🛡️ SOUDURE : Recherche insensible pour lier au compte existant
        let user = await prisma.user.findFirst({
            where: { email: { equals: lowerEmail, mode: 'insensitive' } }
        });

        if (user) {
            // Mise à jour du googleId si le compte existait mais n'était pas lié
            if (!user.googleId) {
                user = await prisma.user.update({
                    where: { id: user.id },
                    data: { googleId }
                });
            }
        } else {
            // Création d'un nouveau membre (Profil à compléter)
            const memberCode = generateMemberCode();
            user = await prisma.user.create({
                data: {
                    email: lowerEmail,
                    googleId,
                    firstName: (given_name || "MEMBRE").toUpperCase(),
                    lastName: (family_name || "L'ÉTABLISSEMENT").toUpperCase(),
                    password: null,
                    memberCode,
                    role: "USER",
                    isProfileComplete: false
                }
            });
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: '24h' }
        );

        return res.status(200).json({
            token,
            isNewUser: !user.isProfileComplete,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                isProfileComplete: user.isProfileComplete,
                firstName: user.firstName,
                lastName: user.lastName,
                memberCode: user.memberCode, // 🏺 AJOUT : Le matricule pour le passeport
                isEmployee: user.isEmployee, // 🏺 AJOUT : Le statut CE
                companyName: user.companyName,
                siret: user.siret
            }
        });
    } catch (error) {
        return res.status(500).json({ error: "Échec technique du scellage Google." });
    }
};

/**
 * 📜 QUALIFICATION DU PROFIL
 */
export const completeProfile = async (req: any, res: Response) => {
    const userId = req.user?.userId;
    const { isEmployee, companyName, siret } = req.body;

    if (!userId) return res.status(401).json({ error: "Session non identifiée." });

    try {
        const role = (companyName && siret && !isEmployee) ? "PRO" : "USER";

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                role,
                isEmployee: !!isEmployee,
                companyName: companyName || null,
                siret: siret || null,
                isProfileComplete: true
            }
        });

        return res.status(200).json({
            message: "Votre profil est désormais scellé au Registre.",
            user: updatedUser
        });
    } catch (error) {
        return res.status(500).json({ error: "Échec technique de qualification." });
    }
};

/**
 * 📜 GESTION DES MOTS DE PASSE
 */
export const changePassword = async (req: any, res: Response) => {
    const userId = req.user?.userId;
    const { currentPassword, newPassword } = req.body;

    if (!userId) return res.status(401).json({ error: "Session non identifiée." });

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || !user.password) return res.status(404).json({ error: "Dossier ou secret introuvable." });

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
    if (!token || !password) return res.status(400).json({ error: "Données de scellage incomplètes." });

    try {
        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpires: { gt: new Date() }
            }
        });

        if (!user) return res.status(400).json({ error: "Le lien est expiré ou invalide." });

        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpires: null,
                isProfileComplete: true
            }
        });

        res.status(200).json({ message: "Votre secret est désormais scellé." });
    } catch (error) {
        res.status(500).json({ error: "Échec technique du Registre." });
    }
};