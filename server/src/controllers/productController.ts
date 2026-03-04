import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

interface RequestWithFile extends Request {
    file?: Express.Multer.File;
    user?: { userId: string; role: string };
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
export const getShopProducts = async (req: RequestWithFile, res: Response) => {
    const userId = req.user?.userId;

    try {
        // 1. Identification du statut institutionnel au sein du Registre
        let isInstitutional = false;
        if (userId) {
            const user = await prisma.user.findUnique({ where: { id: userId } });
            // 🏺 Scellage de l'éligibilité : PRO ou Particulier via CE
            isInstitutional = user?.role === 'PRO' || user?.isEmployee === true;
        }

        const products = await prisma.product.findMany({
            include: {
                volumes: true,
                category: true
            },
            orderBy: { createdAt: 'desc' }
        });

        // 2. Application dynamique du protocole de tarification
        const productsWithScsealedPrices = products.map(product => ({
            ...product,
            volumes: product.volumes.map(vol => {
                const basePrice = vol.price;
                // 🏺 Formule de remise institutionnelle : -10%
                const finalPrice = isInstitutional ? basePrice * 0.9 : basePrice;

                return {
                    ...vol,
                    originalPrice: basePrice, // Pour affichage "barré" côté Front
                    price: finalPrice,
                    isDiscounted: isInstitutional
                };
            })
        }));

        res.json(productsWithScsealedPrices);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la lecture du catalogue des flacons." });
    }
};