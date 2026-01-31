import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

import 'multer';

interface RequestWithFile extends Request {
    file?: Express.Multer.File;
}

export const createProduct = async (req: RequestWithFile, res: Response) => {
    try {
        const { name, description, price, category, stock, volume } = req.body;

        // L'URL de l'image renvoyée par Cloudinary
        const imageUrl = req.file ? req.file.path : null;

        const product = await prisma.product.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                category,
                stock: parseInt(stock) || 0,
                volume: volume ? parseInt(volume) : null,
                image: imageUrl
            }
        });

        console.log(`✨ [PRODUCT] Produit enregistré avec succès : ${product.name}`);
        res.status(201).json(product);
    } catch (error: any) {
        console.error("🔥 [CREATE_PRODUCT ERROR]:", error.message);
        res.status(400).json({ error: "Erreur lors de la création du produit." });
    }
};

// Récupérer tout le catalogue
export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur." });
    }
};

// Récupérer uniquement les bouteilles (Rhum et Vrac)
export const getShopProducts = async (req: Request, res: Response) => {
    try {
        const bottles = await prisma.product.findMany({
            where: {
                category: {
                    name: { in: ['Rhum Arrangé', 'Vrac'] }
                }
            },
            include: { category: true } // Optionnel : pour inclure les détails de la catégorie dans la réponse
        });
        res.json(bottles);
    } catch (error) {
        console.error("🔥 [SHOP_PRODUCTS ERROR]:", error);
        res.status(500).json({ error: "Erreur lors de la lecture de la cave." });
    }
};

// Récupérer uniquement les Ateliers
export const getWorkshops = async (req: Request, res: Response) => {
    try {
        const workshops = await prisma.product.findMany({
            where: {
                category: {
                    // 🏺 On cible également le 'name' ici
                    name: 'Atelier'
                }
            },
            include: { category: true }
        });
        res.json(workshops);
    } catch (error) {
        console.error("🔥 [WORKSHOPS ERROR]:", error);
        res.status(500).json({ error: "Erreur lors de la lecture des ateliers." });
    }
};