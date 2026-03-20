import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

interface RequestWithFile extends Request {
    file?: Express.Multer.File;
    user?: { userId: string; role: string };
}

/**
 * 🏺 Utilitaire de tarification institutionnelle
 * Formule appliquée : $Price_{final} = Price_{base} \times 0.9$
 */
const applyInstitutionalPricing = (volumes: any[], isInstitutional: boolean) => {
    return volumes.map(vol => {
        const basePrice = vol.price;
        const finalPrice = isInstitutional ? basePrice * 0.9 : basePrice;
        return {
            ...vol,
            originalPrice: basePrice,
            price: finalPrice,
            isDiscounted: isInstitutional
        };
    });
};

/**
 * 🏺 Lecture du Catalogue complet
 */
export const getShopProducts = async (req: RequestWithFile, res: Response) => {
    const userId = req.user?.userId;

    try {
        let isInstitutional = false;
        if (userId) {
            const user = await prisma.user.findUnique({ where: { id: userId } });
            isInstitutional = user?.role === 'PRO' || user?.isEmployee === true;
        }

        // On précise le type attendu pour que TS reconnaisse 'volumes'
        const products = await prisma.product.findMany({
            include: {
                volumes: true,
                category: true
            },
            orderBy: { createdAt: 'desc' }
        });

        const productsWithPrices = products.map(product => ({
            ...product,
            volumes: applyInstitutionalPricing(product.volumes, isInstitutional)
        }));

        res.json(productsWithPrices);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la lecture du catalogue." });
    }
};

/**
 * 🏺 Utilitaire de slugification (identique côté frontend)
 */
const slugify = (name: string) =>
    name.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

/**
 * 🏺 Lecture d'une Fiche Produit par slug sémantique
 */
export const getProductBySlug = async (req: RequestWithFile, res: Response) => {
    const slug = req.params.slug as string;
    const userId = req.user?.userId;

    try {
        let isInstitutional = false;
        if (userId) {
            const user = await prisma.user.findUnique({ where: { id: userId } });
            isInstitutional = user?.role === 'PRO' || user?.isEmployee === true;
        }

        const products = await prisma.product.findMany({
            include: { volumes: true, category: true }
        });

        const product = products.find(p => slugify(p.name) === slug);

        if (!product) {
            return res.status(404).json({ message: "Référence introuvable." });
        }

        res.json({
            ...product,
            volumes: applyInstitutionalPricing(product.volumes, isInstitutional)
        });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de l'extraction de la fiche." });
    }
};

/**
 * 🏺 Lecture d'une Fiche Produit unique (Scellage SEO)
 */
export const getProductById = async (req: RequestWithFile, res: Response) => {
    // 🏺 Correction TS2322 : On force le type string pour l'ID
    const id = req.params.id as string;
    const userId = req.user?.userId;

    try {
        let isInstitutional = false;
        if (userId) {
            const user = await prisma.user.findUnique({ where: { id: userId } });
            isInstitutional = user?.role === 'PRO' || user?.isEmployee === true;
        }

        const product = await prisma.product.findUnique({
            where: { id: id },
            include: {
                volumes: true,
                category: true
            }
        });

        if (!product) {
            return res.status(404).json({ message: "Référence introuvable." });
        }

        const productWithPrice = {
            ...product,
            volumes: applyInstitutionalPricing(product.volumes, isInstitutional)
        };

        res.json(productWithPrice);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de l'extraction de la fiche." });
    }
};

/**
 * 🏺 Création d'une nouvelle référence
 */
export const createProduct = async (req: RequestWithFile, res: Response) => {
    try {
        const { name, description, categoryId, volumes } = req.body;
        const imageUrl = req.file ? req.file.path : null;
        const parsedVolumes = typeof volumes === 'string' ? JSON.parse(volumes) : volumes;

        const product = await prisma.product.create({
            data: {
                name,
                description,
                image: imageUrl,
                categoryId,
                volumes: { create: parsedVolumes }
            },
            include: { volumes: true }
        });

        res.status(201).json({ message: "Référence scellée avec succès", product });
    } catch (error: any) {
        res.status(400).json({ error: "Échec de l'intégration au Registre." });
    }
};