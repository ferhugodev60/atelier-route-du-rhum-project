import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';
import path from 'path';
import fs from 'fs';

/**
 * 🏺 MOTEUR DE GÉNÉRATION DU REGISTRE PDF
 * Solution Certifiée : Sans caractères spéciaux pour éviter les erreurs 500.
 */
export const generateOrderPDF = async (order: any) => {
    const pdfDoc = await PDFDocument.create();

    // 🏺 On charge Helvetica explicitement
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const logoPath = path.join(process.cwd(), 'public', 'assets', 'logo.jpg');
    const logoBytes = fs.existsSync(logoPath) ? fs.readFileSync(logoPath) : null;
    const logoImage = logoBytes ? await pdfDoc.embedJpg(logoBytes) : null;

    for (const item of order.items) {
        if (!item.workshop) continue;

        // 🏺 On n'utilise que les participants RÉELS présents dans le registre
        const participantsToDraw = item.participants || [];

        for (const p of participantsToDraw) {
            const page = pdfDoc.addPage([595.28, 842.89]);
            const width = 595.28;
            const height = 842.89;

            if (logoImage) {
                page.drawImage(logoImage, { x: (width - 140) / 2, y: height - 120, width: 140, height: 60 });
            }

            page.drawText(`RÉF : ${order.reference}`, {
                x: 50, y: height - 40, size: 7, color: rgb(0.6, 0.6, 0.6), font: helveticaFont
            });

            if (p.isValidated) {
                // --- 🏺 ÉTAT SCELLÉ (Affichage définitif après scan) ---
                page.drawText("CERTIFICAT DE PRÉSENCE", {
                    x: 50, y: height - 250, size: 22, color: rgb(0.83, 0.68, 0.21), font: helveticaFont
                });

                const participantName = `${p.firstName || ''} ${p.lastName || ''}`.toUpperCase();
                page.drawText(participantName, {
                    x: 50, y: height - 300, size: 16, font: helveticaFont
                });

                // 🏺 RECTIFICATION : On utilise du texte standard (pas de symboles spéciaux)
                page.drawText("DOCUMENT OFFICIEL SCELLE AU REGISTRE", {
                    x: 50, y: height - 330, size: 9, color: rgb(0.1, 0.6, 0.2), font: helveticaFont
                });
            } else {
                // --- 🏺 ÉTAT À CERTIFIER (QR Code interactif) ---
                page.drawText("JUSTIFICATIF DE SEANCE", {
                    x: 50, y: height - 250, size: 22, color: rgb(0.83, 0.68, 0.21), font: helveticaFont
                });
                page.drawText("A PRESENTER LORS DE VOTRE VENUE", {
                    x: 50, y: height - 280, size: 10, color: rgb(0.4, 0.4, 0.4), font: helveticaFont
                });

                const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
                const validationUrl = `${frontendUrl}/validate/${p.id}`;

                const qrDataUrl = await QRCode.toDataURL(validationUrl, {
                    margin: 1,
                    width: 200,
                    color: { dark: '#0a1a14', light: '#ffffff' }
                });
                const qrImageBytes = Buffer.from(qrDataUrl.split(',')[1], 'base64');
                const qrImage = await pdfDoc.embedPng(qrImageBytes);

                page.drawImage(qrImage, { x: (width - 150) / 2, y: 350, width: 150, height: 150 });

                page.drawText("Scannez ce code pour enregistrer vos informations", {
                    x: (width - 200) / 2, y: 330, size: 8, color: rgb(0.5, 0.5, 0.5), font: helveticaFont
                });
            }
        }
    }

    // SECTION B : BOUTEILLES (Inchangée)
    const bottleItems = order.items.filter((i: any) => i.volume);
    if (bottleItems.length > 0) {
        const page = pdfDoc.addPage([595.28, 842.89]);
        if (logoImage) page.drawImage(logoImage, { x: (595.28 - 140) / 2, y: 722.89, width: 140, height: 60 });
        page.drawText("BON DE RETRAIT DE PRODUITS", {
            x: 50, y: 592.89, size: 22, color: rgb(0.83, 0.68, 0.21), font: helveticaFont
        });
        bottleItems.forEach((p: any, idx: number) => {
            page.drawText(`- ${p.volume?.product.name} x ${p.quantity}`, {
                x: 70, y: 542.89 - (idx * 25), size: 10, font: helveticaFont
            });
        });
    }

    return await pdfDoc.save();
};