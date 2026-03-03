import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import crypto from 'crypto';
import { sendWelcomeAndSetupPasswordEmail } from '../services/emailService';
import * as pdfService from '../services/pdfService';

export const validateParticipantFromPDF = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const firstName = (req.body.firstName || "").trim().toUpperCase();
    const lastName = (req.body.lastName || "").trim().toUpperCase();
    const email = (req.body.email || "").trim().toLowerCase();
    const phone = (req.body.phone || "").trim();

    if (!email) return res.status(400).send("L'adresse email est requise.");

    try {
        const result = await prisma.$transaction(async (tx) => {
            const participant = await tx.participant.findUnique({ where: { id } });
            if (!participant || participant.isValidated) throw new Error("INVALID_STATE");

            let user = await tx.user.findUnique({ where: { email } });
            let isNewUser = false;

            // 🏺 GÉNÉRATION DU MATRICULE (Nouveau ou Réparation)
            const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
            const newMemberCode = `RR-26-${randomSuffix}`;

            if (!user) {
                isNewUser = true;
                user = await tx.user.create({
                    data: {
                        email, firstName, lastName, phone,
                        memberCode: newMemberCode,
                        password: crypto.randomBytes(16).toString('hex'),
                        role: 'USER',
                        isEmployee: true
                    }
                });
            } else if (!user.memberCode) {
                // 🏺 RÉPARATION : L'utilisateur existe mais n'avait pas de matricule
                user = await tx.user.update({
                    where: { id: user.id },
                    data: { memberCode: newMemberCode, isEmployee: true }
                });
            }

            const updatedParticipant = await tx.participant.update({
                where: { id },
                data: { firstName, lastName, email, phone, memberCode: user.memberCode, isValidated: true, validatedAt: new Date(), userId: user.id }
            });

            return { user, participant: updatedParticipant, isNewUser };
        });

        if (result.isNewUser) {
            await sendWelcomeAndSetupPasswordEmail(result.user.email, result.user.firstName);
        }

        // 🏺 RENVOI JSON : Pour que la page React puisse lire data.user.memberCode
        res.status(200).json(result);
    } catch (error: any) {
        res.status(400).json({ error: "Erreur de scellage au registre." });
    }
};

/**
 * 📜 EXTRACTION DU CERTIFICAT INDIVIDUEL (PDF)
 * Génère un titre de présence avec Code Client et informations scellées.
 */
export const downloadCertificationPDF = async (req: Request, res: Response) => {
    const id = req.params.id as string;

    try {
        const participant = await prisma.participant.findUnique({
            where: { id },
            include: {
                orderItem: {
                    include: {
                        workshop: true,
                        order: {
                            include: { user: true }
                        }
                    }
                }
            }
        });

        if (!participant || !participant.isValidated) {
            return res.status(404).json({ error: "Certification non trouvée ou non scellée au Registre." });
        }

        const pdfBytes = await pdfService.generateCertificationPDF(participant);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Certification_${participant.memberCode}.pdf`);
        res.send(Buffer.from(pdfBytes));
    } catch (error) {
        console.error("❌ Erreur technique de génération PDF :", error);
        res.status(500).json({ error: "Échec technique du scellage PDF." });
    }
};