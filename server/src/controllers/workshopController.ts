import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

interface RequestWithFile extends Request {
    file?: Express.Multer.File;
}

/**
 * 🏺 GESTIONNAIRE DES SÉANCES TECHNIQUES
 * Administre les cursus de formation et leurs règles de validité.
 */

// --- 📋 LECTURE (Enrichie) ---
export const getWorkshops = async (req: Request, res: Response) => {
    console.log("🔍 [DATABASE] Tentative d'extraction des paliers techniques...");
    try {
        const workshops = await prisma.workshop.findMany({
            orderBy: { level: 'asc' }
        });
        console.log(`✅ [DATABASE] ${workshops.length} paliers extraits.`);

        const enrichedWorkshops = workshops.map(ws => {
            const isConception = ws.level > 0 || ws.title.toLowerCase().includes('conception');
            return {
                ...ws,
                validityDays: isConception ? 180 : 30,
                validityPeriod: isConception ? "6 mois" : "30 jours"
            };
        });

        res.json(enrichedWorkshops);
    } catch (error: any) {
        console.error("❌ [DATABASE ERROR 500] Échec Prisma :", error.message);
        res.status(500).json({ error: "Erreur lors de la récupération des paliers techniques.", details: error.message });
    }
};

// --- 🔍 LECTURE INDIVIDUELLE PAR ID ---
export const getWorkshopById = async (req: Request, res: Response) => {
    const id = req.params.id as string;

    try {
        const workshop = await prisma.workshop.findUnique({ where: { id } });
        if (!workshop) {
            return res.status(404).json({ error: "Ce palier technique n'existe pas dans le Registre." });
        }
        const isConception = workshop.level > 0;
        res.json({ ...workshop, validityDays: isConception ? 180 : 30, validityPeriod: isConception ? "6 mois" : "30 jours" });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la lecture du cursus." });
    }
};

// --- 🔍 LECTURE PAR NIVEAU SÉMANTIQUE ---
// GET /workshops/decouverte       → level 0
// GET /workshops/conception/:level → level 1-4
export const getWorkshopBySlug = async (req: Request, res: Response) => {
    const { level } = req.params;
    const targetLevel = level === undefined ? 0 : parseInt(level);

    if (isNaN(targetLevel)) {
        return res.status(400).json({ error: "Niveau invalide." });
    }

    try {
        const workshop = await prisma.workshop.findFirst({
            where: { level: targetLevel }
        });
        if (!workshop) {
            return res.status(404).json({ error: "Atelier introuvable." });
        }
        const isConception = workshop.level > 0;
        res.json({ ...workshop, validityDays: isConception ? 180 : 30, validityPeriod: isConception ? "6 mois" : "30 jours" });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la lecture du cursus." });
    }
};

// --- ➕ CRÉATION ---
export const createWorkshop = async (req: RequestWithFile, res: Response) => {
    try {
        const {
            level, title, description, fullDescription,
            color, format, duration, availability,
            quote, price, priceInstitutional
        } = req.body;

        const imageUrl = req.file ? req.file.path : null;

        const workshop = await prisma.workshop.create({
            data: {
                level: parseInt(level),
                title,
                description,
                fullDescription,
                color,
                format,
                duration,
                availability,
                quote,
                price: parseFloat(price),
                priceInstitutional: priceInstitutional ? parseFloat(priceInstitutional) : 0,
                image: imageUrl
            }
        });

        res.status(201).json(workshop);
    } catch (error: any) {
        res.status(400).json({ error: "Conflit de palier ou données de cursus invalides." });
    }
};

// --- 🔧 MODIFICATION ---
export const updateWorkshop = async (req: RequestWithFile, res: Response) => {
    const id = req.params.id as string;
    try {
        const {
            level, title, description, fullDescription,
            color, format, duration, availability,
            quote, price, priceInstitutional
        } = req.body;

        const updateData: any = {
            title,
            description,
            fullDescription,
            color,
            format,
            duration,
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
        res.status(404).json({ error: "Référence introuvable au Registre." });
    }
};

// --- 🗑️ SUPPRESSION ---
export const deleteWorkshop = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    try {
        await prisma.workshop.delete({ where: { id } });
        res.json({ message: "Le cursus a été retiré du catalogue officiel." });
    } catch (error) {
        res.status(400).json({ error: "Suppression impossible : des membres sont déjà inscrits à ce palier." });
    }
};