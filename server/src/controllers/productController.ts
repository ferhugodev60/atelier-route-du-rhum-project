import { Request, Response } from 'express';
import { prisma } from '../index';

// Récupérer tout le catalogue
export const getAllProducts = async (req: Request, res: Response) => {
    const products = await prisma.product.findMany();
    res.json(products);
};

// Récupérer uniquement les bouteilles (Rhum et Vrac)
export const getShopProducts = async (req: Request, res: Response) => {
    const bottles = await prisma.product.findMany({
        where: {
            category: { in: ['Rhum Arrangé', 'Vrac'] }
        }
    });
    res.json(bottles);
};

// Récupérer uniquement les Ateliers (Conception et Découverte)
export const getWorkshops = async (req: Request, res: Response) => {
    const workshops = await prisma.product.findMany({
        where: { category: 'Atelier' }
    });
    res.json(workshops);
};