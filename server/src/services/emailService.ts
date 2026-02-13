import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOrderConfirmationEmail = async (userEmail: string, orderData: any) => {
    try {
        await resend.emails.send({
            // Note : Utilisez l'adresse liée à votre compte Resend pour les tests
            from: 'Confirmation <onboarding@resend.dev>',
            to: userEmail,
            subject: `Confirmation de commande - Réf : ${orderData.reference}`,
            html: `
                <div style="font-family: Arial, sans-serif; color: #0a1a14; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
                    <h2 style="text-align: center; color: #0a1a14; text-transform: uppercase;">Confirmation de Commande</h2>
                    <p>Bonjour,</p>
                    <p>Nous vous confirmons la validation de votre paiement. Votre commande est désormais enregistrée.</p>
                    
                    <div style="background-color: #f9f9f9; padding: 15px; margin: 20px 0; border-left: 4px solid #0a1a14;">
                        <p style="margin: 0;"><strong>Référence :</strong> ${orderData.reference}</p>
                        <p style="margin: 0;"><strong>Date :</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
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
                                    <td style="padding: 10px;">
                                        ${item.name || 'Article'} (x${item.quantity || 0})
                                    </td>
                                    <td style="padding: 10px; text-align: right;">
                                        ${((item.price || 0) * (item.quantity || 0)).toFixed(2)}€
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>

                    <div style="text-align: right;">
                        <p style="font-size: 18px; font-weight: bold;">
                            Montant total réglé : ${Number(orderData.total || 0).toFixed(2)}€
                        </p>
                    </div>

                    <p style="margin-top: 40px; font-size: 11px; color: #666; text-align: center; border-top: 1px solid #eee; padding-top: 20px;">
                        Veuillez conserver cet e-mail ou le document PDF disponible dans votre espace client. Ces justificatifs vous seront demandés lors du retrait de vos produits ou de votre participation aux ateliers.
                    </p>
                </div>
            `
        });
        console.log(`E-mail de confirmation envoyé avec succès à ${userEmail}`);
    } catch (error) {
        console.error("Erreur lors de l'envoi de l'e-mail de confirmation:", error);
    }
};