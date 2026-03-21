import { Resend } from 'resend';
import * as pdfService from './pdf';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = 'Atelier de la Route du Rhum <onboarding@resend.dev>';
const SITE_NAME = "L'Atelier de la Route du Rhum — Compiègne";

// URL du logo hébergé sur Cloudinary — à définir via EMAIL_LOGO_URL dans le .env
const LOGO_CDN_URL: string = process.env.EMAIL_LOGO_URL ?? '';

// ---------------------------------------------------------------------------
// 🧱 BASE TEMPLATE
// Wraps email content in a consistent shell (light background, logo, footer).
// ---------------------------------------------------------------------------
function baseTemplate(title: string, bodyHtml: string): string {
    const logoTag = LOGO_CDN_URL
        ? `<img src="${LOGO_CDN_URL}" alt="${SITE_NAME}" width="70" style="display:inline-block;margin-bottom:14px;" /><br />`
        : '';

    return `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>${title}</title>
        </head>
        <body style="margin:0;padding:0;background-color:#f5f5f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;padding:40px 0;">
            <tr><td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border:1px solid #e8e8e8;">

                <!-- En-tête avec logo -->
                <tr>
                    <td style="padding:36px 40px 28px;text-align:center;border-bottom:1px solid #f0f0f0;">
                        ${logoTag}
                        <h1 style="margin:0;color:#D4AF37;font-size:22px;font-weight:300;text-transform:uppercase;letter-spacing:3px;line-height:1.3;">
                            ${title}
                        </h1>
                        <div style="width:36px;height:1px;background-color:#D4AF37;margin:16px auto 0;"></div>
                    </td>
                </tr>

                <!-- Corps -->
                <tr>
                    <td style="padding:36px 40px;color:#1a1a1a;font-size:14px;line-height:1.75;">
                        ${bodyHtml}
                    </td>
                </tr>

                <!-- Pied de page -->
                <tr>
                    <td style="padding:20px 40px 28px;border-top:1px solid #f0f0f0;text-align:center;">
                        <p style="margin:0 0 6px;font-size:13px;color:#888;">
                            Toute l'équipe vous remercie de votre confiance.
                        </p>
                        <p style="margin:0;font-size:11px;color:#bbb;text-transform:uppercase;letter-spacing:1px;">
                            ${SITE_NAME}
                        </p>
                    </td>
                </tr>

                <!-- Notice auto-mail -->
                <tr>
                    <td style="padding:0 40px 24px;text-align:center;">
                        <p style="margin:0;font-size:11px;color:#ccc;">
                            Ceci est un message automatique, merci de ne pas y répondre directement.
                        </p>
                    </td>
                </tr>

            </table>
            </td></tr>
        </table>
        </body>
        </html>
    `;
}

// ---------------------------------------------------------------------------
// 📧 1. CONFIRMATION DE COMMANDE
// Envoie le récapitulatif d'achat et la facture en pièce jointe si disponible.
// ---------------------------------------------------------------------------
export const sendOrderConfirmationEmail = async (userEmail: string, orderData: any) => {
    try {
        const pdfBytes = await pdfService.generateOrderPDF(orderData);
        const hasPdf = pdfBytes !== null;
        const pdfBuffer = hasPdf ? Buffer.from(pdfBytes) : null;

        const isDelivery = orderData.deliveryMethod === 'DELIVERY';

        let receptionMessage = isDelivery
            ? "Votre commande est en cours de préparation. Elle sera expédiée prochainement à l'adresse indiquée lors de votre paiement."
            : "Votre commande est confirmée. Vous pouvez venir la retirer directement sur place, muni de ce message de confirmation.";

        const attachmentMessage = hasPdf
            ? "<p>Vous trouverez votre facture détaillée en pièce jointe de ce message.</p>"
            : "";

        const body = `
            <p>Bonjour,</p>
            <p>
                Nous vous confirmons la bonne réception de votre commande
                <strong>n°${orderData.reference}</strong>.
            </p>
            <p>${receptionMessage}</p>
            ${attachmentMessage}
        `;

        await resend.emails.send({
            from: FROM_EMAIL,
            to: userEmail,
            subject: `Confirmation de votre commande n°${orderData.reference}`,
            ...(hasPdf && pdfBuffer ? {
                attachments: [{
                    filename: `Facture_${orderData.reference}.pdf`,
                    content: pdfBuffer,
                }]
            } : {}),
            html: baseTemplate("Confirmation de commande", body)
        });
    } catch (error) {
        console.error("❌ Erreur lors de l'envoi du mail de confirmation :", error);
    }
};

