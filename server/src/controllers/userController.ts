import { Request, Response } from 'express';
import { prisma } from '../index';

export const getMe = async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) return res.status(401).json({ error: "Non autorisé" });

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            conceptionLevel: true,
            createdAt: true
        }
    });

    res.json(user);
};