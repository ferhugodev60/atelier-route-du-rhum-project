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
            // 1. Recherche de la place avec inclusion de l'acheteur (PRO)
            const participant = await tx.participant.findUnique({
                where: { id },
                include: {
                    orderItem: {
                        include: {
                            order: {
                                include: { user: true } // 🏺 Récupération de l'identité de l'entreprise parente
                            }
                        }
                    }
                }
            });

            if (!participant || participant.isValidated) {
                throw new Error("ALREADY_VALIDATED");
            }

            // 🏺 EXTRACTION DES DONNÉES DE FILIATION INSTITUTIONNELLE
            const parentOrder = participant.orderItem.order;
            const companyName = parentOrder.isBusiness ? parentOrder.user.companyName : null;
            const siret = parentOrder.isBusiness ? parentOrder.user.siret : null;

            // 2. Recherche du compte membre existant
            let user = await tx.user.findUnique({ where: { email } });
            let isNewUser = false;

            // 🏺 GÉNÉRATION DES CRÉDENTIALS DE SÉCURITÉ
            const resetToken = crypto.randomBytes(32).toString('hex');
            const resetTokenExpires = new Date(Date.now() + 24 * 3600000);
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
                        companyName, // 🏺 Scellage du nom de l'entreprise
                        siret,       // 🏺 Scellage du numéro SIRET
                        resetToken,
                        resetTokenExpires
                    }
                });
            } else {
                // SCÉNARIO B : Membre existant (Mise à jour du statut et de l'entreprise)
                user = await tx.user.update({
                    where: { id: user.id },
                    data: {
                        memberCode: user.memberCode || newMemberCode,
                        isEmployee: true,
                        companyName, // 🏺 Mise à jour de l'entreprise actuelle
                        siret,       // 🏺 Mise à jour du SIRET
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

        // 🏺 TRANSMISSION DU COURRIER D'INVITATION AVEC LE JETON DE SÉCURITÉ
        try {
            await sendWelcomeAndSetupPasswordEmail(
                result.user.email,
                result.user.firstName,
                result.resetToken
            );
        } catch (emailError) {
            console.error("⚠️ Registre scellé mais échec technique de transmission du mail.", emailError);
        }

        // 🏺 Renvoi JSON (Le code client est masqué à l'écran selon vos directives)
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