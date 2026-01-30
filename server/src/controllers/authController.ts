// server/src/controllers/authController.ts
import { Request, Response } from 'express';
import { prisma } from '../index';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, firstName, lastName, phone } = req.body;

        // On hache le mot de passe pour la sécurité
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                phone,
                conceptionLevel: 0
            }
        });

        res.status(201).json({ message: "Bienvenue dans l'atelier !", userId: user.id });
    } catch (error) {
        res.status(400).json({ error: "Cet email est déjà utilisé." });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '24h' });
        res.json({ token, user: { firstName: user.firstName, conceptionLevel: user.conceptionLevel } });
    } else {
        res.status(401).json({ error: "Identifiants incorrects" });
    }
};