import { Resend } from 'resend';
import * as pdfService from './pdf';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = 'Atelier de la Route du Rhum - Compiègne <onboarding@resend.dev>';

/**
 * 📜 PROTOCOLE A : CONFIRMATION DE DOSSIER
 * Envoie le récapitulatif des flux et les certificats de Séance joints.
 */
export const sendOrderConfirmationEmail = async (userEmail: string, orderData: any) => {
    const isBusiness = orderData.isBusiness;

    try {
        // Appelle le chef d'orchestre global qui traite tous les items
        const pdfBytes = await pdfService.generateOrderPDF(orderData);
        const pdfBuffer = Buffer.from(pdfBytes);

        await resend.emails.send({
            from: FROM_EMAIL,
            to: userEmail,
            subject: `Validation du Registre - Réf : ${orderData.reference}`,
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
                    <p>Votre dossier de vente est désormais scellé. <strong>Vos documents de Séance sont joints à ce message.</strong></p>
                    </div>
            `
        });
    } catch (error) {
        console.error("❌ Incident de transmission (Confirmation):", error);
    }
};

/**
 * 📜 PROTOCOLE B : INVITATION ACCÈS MEMBRE
 * Déclenché après un scan QR Code pour définir le mot de passe du Passeport.
 */
export const sendWelcomeAndSetupPasswordEmail = async (userEmail: string, firstName: string, token: string) => {
    try {
        await resend.emails.send({
            from: FROM_EMAIL,
            to: userEmail,
            subject: `Bienvenue dans l'Établissement - Votre accès membre`,
            html: `
                <div style="font-family: Arial, sans-serif; color: #0a1a14; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #D4AF37;">
                    <h2 style="color: #D4AF37; text-transform: uppercase; text-align: center;">Bienvenue ${firstName}</h2>
                    <p>Votre compte membre a été scellé suite à votre participation à la <strong>Séance</strong>.</p>
                    
                    <p>Pour accéder à votre <strong>Passeport numérique</strong>, suivre votre progression dans le Cursus et bénéficier de remises en boutique, veuillez définir votre mot de passe.</p>
                    
                    <div style="text-align: center; margin: 40px 0;">
                        <a href="${process.env.FRONTEND_URL}/reset-password?token=${token}" 
                           style="background-color: #0a1a14; color: #D4AF37; padding: 15px 25px; text-decoration: none; font-weight: bold; text-transform: uppercase; font-size: 13px; border-radius: 4px;">
                            Définir mon mot de passe
                        </a>
                    </div>
                </div>
            `
        });
        console.log(`✅ Invitation transmise à ${userEmail}`);
    } catch (error) {
        console.error("❌ Incident de transmission (Bienvenue):", error);
    }
};

/**
 * 📜 PROTOCOLE C : EXPÉDITION DE TITRE DE CURSUS (Carte Cadeau)
 * Envoie le code unique et le document de prestige avec validité de 12 mois.
 */
export const sendGiftCardEmail = async (userEmail: string, giftCard: any, pdfBuffer: Buffer) => {
    try {
        const expirationDate = new Date(giftCard.expiresAt).toLocaleDateString('fr-FR');

        await resend.emails.send({
            from: FROM_EMAIL,
            to: userEmail,
            subject: `Votre Titre de Cursus - Carte Cadeau Établissement`,
            attachments: [
                {
                    filename: `Carte_Cadeau_${giftCard.code}.pdf`,
                    content: pdfBuffer,
                },
            ],
            html: `
                <div style="font-family: Arial, sans-serif; color: #0a1a14; max-width: 600px; margin: auto; padding: 30px; border: 2px solid #D4AF37; background-color: #fff;">
                    <h2 style="color: #D4AF37; text-transform: uppercase; text-align: center; letter-spacing: 2px;">Titre de Cursus Offert</h2>
                    
                    <p style="text-align: center; font-size: 16px;">Vous venez de recevoir un crédit de <strong>${giftCard.amount.toFixed(2)}€</strong> à valoir sur l'ensemble de notre Cursus et de la boutique.</p>
                    
                    <div style="background-color: #fcfaf7; padding: 25px; margin: 30px 0; border: 1px solid #d4af37; text-align: center;">
                        <p style="margin: 0; font-size: 12px; color: #d4af37; font-weight: bold; text-transform: uppercase;">Votre Code Unique :</p>
                        <h1 style="margin: 10px 0; color: #0a1a14; letter-spacing: 4px;">${giftCard.code}</h1>
                        <p style="margin: 0; font-size: 11px; color: #666;">Valable 12 mois — Jusqu'au ${expirationDate}</p>
                    </div>

                    <p><strong>Comment utiliser votre titre ?</strong></p>
                    <ul style="font-size: 13px; line-height: 1.6;">
                        <li><strong>En ligne :</strong> Saisissez votre code lors de la validation de votre panier.</li>
                        <li><strong>À l'Établissement :</strong> Présentez simplement ce document lors de votre venue.</li>
                    </ul>

                    <p style="font-size: 11px; color: #666; text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
                        Titre au porteur scellé par l'Infrastructure de l'Établissement.
                    </p>
                </div>
            `
        });
        console.log(`✅ Titre de Cursus expédié à ${userEmail}`);
    } catch (error) {
        console.error("❌ Incident de transmission (Carte Cadeau):", error);
    }
};