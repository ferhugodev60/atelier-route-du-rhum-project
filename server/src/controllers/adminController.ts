import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

interface RequestWithFile extends Request {
    file?: Express.Multer.File;
}

// --- 📈 INDICATEURS DE PERFORMANCE (Dashboard) ---
export const getStats = async (req: Request, res: Response) => {
    try {
        // Exécution en parallèle pour optimiser les ressources
        const [aggregate, recentOrders, lowStockVolumes, totalUsers] = await Promise.all([
            prisma.order.aggregate({
                _sum: { total: true },
                _count: { id: true }
            }),
            prisma.order.findMany({
                include: {
                    user: { select: { firstName: true, lastName: true } }
                },
                orderBy: { createdAt: 'desc' },
                take: 10
            }),
            prisma.productVolume.findMany({
                where: { stock: { lt: 5 } },
                include: { product: true }
            }),
            prisma.user.count({ where: { role: 'USER' } })
        ]);

        res.json({
            totalRevenue: aggregate._sum.total || 0,
            totalSales: aggregate._count.id,
            recentOrders,
            lowStockAlerts: lowStockVolumes,
            totalUsers // Ajout de l'indicateur client
        });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la génération des rapports d'activité." });
    }
};

// --- 📦 GESTION DES RÉFÉRENCES (Boutique) ---

export const updateProduct = async (req: any, res: Response) => {
    const id = req.params.id as string;

    try {
        const { name, description, categoryId, volumes } = req.body;
        const updateData: any = { name, description, categoryId };

        if (req.file) {
            updateData.image = req.file.path; // Chemin sécurisé Cloudinary
        }

        if (volumes) {
            const parsedVolumes = typeof volumes === 'string' ? JSON.parse(volumes) : volumes;

            updateData.volumes = {
                deleteMany: {}, // Réinitialisation des formats pour synchronisation propre
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

        res.json({ message: "Référence mise à jour avec succès", product });
    } catch (error) {
        res.status(404).json({ error: "Échec de la mise à jour de la référence." });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    const id = req.params.id as string;

    try {
        await prisma.product.delete({ where: { id } });
        res.json({ message: "Référence et formats associés définitivement retirés." });
    } catch (error) {
        res.status(404).json({ error: "Impossible de supprimer cet article." });
    }
};

// --- 📦 FLUX DE STOCK ---
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
        res.status(404).json({ error: "Format introuvable." });
    }
};

// --- 🎓 CURRICULUM (Validation) ---
export const validateUserLevel = async (req: Request, res: Response) => {
    const userId = req.params.userId as string;
    const { newLevel } = req.body;

    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { conceptionLevel: parseInt(newLevel) }
        });
        res.json({ message: "Niveau de compétence validé", userLevel: updatedUser.conceptionLevel });
    } catch (error) {
        res.status(404).json({ error: "Utilisateur non répertorié." });
    }
};