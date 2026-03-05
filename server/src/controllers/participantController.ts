import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import crypto from 'crypto';
import { sendWelcomeAndSetupPasswordEmail } from '../services/emailService';
import * as pdfService from '../services/pdf';

/**
 * 🏺 VALIDATION ET SCELLAGE TRANSVERSAL
 * Permet la collaboration libre entre particuliers standards et membres CE.
 */
export const validateParticipantFromPDF = async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const firstName = (req.body.firstName || "").trim().toUpperCase();
    const lastName = (req.body.lastName || "").trim().toUpperCase();
    const email = (req.body.email || "").trim().toLowerCase();
    const phone = (req.body.phone || "").trim();

    if (!email) return res.status(400).send("L'adresse email est requise.");

    try {
        const result = await prisma.$transaction(async (tx) => {
            // 1. Extraction de la place avec les informations de la commande parente
            const participant = await tx.participant.findUnique({
                where: { id },
                include: {
                    orderItem: {
                        include: {
                            order: {
                                include: { user: true }
                            }
                        }
                    }
                }
            });

            if (!participant || participant.isValidated) {
                throw new Error("ALREADY_VALIDATED");
            }

            const parentOrder = participant.orderItem.order;

            // 🏺 Détermination de la provenance (Institutionnelle ou Privée)
            const isInstitutionalOrder = parentOrder.isBusiness;
            const orderCompanyName = isInstitutionalOrder ? parentOrder.user.companyName : null;
            const orderSiret = isInstitutionalOrder ? parentOrder.user.siret : null;

            let user = await tx.user.findUnique({ where: { email } });
            let isNewUser = false;

            const resetToken = crypto.randomBytes(32).toString('hex');
            const resetTokenExpires = new Date(Date.now() + 24 * 3600000);
            const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
            const newMemberCode = `RR-26-${randomSuffix}`;

            if (!user) {
                // SCÉNARIO A : Nouveau Membre (Inscrit via une séance CE ou Privée)
                isNewUser = true;
                user = await tx.user.create({
                    data: {
                        email,
                        firstName,
                        lastName,
                        phone,
                        memberCode: newMemberCode,
                        password: crypto.randomBytes(16).toString('hex'),
                        role: 'USER',
                        // Uniquement employé si la séance actuelle est institutionnelle
                        isEmployee: isInstitutionalOrder,
                        companyName: orderCompanyName,
                        siret: orderSiret,
                        resetToken,
                        resetTokenExpires
                    }
                });
            } else {
                // SCÉNARIO B : Membre Existant (Collaboration Mixte)
                // 🏺 Ici, on ne remplace jamais une donnée existante par du vide.
                // On additionne les statuts pour permettre la collaboration.
                user = await tx.user.update({
                    where: { id: user.id },
                    data: {
                        memberCode: user.memberCode || newMemberCode,
                        // Le membre devient/reste employé s'il participe à une séance CE
                        isEmployee: user.isEmployee || isInstitutionalOrder,
                        // On garde l'entreprise précédente si la séance actuelle est privée
                        companyName: orderCompanyName || user.companyName,
                        siret: orderSiret || user.siret,
                        resetToken,
                        resetTokenExpires
                    }
                });
            }

            // 2. Scellage définitif au Registre
            const updatedParticipant = await tx.participant.update({
                where: { id },
                data: {
                    firstName, lastName, email, phone,
                    memberCode: user.memberCode,
                    isValidated: true,
                    validatedAt: new Date(),
                    userId: user.id
                }
            });

            return { user, participant: updatedParticipant, isNewUser, resetToken };
        });

        await sendWelcomeAndSetupPasswordEmail(result.user.email, result.user.firstName, result.resetToken);

        res.status(200).json(result);

    } catch (error: any) {
        const errorMsg = error.message === "ALREADY_VALIDATED"
            ? "Cette place a déjà été scellée."
            : "Erreur technique de scellage.";
        res.status(400).json({ error: errorMsg });
    }
};

/**
 * 📜 EXTRACTION DU CERTIFICAT
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
                        order: { include: { user: true } }
                    }
                }
            }
        });

        if (!participant || !participant.isValidated) {
            return res.status(404).json({ error: "Certification non scellée." });
        }

        const pdfBytes = await pdfService.generateCertificationPDF(participant);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Certification_${participant.memberCode}.pdf`);
        res.send(Buffer.from(pdfBytes));
    } catch (error) {
        res.status(500).json({ error: "Échec du scellage PDF." });
    }
};