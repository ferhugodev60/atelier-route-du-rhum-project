// server/src/controllers/workshopController.ts
import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

interface RequestWithFile extends Request {
    file?: Express.Multer.File;
}

// --- 📋 LECTURE ---
export const getWorkshops = async (req: Request, res: Response) => {
    try {
        const workshops = await prisma.workshop.findMany({
            orderBy: { level: 'asc' }
        });
        res.json(workshops);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des formations." });
    }
};

// --- ➕ CRÉATION ---
export const createWorkshop = async (req: RequestWithFile, res: Response) => {
    try {
        const { level, title, description, color, format, availability, quote, price } = req.body;
        const imageUrl = req.file ? req.file.path : null;

        const workshop = await prisma.workshop.create({
            data: {
                level: parseInt(level),
                title,
                description,
                color,
                format,
                availability,
                quote,
                price: parseFloat(price),
                image: imageUrl
            }
        });
        res.status(201).json(workshop);
    } catch (error: any) {
        res.status(400).json({ error: "Niveau déjà existant ou données invalides." });
    }
};

// --- 🔧 MODIFICATION ---
export const updateWorkshop = async (req: RequestWithFile, res: Response) => {
    const id = req.params.id as string;
    try {
        const { level, title, description, color, format, availability, quote, price } = req.body;

        const updateData: any = {
            title,
            description,
            color,
            format,
            availability,
            quote,
            level: level ? parseInt(level) : undefined,
            price: price ? parseFloat(price) : undefined
        };

        if (req.file) {
            updateData.image = req.file.path;
        }

        const workshop = await prisma.workshop.update({
            where: { id },
            data: updateData
        });

        res.json(workshop);
    } catch (error) {
        res.status(404).json({ error: "Formation introuvable ou conflit de niveau." });
    }
};

// --- 🗑️ SUPPRESSION ---
export const deleteWorkshop = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    try {
        await prisma.workshop.delete({ where: { id } });
        res.json({ message: "La formation a été retirée du catalogue." });
    } catch (error) {
        res.status(400).json({ error: "Suppression impossible : des commandes y sont rattachées." });
    }
};