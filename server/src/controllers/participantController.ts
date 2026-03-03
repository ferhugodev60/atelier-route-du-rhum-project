import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import crypto from 'crypto';
import { sendWelcomeAndSetupPasswordEmail } from '../services/emailService';

/**
 * 🏺 VALIDATION "ZÉRO FRICTION" (Parcours Entreprise & Seniors)
 * Scelle la présence, crée le compte membre et génère le code d'accès.
 */
export const validateParticipantFromPDF = async (req: Request, res: Response) => {
    const id = req.params.id as string;

    // 🏺 Extraction et normalisation des données du Registre
    const firstName = (req.body.firstName || req.body[`firstName_${id}`] || "").trim().toUpperCase();
    const lastName = (req.body.lastName || req.body[`lastName_${id}`] || "").trim().toUpperCase();
    const email = (req.body.email || req.body[`email_${id}`] || "").trim().toLowerCase();
    const phone = (req.body.phone || req.body[`phone_${id}`] || "").trim();

    if (!email) return res.status(400).send("L'adresse email est indispensable pour sceller votre présence.");

    try {
        const result = await prisma.$transaction(async (tx) => {
            const participant = await tx.participant.findUnique({ where: { id } });

            if (!participant) throw new Error("IDENTIFICATION_NOT_FOUND");
            if (participant.isValidated) throw new Error("ALREADY_VALIDATED");

            let user = await tx.user.findUnique({ where: { email } });
            let isNewUser = false;

            // 🏺 CRÉATION AUTOMATIQUE DU COMPTE SI INEXISTANT
            if (!user) {
                isNewUser = true;
                const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
                const memberCode = `RR-26-${randomSuffix}`;

                // Mot de passe technique (sera remplacé par l'utilisateur via l'email)
                const tempPassword = crypto.randomBytes(16).toString('hex');

                user = await tx.user.create({
                    data: {
                        email,
                        firstName,
                        lastName,
                        phone,
                        memberCode,
                        password: tempPassword,
                        role: 'USER',
                        isEmployee: true // Active les -10% boutique [cite: 2026-02-12]
                    }
                });
            }

            // 🏺 SCELLAGE DE LA SÉANCE
            const updatedParticipant = await tx.participant.update({
                where: { id },
                data: {
                    firstName,
                    lastName,
                    email,
                    phone,
                    isValidated: true,
                    validatedAt: new Date(),
                    userId: user.id
                }
            });

            return { user, participant: updatedParticipant, isNewUser };
        });

        // 🏺 Envoi de l'email d'invitation si c'est un nouveau membre
        if (result.isNewUser) {
            await sendWelcomeAndSetupPasswordEmail(result.user.email, result.user.firstName);
        }

        res.status(200).send(`
            <html>
                <body style="font-family: sans-serif; text-align: center; padding: 40px; background-color: #fcfaf7; color: #0a1a14;">
                    <div style="max-width: 500px; margin: 0 auto; border: 2px solid #D4AF37; padding: 30px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                        <h1 style="color: #D4AF37; font-size: 28px; text-transform: uppercase; letter-spacing: 2px;">Bravo ${result.user.firstName} !</h1>
                        <p style="font-size: 18px;">Votre présence à la <strong>Séance</strong> est bien enregistrée.</p>
                        <hr style="border: 0; border-top: 1px solid #D4AF37; margin: 20px 0; opacity: 0.3;">
                        
                        <p style="font-size: 14px; opacity: 0.7; letter-spacing: 1px;">VOTRE CODE MEMBRE OFFICIEL :</p>
                        <div style="background: #0a1a14; color: #D4AF37; padding: 20px; font-size: 32px; font-weight: bold; margin: 20px 0; border-radius: 4px; letter-spacing: 4px; font-family: monospace;">
                            ${result.user.memberCode}
                        </div>
                        
                        <p style="font-size: 13px; color: #666; line-height: 1.6;">
                            Grâce à votre entreprise, ce code vous offre <strong>-10% sur toute la boutique</strong>.<br>
                            Un email vous a été envoyé pour finaliser votre accès personnel.
                        </p>
                        
                        <button onclick="window.print()" style="margin-top: 25px; background: #D4AF37; color: white; border: none; padding: 12px 25px; cursor: pointer; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">
                            Imprimer mon code
                        </button>
                    </div>
                </body>
            </html>
        `);
    } catch (error: any) {
        if (error.message === "IDENTIFICATION_NOT_FOUND") return res.status(404).send("Erreur : Place introuvable au Registre.");
        if (error.message === "ALREADY_VALIDATED") return res.status(400).send("Cette place a déjà été scellée.");
        res.status(500).send("Erreur technique de scellage.");
    }
};