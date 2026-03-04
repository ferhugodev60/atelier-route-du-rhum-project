import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import crypto from 'crypto';
import { sendWelcomeAndSetupPasswordEmail } from '../services/emailService';
import * as pdfService from '../services/pdfService';

export const validateParticipantFromPDF = async (req: Request, res: Response) => {
    const id = req.params.id as string;

    // 🏺 Extraction et normalisation des données pour le Registre
    const firstName = (req.body.firstName || "").trim().toUpperCase();
    const lastName = (req.body.lastName || "").trim().toUpperCase();
    const email = (req.body.email || "").trim().toLowerCase();
    const phone = (req.body.phone || "").trim();

    if (!email) return res.status(400).send("L'adresse email est requise.");

    try {
        const result = await prisma.$transaction(async (tx) => {
            // 1. Vérification de l'existence de la place dans le Registre
            const participant = await tx.participant.findUnique({ where: { id } });
            if (!participant || participant.isValidated) {
                throw new Error("ALREADY_VALIDATED");
            }

            // 2. Recherche du compte membre existant
            let user = await tx.user.findUnique({ where: { email } });
            let isNewUser = false;

            // 🏺 GÉNÉRATION DES CRÉDENTIALS DE SÉCURITÉ
            // Jeton unique pour définir le secret (valide 24h)
            const resetToken = crypto.randomBytes(32).toString('hex');
            const resetTokenExpires = new Date(Date.now() + 24 * 3600000);

            // Matricule institutionnel certifié : RR-26-XXXX
            const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
            const newMemberCode = `RR-26-${randomSuffix}`;

            if (!user) {
                // SCÉNARIO A : Nouveau Membre
                isNewUser = true;
                user = await tx.user.create({
                    data: {
                        email,
                        firstName,
                        lastName,
                        phone,
                        memberCode: newMemberCode,
                        password: crypto.randomBytes(16).toString('hex'), // Verrou temporaire
                        role: 'USER',
                        isEmployee: true,
                        resetToken, // Scellage du jeton de sécurité
                        resetTokenExpires
                    }
                });
            } else {
                // SCÉNARIO B : Membre existant (Mise à jour et génération d'un nouveau jeton)
                user = await tx.user.update({
                    where: { id: user.id },
                    data: {
                        memberCode: user.memberCode || newMemberCode,
                        isEmployee: true,
                        resetToken,
                        resetTokenExpires
                    }
                });
            }

            // 3. Scellage définitif du Participant à la Séance
            const updatedParticipant = await tx.participant.update({
                where: { id },
                data: {
                    firstName,
                    lastName,
                    email,
                    phone,
                    memberCode: user.memberCode,
                    isValidated: true,
                    validatedAt: new Date(),
                    userId: user.id
                }
            });

            return { user, participant: updatedParticipant, isNewUser, resetToken };
        });

        // 🏺 TRANSMISSION DU COURRIER D'INVITATION
        // On envoie systématiquement le mail pour permettre de (re)définir le secret personnel
        try {
            await sendWelcomeAndSetupPasswordEmail(
                result.user.email,
                result.user.firstName,
                result.resetToken
            );
        } catch (emailError) {
            console.error("⚠️ Registre scellé mais échec technique de transmission du mail.", emailError);
        }

        // 🏺 Renvoi JSON pour l'interface React (Code Client affiché à l'écran)
        res.status(200).json(result);

    } catch (error: any) {
        const errorMsg = error.message === "ALREADY_VALIDATED"
            ? "Cette place a déjà été scellée au registre."
            : "Erreur technique de scellage au registre.";
        res.status(400).json({ error: errorMsg });
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