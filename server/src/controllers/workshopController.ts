import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

interface RequestWithFile extends Request {
    file?: Express.Multer.File;
}

/**
 * 🏺 GESTIONNAIRE DES SÉANCES TECHNIQUE
 * Administre les modules de formation et leurs règles de caducité.
 */

// --- 📋 LECTURE (Enrichie avec la validité) ---
export const getWorkshops = async (req: Request, res: Response) => {
    try {
        const workshops = await prisma.workshop.findMany({
            orderBy: { level: 'asc' }
        });

        // 🏺 Application des règles de validité du Registre
        const enrichedWorkshops = workshops.map(ws => {
            const isConception = ws.level > 0 || ws.title.toLowerCase().includes('free');
            return {
                ...ws,
                // 30 jours pour le Niveau 0, 6 mois pour les paliers techniques
                validityDays: isConception ? 180 : 30,
                validityPeriod: isConception ? "6 mois" : "30 jours"
            };
        });

        res.json(enrichedWorkshops);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des séances." });
    }
};

// --- ➕ CRÉATION (Sécurisée) ---
export const createWorkshop = async (req: RequestWithFile, res: Response) => {
    try {
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
                priceInstitutional: priceInstitutional ? parseFloat(priceInstitutional) : 0,
                image: imageUrl
            }
        });

        res.status(201).json(workshop);
    } catch (error: any) {
        res.status(400).json({ error: "Niveau déjà existant ou données de séance invalides." });
    }
};

// --- 🔧 MODIFICATION (Sécurisée) ---
export const updateWorkshop = async (req: RequestWithFile, res: Response) => {
    const id = req.params.id as string;
    try {
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
        res.status(404).json({ error: "Séance introuvable au Registre." });
    }
};

// --- 🗑️ SUPPRESSION ---
export const deleteWorkshop = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    try {
        await prisma.workshop.delete({ where: { id } });
        res.json({ message: "La séance a été retirée du catalogue officiel." });
    } catch (error) {
        res.status(400).json({ error: "Suppression impossible : des commandes sont liées à cette séance." });
    }
};