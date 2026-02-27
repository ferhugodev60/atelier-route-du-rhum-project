import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

interface RequestWithFile extends Request {
    file?: Express.Multer.File;
}

// --- 📈 INDICATEURS DU REGISTRE (Dashboard) ---

export const getStats = async (req: Request, res: Response) => {
    try {
        const { month, year } = req.query;
        const m = Number(month);
        const y = Number(year);

        // 🏺 1. Détermination de la borne historique (Premier flux en base)
        const firstOrder = await prisma.order.findFirst({
            orderBy: { createdAt: 'asc' },
            select: { createdAt: true }
        });
        const earliestYear = firstOrder ? firstOrder.createdAt.getFullYear() : new Date().getFullYear();

        // 🏺 2. Construction du filtre de période (Audit)
        let periodFilter: any = {};
        if (y > 0) {
            const start = m > 0 ? new Date(y, m - 1, 1) : new Date(y, 0, 1);
            const end = m > 0 ? new Date(y, m, 1) : new Date(y + 1, 0, 1);
            periodFilter = { gte: start, lt: end };
        }
        const whereClause = periodFilter.gte ? { createdAt: periodFilter } : {};

        // 🏺 3. Extraction parallèle (Vitesse ERP)
        const [aggregate, recentOrders, lowStockVolumes, pendingCount, totalUsersCount] = await Promise.all([
            // Filtré : CA et Volume de la période
            prisma.order.aggregate({
                where: whereClause,
                _sum: { total: true },
                _count: { id: true }
            }),
            // Filtré : Flux récents de la période
            prisma.order.findMany({
                where: whereClause,
                include: { user: { select: { firstName: true, lastName: true } } },
                orderBy: { createdAt: 'desc' },
                take: 5
            }),
            // 🚫 GLOBAL : Stocks critiques (Temps réel)
            prisma.productVolume.findMany({
                where: { stock: { lt: 5 } },
                include: { product: true }
            }),
            // 🚫 GLOBAL : Dossiers urgents "À TRAITER"
            prisma.order.count({ where: { status: 'À TRAITER' } }),
            // 🚫 GLOBAL : Répertoire Clients total
            prisma.user.count()
        ]);

        res.json({
            totalRevenue: aggregate._sum.total || 0,
            totalSales: aggregate._count.id,
            recentOrders,
            lowStockAlerts: lowStockVolumes,
            pendingOrdersCount: pendingCount,
            totalUsers: totalUsersCount,
            earliestYear
        });
    } catch (error) {
        res.status(500).json({ error: "Échec technique de l'audit." });
    }
};

// --- 📦 GESTION DES RÉFÉRENCES (Boutique) ---

export const updateProduct = async (req: any, res: Response) => {
    const id = req.params.id as string;
    try {
        const { name, description, categoryId, volumes } = req.body;
        const updateData: any = { name, description, categoryId };

        if (req.file) updateData.image = req.file.path;

        if (volumes) {
            const parsedVolumes = typeof volumes === 'string' ? JSON.parse(volumes) : volumes;
            updateData.volumes = {
                deleteMany: {},
                create: parsedVolumes.map((v: any) => ({
                    size: parseFloat(v.size),
                    unit: v.unit,
                    price: parseFloat(v.price),
                    stock: parseInt(v.stock)
                }))
            };
        }

        const product = await prisma.product.update({
            where: { id },
            data: updateData,
            include: { volumes: true }
        });

        res.json({ message: "Référence mise à jour dans le Registre", product });
    } catch (error) {
        res.status(404).json({ error: "Échec de mise à jour de la référence." });
    }
};

/**
 * 🏺 Suppression d'une référence
 * [RESTAURÉ] : Correction de l'erreur TS2305
 */
export const deleteProduct = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    try {
        await prisma.product.delete({ where: { id } });
        res.json({ message: "Référence et formats associés définitivement retirés du Registre." });
    } catch (error) {
        res.status(404).json({ error: "Impossible de supprimer cet article." });
    }
};

/**
 * 🏺 Mise à jour rapide de l'inventaire
 * [RESTAURÉ] : Correction de l'erreur TS2724
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
            message: `Inventaire mis à jour : ${updatedVolume.product.name}`,
            newStock: updatedVolume.stock
        });
    } catch (error) {
        res.status(404).json({ error: "Format introuvable dans le Registre." });
    }
};

// --- 🏷️ GESTION DES COLLECTIONS (Catégories) ---

export const updateCategory = async (req: any, res: Response) => {
    const id = req.params.id as string;
    try {
        const { name, description } = req.body;
        const updateData: any = { name, description };

        // 🏺 Gestion de l'image de présentation (Modal de Collection)
        if (req.file) updateData.image = req.file.path;

        const category = await prisma.category.update({
            where: { id },
            data: updateData
        });

        res.json({ message: "Collection mise à jour avec succès", category });
    } catch (error) {
        res.status(404).json({ error: "Impossible de modifier cette collection." });
    }
};

// --- 🎓 VALIDATION DU CURSUS (Membres) ---

export const validateUserLevel = async (req: Request, res: Response) => {
    const userId = req.params.userId as string;
    const { newLevel } = req.body;

    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { conceptionLevel: parseInt(newLevel) }
        });
        res.json({
            message: `Palier ${updatedUser.conceptionLevel} certifié pour le membre.`,
            userLevel: updatedUser.conceptionLevel
        });
    } catch (error) {
        res.status(404).json({ error: "Membre non répertorié." });
    }
};

// --- 👥 RÉPERTOIRE DES MEMBRES ---

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                isEmployee: true,
                memberCode: true,
                conceptionLevel: true,
                createdAt: true
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Impossible d'accéder au répertoire des membres." });
    }
};