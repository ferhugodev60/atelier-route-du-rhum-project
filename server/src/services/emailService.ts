import { Resend } from 'resend';
import * as pdfService from './pdfService';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * 📜 PROTOCOLE A : CONFIRMATION DE COMMANDE
 * Envoie le récapitulatif et les justificatifs PDF pour la Séance.
 */
export const sendOrderConfirmationEmail = async (userEmail: string, orderData: any) => {
    const isBusiness = orderData.isBusiness;

    try {
        const pdfBytes = await pdfService.generateOrderPDF(orderData);
        const pdfBuffer = Buffer.from(pdfBytes);

        await resend.emails.send({
            from: 'Établissement - Registre <onboarding@resend.dev>',
            to: userEmail,
            subject: `Confirmation de Dossier - Réf : ${orderData.reference}`,
            attachments: [
                {
                    filename: `Certificats_${orderData.reference}.pdf`,
                    content: pdfBuffer,
                },
            ],
            html: `
                <div style="font-family: Arial, sans-serif; color: #0a1a14; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
                    <h2 style="text-align: center; color: #D4AF37; text-transform: uppercase;">Validation du Registre</h2>
                    <p>Bonjour,</p>
                    <p>Votre dossier est désormais validé. <strong>Vos documents de Séance sont joints à ce message.</strong></p>
                    
                    ${isBusiness ? `
                    <div style="background-color: #fcfaf7; padding: 15px; margin: 20px 0; border: 1px solid #d4af37;">
                        <p style="margin: 0; color: #d4af37; font-weight: bold; text-transform: uppercase; font-size: 12px;">Note Institutionnelle :</p>
                        <p style="margin: 10px 0 0 0; font-size: 13px;">
                            Veuillez transmettre les documents joints à vos participants. 
                            <strong>Chaque participant doit scanner son QR Code unique</strong> pour sceller sa présence et obtenir son code membre.
                        </p>
                    </div>
                    ` : ''}

                    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                        <tr style="border-bottom: 2px solid #eee;">
                            <th style="text-align: left; padding: 10px;">Désignation</th>
                            <th style="text-align: right; padding: 10px;">Total</th>
                        </tr>
                        ${orderData.items.map((item: any) => `
                            <tr style="border-bottom: 1px solid #eee;">
                                <td style="padding: 10px;">${item.workshop?.title || 'Article'} (x${item.quantity})</td>
                                <td style="padding: 10px; text-align: right;">${((item.price || 0) * (item.quantity || 0)).toFixed(2)}€</td>
                            </tr>
                        `).join('')}
                    </table>

                    <p style="font-size: 11px; color: #666; text-align: center; border-top: 1px solid #eee; padding-top: 20px;">
                        Ceci est un document officiel généré par notre infrastructure de gestion.
                    </p>
                </div>
            `
        });
    } catch (error) {
        console.error("❌ Incident de transmission E-mail (Confirmation):", error);
    }
};

/**
 * 📜 PROTOCOLE B : INVITATION NOUVEAU MEMBRE
 * Permet au participant de définir son mot de passe après un scan QR Code.
 */
export const sendWelcomeAndSetupPasswordEmail = async (userEmail: string, firstName: string, token: string) => {
    try {
        await resend.emails.send({
            from: 'Atelier de la Route du Rhum <onboarding@resend.dev>',
            to: userEmail,
            subject: `Bienvenue dans l'Établissement - Votre accès membre`,
            html: `
                <div style="font-family: Arial, sans-serif; color: #0a1a14; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #D4AF37;">
                    <h2 style="color: #D4AF37; text-transform: uppercase; text-align: center;">Bienvenue ${firstName}</h2>
                    <p>Votre compte membre a été créé automatiquement suite à votre participation à la <strong>Séance</strong>.</p>
                    
                    <p>Pour accéder à votre espace, suivre votre progression et bénéficier de <strong>-10% sur la boutique</strong>, vous devez définir votre mot de passe personnel.</p>
                    
                    <div style="text-align: center; margin: 40px 0;">
                        <a href="${process.env.FRONTEND_URL}/reset-password?token=${token}" 
                           style="background-color: #0a1a14; color: #D4AF37; padding: 15px 25px; text-decoration: none; font-weight: bold; text-transform: uppercase; font-size: 13px; border-radius: 4px;">
                            Définir mon mot de passe
                        </a>
                    </div>
                    
                    <p style="font-size: 12px; color: #666; text-align: center;">
                        Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer ce message.
                    </p>
                </div>
            `
        });
        console.log(`✅ Email d'invitation envoyé à ${userEmail}`);
    } catch (error) {
        console.error("❌ Incident de transmission E-mail (Invitation):", error);
    }
};