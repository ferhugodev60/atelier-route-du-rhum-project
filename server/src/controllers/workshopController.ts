import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

interface RequestWithFile extends Request {
    file?: Express.Multer.File;
}

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
        console.error("🔥 [CREATE_WORKSHOP ERROR]:", error.message);
        res.status(400).json({ error: "Impossible de créer cet atelier." });
    }
};

// Récupérer tous les ateliers ordonnés par progression
export const getWorkshops = async (req: Request, res: Response) => {
    try {
        const workshops = await prisma.workshop.findMany({
            orderBy: { level: 'asc' }
        });
        res.json(workshops);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des ateliers." });
    }
};