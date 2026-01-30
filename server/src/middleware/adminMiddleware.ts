import { Request, Response, NextFunction } from 'express';
import { prisma } from '../index';

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (user && user.role === 'ADMIN') {
        next();
    } else {
        res.status(403).json({ error: "Accès réservé aux administrateurs." });
    }
};