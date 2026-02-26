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

// --- ➕ CRÉATION (Corrigé) ---
export const createWorkshop = async (req: RequestWithFile, res: Response) => {
    try {
        // 🏺 Ajout de priceInstitutional dans la déstructuration
        const { level, title, description, color, format, availability, quote, price, priceInstitutional } = req.body;
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
                // 🏺 Sauvegarde explicite du tarif institutionnel
                priceInstitutional: priceInstitutional ? parseFloat(priceInstitutional) : 0,
                image: imageUrl
            }
        });
        res.status(201).json(workshop);
    } catch (error: any) {
        res.status(400).json({ error: "Niveau déjà existant ou données invalides." });
    }
};

// --- 🔧 MODIFICATION (Corrigé) ---
export const updateWorkshop = async (req: RequestWithFile, res: Response) => {
    const id = req.params.id as string;
    try {
        // 🏺 Ajout de priceInstitutional ici aussi
        const { level, title, description, color, format, availability, quote, price, priceInstitutional } = req.body;

        const updateData: any = {
            title,
            description,
            color,
            format,
            availability,
            quote,
            level: level ? parseInt(level) : undefined,
            price: price ? parseFloat(price) : undefined,
            // 🏺 Mise à jour du tarif institutionnel
            priceInstitutional: priceInstitutional ? parseFloat(priceInstitutional) : undefined
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
        res.status(404).json({ error: "Formation introuvable." });
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