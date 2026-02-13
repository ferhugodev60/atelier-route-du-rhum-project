import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

interface RequestWithFile extends Request {
    file?: Express.Multer.File;
}

// --- 📈 STATISTIQUES (Dashboard) ---
export const getStats = async (req: Request, res: Response) => {
    try {
        const aggregate = await prisma.order.aggregate({
            _sum: { total: true },
            _count: { id: true }
        });

        const recentOrders = await prisma.order.findMany({
            include: {
                user: { select: { firstName: true, lastName: true } }
            },
            orderBy: { createdAt: 'desc' },
            take: 10
        });

        const lowStockVolumes = await prisma.productVolume.findMany({
            where: { stock: { lt: 5 } },
            include: { product: true }
        });

        res.json({
            totalRevenue: aggregate._sum.total || 0,
            totalSales: aggregate._count.id,
            recentOrders,
            lowStockAlerts: lowStockVolumes
        });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors du calcul des statistiques." });
    }
};

// --- 📦 GESTION DES PRODUITS (Boutique) ---

// Modifier une bouteille
export const updateProduct = async (req: RequestWithFile, res: Response) => {
    // Force le type en string pour éviter l'erreur TS2322
    const id = req.params.id as string;

    try {
        const { name, description, categoryId } = req.body;

        const updateData: any = { name, description, categoryId };
        if (req.file) {
            updateData.image = req.file.path;
        }

        const product = await prisma.product.update({
            where: { id: id }, // Utilisation de l'id casté
            data: updateData
        });

        res.json({ message: "Bouteille mise à jour avec succès", product });
    } catch (error) {
        res.status(404).json({ error: "Produit introuvable ou erreur de mise à jour." });
    }
};

// Supprimer une bouteille
export const deleteProduct = async (req: Request, res: Response) => {
    const id = req.params.id as string; // Assertion de type

    try {
        await prisma.product.delete({
            where: { id: id } // Le "onDelete: Cascade" gère les volumes
        });
        res.json({ message: "Bouteille et volumes associés supprimés." });
    } catch (error) {
        res.status(404).json({ error: "Impossible de supprimer ce produit." });
    }
};

// --- 📦 GESTION DU STOCK ---
export const updateProductStock = async (req: Request, res: Response) => {
    const volumeId = req.params.volumeId as string; // Assertion de type
    const { newStock } = req.body;

    try {
        const updatedVolume = await prisma.productVolume.update({
            where: { id: volumeId },
            data: { stock: parseInt(newStock) },
            include: { product: true }
        });

        res.json({
            message: `Stock mis à jour pour ${updatedVolume.product.name}`,
            newStock: updatedVolume.stock
        });
    } catch (error) {
        res.status(404).json({ error: "Volume introuvable." });
    }
};

// --- 🎓 FORMATIONS (Validation) ---
export const validateUserLevel = async (req: Request, res: Response) => {
    const userId = req.params.userId as string; // Assertion de type
    const { newLevel } = req.body;

    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { conceptionLevel: parseInt(newLevel) }
        });
        res.json({ message: "Niveau validé", userLevel: updatedUser.conceptionLevel });
    } catch (error) {
        res.status(404).json({ error: "Utilisateur introuvable." });
    }
};