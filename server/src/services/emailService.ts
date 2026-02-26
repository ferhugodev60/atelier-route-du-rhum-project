import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOrderConfirmationEmail = async (userEmail: string, orderData: any) => {
    const isBusiness = orderData.isBusiness;

    try {
        await resend.emails.send({
            from: 'Atelier de la Route du Rhum <onboarding@resend.dev>',
            to: userEmail,
            subject: `Confirmation de Contrat - Réf : ${orderData.reference}`,
            html: `
                <div style="font-family: Arial, sans-serif; color: #0a1a14; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
                    <h2 style="text-align: center; color: #0a1a14; text-transform: uppercase;">Validation de votre Registre</h2>
                    <p>Bonjour,</p>
                    <p>Nous vous confirmons la validation de votre commande. Vos documents d'accès sont disponibles.</p>
                    
                    ${isBusiness ? `
                    <div style="background-color: #fff9e6; padding: 15px; margin: 20px 0; border: 1px solid #d4af37;">
                        <p style="margin: 0; color: #d4af37; font-weight: bold; text-transform: uppercase; font-size: 12px;">⚠️ Protocole Grand Compte :</p>
                        <p style="margin: 10px 0 0 0; font-size: 13px;">
                            Votre contrat inclut des <strong>bons de formation vierges</strong> à compléter manuellement. 
                            Après avoir effectué l'achat, il est impératif de contacter <strong>l'Atelier de la Route du Rhum</strong> 
                            pour réserver les dates, car la capacité d'accueil est limitée à <strong>15 places maximum</strong> par session.
                        </p>
                    </div>
                    ` : ''}

                    <div style="background-color: #f9f9f9; padding: 15px; margin: 20px 0; border-left: 4px solid #0a1a14;">
                        <p style="margin: 0;"><strong>Référence :</strong> ${orderData.reference}</p>
                        <p style="margin: 0;"><strong>Type :</strong> ${isBusiness ? 'Contrat Professionnel (CE)' : 'Séance Particulier'}</p>
                    </div>

                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                        <thead>
                            <tr style="border-bottom: 2px solid #eee;">
                                <th style="text-align: left; padding: 10px;">Désignation</th>
                                <th style="text-align: right; padding: 10px;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${orderData.items.map((item: any) => {
                // 🏺 On identifie le nom selon qu'il s'agisse d'un atelier ou d'une bouteille
                const displayName = item.workshop
                    ? item.workshop.title
                    : (item.volume?.product?.name
                        ? `${item.volume.product.name} (${item.volume.size}${item.volume.unit})`
                        : "Article");

                return `
                                    <tr style="border-bottom: 1px solid #eee;">
                                        <td style="padding: 10px;">
                                            ${displayName} (x${item.quantity || 0})
                                        </td>
                                        <td style="padding: 10px; text-align: right;">
                                            ${((item.price || 0) * (item.quantity || 0)).toFixed(2)}€
                                        </td>
                                    </tr>
                                `;
            }).join('')}
                        </tbody>
                    </table>

                    <div style="text-align: right;">
                        <p style="font-size: 18px; font-weight: bold;">
                            Montant total réglé : ${Number(orderData.total || 0).toFixed(2)}€
                        </p>
                    </div>

                    <p style="margin-top: 40px; font-size: 11px; color: #666; text-align: center; border-top: 1px solid #eee; padding-top: 20px;">
                        Veuillez télécharger vos certificats dans votre espace client. Ils devront être présentés (complétés au stylo pour les offres CE) lors de votre venue ou du retrait de vos dotations.
                    </p>
                </div>
            `
        });
    } catch (error) {
        console.error("Erreur E-mail:", error);
    }
};