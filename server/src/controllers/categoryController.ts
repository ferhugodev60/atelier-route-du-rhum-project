import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

// --- 📋 LECTURE ---
export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await prisma.category.findMany({
            include: { _count: { select: { products: true } } },
            orderBy: { name: 'asc' }
        });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: "Erreur de récupération." });
    }
};

// --- ➕ CRÉATION ---
export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name, description } = req.body;
        const category = await prisma.category.create({
            data: { name, description }
        });
        res.json(category);
    } catch (error) {
        res.status(400).json({ error: "Données invalides." });
    }
};

// --- 🔧 MODIFICATION (NOM & DESCRIPTION) ---
export const updateCategory = async (req: Request, res: Response) => {
    const id = req.params.id as string; // Sécurité de type
    try {
        const { name, description } = req.body;
        const category = await prisma.category.update({
            where: { id },
            data: { name, description }
        });
        res.json(category);
    } catch (error) {
        res.status(404).json({ error: "Catégorie introuvable." });
    }
};

// --- 🗑️ SUPPRESSION ---
export const deleteCategory = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    try {
        await prisma.category.delete({ where: { id } });
        res.json({ message: "Supprimée." });
    } catch (error) {
        res.status(400).json({ error: "Impossible : des produits sont encore liés." });
    }
};