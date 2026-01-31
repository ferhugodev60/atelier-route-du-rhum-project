import { Request, Response } from 'express';
import { prisma } from '../lib/prisma'; // Assurez-vous que le chemin est correct

// --- 📈 STATISTIQUES ---
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
            take: 10 // On limite aux 10 dernières pour la performance
        });

        // Alerte sur les stocks bas (moins de 5 unités)
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
    } catch (error: any) {
        res.status(500).json({ error: "Erreur lors du calcul des statistiques." });
    }
};

// --- 📦 GESTION DU STOCK (MULTI-VOLUMES) ---
/**
 * Correction de l'erreur TS2724
 * On cible le volumeId car le stock dépend désormais de la contenance
 */
export const updateProductStock = async (req: Request, res: Response) => {
    const volumeId = req.params.volumeId as string;
    const { newStock } = req.body;

    try {
        const updatedVolume = await prisma.productVolume.update({
            where: { id: volumeId },
            data: { stock: parseInt(newStock) },
            include: { product: true }
        });

        res.json({
            message: `Stock mis à jour pour ${updatedVolume.product.name} (${updatedVolume.size}${updatedVolume.unit})`,
            newStock: updatedVolume.stock
        });
    } catch (error) {
        res.status(404).json({ error: "Volume introuvable." });
    }
};

// --- 🏷️ MISE À JOUR PRODUIT ---
export const updateProduct = async (req: Request, res: Response) => {
    const id = req.params.id as string;

    try {
        const product = await prisma.product.update({
            where: { id },
            data: req.body // Pour mettre à jour le nom ou la description
        });
        res.json(product);
    } catch (error) {
        res.status(404).json({ error: "Produit introuvable." });
    }
};

// --- 🎓 VALIDATION NIVEAU ÉLÈVE ---
export const validateUserLevel = async (req: Request, res: Response) => {
    const userId = req.params.userId as string;
    const { newLevel } = req.body; // Le niveau à attribuer (0 à 4)

    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { conceptionLevel: parseInt(newLevel) }
        });

        console.log(`🎓 [ADMIN] Passage au Niveau ${newLevel} validé pour ${updatedUser.firstName}`);
        res.json({
            message: `Niveau de ${updatedUser.firstName} ${updatedUser.lastName} mis à jour : ${newLevel}`,
            userLevel: updatedUser.conceptionLevel
        });
    } catch (error) {
        res.status(404).json({ error: "Utilisateur introuvable." });
    }
};