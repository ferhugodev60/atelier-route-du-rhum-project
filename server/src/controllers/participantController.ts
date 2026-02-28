import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

/**
 * 🏺 VALIDATION TECHNIQUE (Protocole PDF)
 */
export const validateParticipantFromPDF = async (req: Request, res: Response) => {
    const id = req.params.id as string;

    // 🏺 Extraction dynamique pour supporter l'indexation unique du Registre
    const firstName = req.body.firstName || req.body[`firstName_${id}`];
    const lastName = req.body.lastName || req.body[`lastName_${id}`];
    const email = req.body.email || req.body[`email_${id}`];
    const phone = req.body.phone || req.body[`phone_${id}`];

    try {
        const participant = await prisma.participant.findUnique({ where: { id } });

        if (!participant) return res.status(404).send("Identification introuvable au Registre.");
        if (participant.isValidated) return res.status(400).send("Dossier déjà scellé.");

        await prisma.participant.update({
            where: { id },
            data: {
                firstName: (firstName as string)?.trim().toUpperCase(),
                lastName: (lastName as string)?.trim().toUpperCase(),
                email: (email as string)?.trim().toLowerCase(),
                phone: (phone as string)?.trim(),
                isValidated: true,
                validatedAt: new Date()
            }
        });

        res.status(200).send(`
            <html>
                <body style="font-family: sans-serif; text-align: center; padding: 50px; background-color: #fcfaf7;">
                    <h1 style="color: #D4AF37;">CERTIFICATION VALIDÉE</h1>
                    <p>Vos informations pour la <strong>Séance</strong> ont été scellées.</p>
                </body>
            </html>
        `);
    } catch (error) {
        res.status(500).send("Erreur technique de scellage.");
    }
};