// ---------------------------------------------------------------------------
// 🎁 2. CARTE CADEAU
// Envoie le code unique et le document PDF avec validité de 12 mois.
// ---------------------------------------------------------------------------
export const sendGiftCardEmail = async (userEmail: string, giftCard: any, pdfBuffer: Buffer) => {
    try {
        const expirationDate = new Date(giftCard.expiresAt).toLocaleDateString('fr-FR');

        const body = `
            <p>Bonjour,</p>
            <p>
                Votre carte cadeau d'un montant de
                <strong>${giftCard.amount.toFixed(2)}&nbsp;€</strong>
                est prête à l'emploi. Vous trouverez votre document en pièce jointe.
            </p>

            <div style="background-color:#fafafa;border:1px solid #e8e8e8;padding:24px;margin:24px 0;text-align:center;border-radius:2px;">
                <p style="margin:0 0 8px;font-size:11px;color:#D4AF37;font-weight:bold;text-transform:uppercase;letter-spacing:2px;">
                    Votre code
                </p>
                <p style="margin:0 0 10px;font-size:26px;font-weight:bold;color:#1a1a1a;letter-spacing:5px;">
                    ${giftCard.code}
                </p>
                <p style="margin:0;font-size:12px;color:#888;">
                    Valable 12 mois — jusqu'au ${expirationDate}
                </p>
            </div>

            <p><strong>Comment utiliser votre carte cadeau ?</strong></p>
            <ul style="padding-left:20px;color:#444;">
                <li style="margin-bottom:6px;">
                    <strong>En ligne :</strong> saisissez votre code lors de la validation de votre panier.
                </li>
                <li>
                    <strong>Sur place :</strong> présentez simplement ce document lors de votre venue.
                </li>
            </ul>
        `;

        await resend.emails.send({
            from: FROM_EMAIL,
            to: userEmail,
            subject: `Votre carte cadeau — Atelier de la Route du Rhum`,
            attachments: [{
                filename: `Carte_Cadeau_${giftCard.code}.pdf`,
                content: pdfBuffer,
            }],
            html: baseTemplate("Votre carte cadeau", body)
        });

        console.log(`✅ Carte cadeau envoyée à ${userEmail}`);
    } catch (error) {
        console.error("❌ Erreur lors de l'envoi de la carte cadeau :", error);
    }
};

// ---------------------------------------------------------------------------
// 🔑 3. INVITATION ACCÈS MEMBRE (scan QR Code)
// Déclenché après validation d'un participant pour définir son mot de passe.
// ---------------------------------------------------------------------------
export const sendWelcomeAndSetupPasswordEmail = async (userEmail: string, firstName: string, token: string) => {
    try {
        const body = `
            <p>Bonjour <strong>${firstName}</strong>,</p>
            <p>
                Votre compte membre a été créé suite à votre participation à l'un de nos ateliers.
                Pour accéder à votre espace personnel, suivre votre progression et bénéficier de vos avantages,
                veuillez définir votre mot de passe en cliquant sur le bouton ci-dessous.
            </p>

            <div style="text-align:center;margin:32px 0;">
                <a href="${process.env.FRONTEND_URL}/reset-password?token=${token}"
                   style="display:inline-block;background-color:#D4AF37;color:#1a1a1a;padding:14px 32px;text-decoration:none;font-weight:bold;font-size:12px;text-transform:uppercase;letter-spacing:3px;border-radius:2px;">
                    Définir mon mot de passe
                </a>
            </div>

            <p style="font-size:12px;color:#888;text-align:center;">
                Ce lien est valable pendant <strong>24 heures</strong>.
            </p>
        `;

        await resend.emails.send({
            from: FROM_EMAIL,
            to: userEmail,
            subject: `Bienvenue — Activez votre accès membre`,
            html: baseTemplate("Bienvenue", body)
        });

        console.log(`✅ Invitation envoyée à ${userEmail}`);
    } catch (error) {
        console.error("❌ Erreur lors de l'envoi de l'invitation :", error);
    }
};

// ---------------------------------------------------------------------------
// 🔓 4. RÉINITIALISATION DU MOT DE PASSE
// Déclenché par la demande "Mot de passe oublié".
// ---------------------------------------------------------------------------
export const sendForgotPasswordEmail = async (userEmail: string, firstName: string, token: string) => {
    try {
        const body = `
            <p>Bonjour <strong>${firstName}</strong>,</p>
            <p>
                Nous avons reçu une demande de réinitialisation du mot de passe associé à votre compte.
                Si vous êtes à l'origine de cette demande, cliquez sur le bouton ci-dessous.
            </p>

            <div style="text-align:center;margin:32px 0;">
                <a href="${process.env.FRONTEND_URL}/reset-password?token=${token}"
                   style="display:inline-block;background-color:#D4AF37;color:#1a1a1a;padding:14px 32px;text-decoration:none;font-weight:bold;font-size:12px;text-transform:uppercase;letter-spacing:3px;border-radius:2px;">
                    Réinitialiser mon mot de passe
                </a>
            </div>

            <p style="font-size:12px;color:#888;text-align:center;">
                Ce lien est valable pendant <strong>1 heure</strong>. Passé ce délai, une nouvelle demande sera nécessaire.
            </p>

            <div style="background-color:#fafafa;border:1px solid #f0f0f0;padding:16px;margin-top:24px;border-radius:2px;">
                <p style="margin:0;font-size:12px;color:#aaa;text-align:center;">
                    Si vous n'êtes pas à l'origine de cette demande, ignorez ce message.
                    Votre mot de passe restera inchangé.
                </p>
            </div>
        `;

        await resend.emails.send({
            from: FROM_EMAIL,
            to: userEmail,
            subject: `Réinitialisation de votre mot de passe`,
            html: baseTemplate("Nouveau mot de passe", body)
        });

        console.log(`✅ Lien de réinitialisation envoyé à ${userEmail}`);
    } catch (error) {
        console.error("❌ Erreur lors de l'envoi du lien de réinitialisation :", error);
    }
};
