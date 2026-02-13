import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

interface RequestWithFile extends Request {
    file?: Express.Multer.File;
}

export const createProduct = async (req: RequestWithFile, res: Response) => {
    try {
        const { name, description, categoryId, volumes } = req.body;

        // Extraction de l'URL Cloudinary après upload réussi
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

        res.status(201).json(product);
    } catch (error: any) {
        console.error("🔥 [CREATE_PRODUCT ERROR]:", error.message);
        res.status(400).json({ error: "Erreur lors de la création du produit et de ses volumes." });
    }
};

export const getShopProducts = async (req: Request, res: Response) => {
    try {
        const products = await prisma.product.findMany({
            where: {
                category: {
                    name: { in: ['Rhum arrangé', 'Vrac', 'Location de Dame-Jeanne'] }
                }
            },
            include: {
                volumes: true,
                category: true
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la lecture du catalogue." });
    }
};