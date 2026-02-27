import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

interface RequestWithFile extends Request {
    file?: Express.Multer.File;
}

/**
 * 🏺 Intégration d'une nouvelle référence au Registre
 */
export const createProduct = async (req: RequestWithFile, res: Response) => {
    try {
        const { name, description, categoryId, volumes } = req.body;

        // Extraction de l'URL sécurisée après téléversement
        const imageUrl = req.file ? req.file.path : null;

        const parsedVolumes = typeof volumes === 'string' ? JSON.parse(volumes) : volumes;

        const product = await prisma.product.create({
            data: {
                name,
                description,
                image: imageUrl,
                categoryId,
                volumes: {
                    create: parsedVolumes
                }
            },
            include: { volumes: true }
        });

        res.status(201).json({ message: "Référence créée avec succès", product });
    } catch (error: any) {
        console.error("🔥 [REGISTRE_ERREUR]:", error.message);
        res.status(400).json({ error: "Échec de la création de la référence et de ses formats." });
    }
};

/**
 * 🏺 Lecture intégrale du Catalogue de l'Établissement
 * [DYNAMIQUE] : Inclut désormais toutes les collections certifiées
 */
export const getShopProducts = async (req: Request, res: Response) => {
    try {
        const products = await prisma.product.findMany({
            include: {
                volumes: true,
                category: true
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la lecture du catalogue des flacons." });
    }
};