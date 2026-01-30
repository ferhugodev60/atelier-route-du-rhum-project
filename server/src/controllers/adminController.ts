import { Request, Response } from 'express';
import { prisma } from '../index';

// --- GESTION DU SHOP ---
export const addProduct = async (req: Request, res: Response) => {
    const product = await prisma.product.create({ data: req.body });
    res.status(201).json(product);
};

export const updateProduct = async (req: Request, res: Response) => {
    // Correction ici : on force l'id en string
    const id = req.params.id as string;

    try {
        const product = await prisma.product.update({
            where: { id },
            data: req.body
        });
        res.json(product);
    } catch (error) {
        res.status(404).json({ error: "Produit introuvable ou erreur de mise à jour" });
    }
};

// --- STATISTIQUES ---
export const getStats = async (req: Request, res: Response) => {
    const aggregate = await prisma.order.aggregate({
        _sum: { total: true },
        _count: { id: true }
    });

    const orders = await prisma.order.findMany({
        include: { user: { select: { firstName: true, lastName: true } } },
        orderBy: { createdAt: 'desc' }
    });

    res.json({
        totalRevenue: aggregate._sum.total || 0,
        totalSales: aggregate._count.id,
        recentOrders: orders
    });
};

// --- VALIDATION ATELIER ---
export const validateUserLevel = async (req: Request, res: Response) => {
    // Correction ici : on force le userId en string
    const userId = req.params.userId as string;
    const { newLevel } = req.body;

    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { conceptionLevel: newLevel }
        });
        res.json({ message: `Niveau de ${updatedUser.firstName} mis à jour : ${newLevel}` });
    } catch (error) {
        res.status(404).json({ error: "Utilisateur introuvable" });
    }
};