import { Resend } from 'resend';
import * as pdfService from './pdfService'; // 🏺 Import du moteur de scellage

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOrderConfirmationEmail = async (userEmail: string, orderData: any) => {
    const isBusiness = orderData.isBusiness;

    try {
        // 🏺 GÉNÉRATION DES DOCUMENTS EN TEMPS RÉEL
        // On utilise notre nouveau service pour créer le buffer PDF
        const pdfBytes = await pdfService.generateOrderPDF(orderData);
        const pdfBuffer = Buffer.from(pdfBytes);

        await resend.emails.send({
            from: 'Établissement - Gestion des Registres <onboarding@resend.dev>',
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
                    <p>Votre dossier de vente est désormais validé. <strong>Vos documents d'accès interactifs sont joints à ce message.</strong></p>
                    
                    ${isBusiness ? `
                    <div style="background-color: #fcfaf7; padding: 15px; margin: 20px 0; border: 1px solid #d4af37;">
                        <p style="margin: 0; color: #d4af37; font-weight: bold; text-transform: uppercase; font-size: 12px;">Protocoles des Titres :</p>
                        <p style="margin: 10px 0 0 0; font-size: 13px;">
                            Veuillez transmettre les PDF joints à vos participants. 
                            <strong>Chaque participant doit compléter ses informations directement dans le fichier PDF</strong> et cliquer sur le bouton "Valider" pour sceller sa présence au registre.
                        </p>
                    </div>
                    ` : ''}

                    <div style="background-color: #f9f9f9; padding: 15px; margin: 20px 0; border-left: 4px solid #D4AF37;">
                        <p style="margin: 0;"><strong>Référence de Dossier :</strong> ${orderData.reference}</p>
                        <p style="margin: 0;"><strong>Nature :</strong> ${isBusiness ? 'Contrat Institutionnel' : 'Séance Particulier'}</p>
                    </div>

                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                        <thead>
                            <tr style="border-bottom: 2px solid #eee;">
                                <th style="text-align: left; padding: 10px;">Désignation</th>
                                <th style="text-align: right; padding: 10px;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${orderData.items.map((item: any) => `
                                <tr style="border-bottom: 1px solid #eee;">
                                    <td style="padding: 10px;">${item.workshop?.title || 'Article'} (x${item.quantity})</td>
                                    <td style="padding: 10px; text-align: right;">${((item.price || 0) * (item.quantity || 0)).toFixed(2)}€</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>

                    <p style="margin-top: 40px; font-size: 11px; color: #666; text-align: center; border-top: 1px solid #eee; padding-top: 20px;">
                        Ceci est un document officiel. Les données saisies dans les PDF joints seront gravées de manière immuable dans notre système de gestion dès validation.
                    </p>
                </div>
            `
        });
    } catch (error) {
        console.error("❌ Incident de transmission E-mail:", error);
    }
};