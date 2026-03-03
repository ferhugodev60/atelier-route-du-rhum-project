import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';
import path from 'path';
import fs from 'fs';

/**
 * 🏺 MOTEUR DE GÉNÉRATION DU REGISTRE PDF
 * Aligne le rendu selon le profil : Résumé (Particulier) ou QR Code (Entreprise).
 */
export const generateOrderPDF = async (order: any) => {
    const pdfDoc = await PDFDocument.create();
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

            page.drawText(`REF : ${order.reference}`, {
                x: 50, y: height - 40, size: 7, color: rgb(0.6, 0.6, 0.6), font: helveticaFont
            });

            // 🏺 LOGIQUE DE DIFFÉRENCIATION (Particulier vs Entreprise)
            // Si le nom est déjà présent (saisi au checkout), on imprime le certificat direct
            const isPreFilled = p.firstName && p.lastName;

            if (isPreFilled || p.isValidated) {
                // --- 🏺 MODE RÉSUMÉ (Particuliers / CSE) ---
                // Aucune action de scan n'est requise pour ces profils
                page.drawText("CONFIRMATION DE RESERVATION", {
                    x: 50, y: height - 250, size: 22, color: rgb(0.83, 0.68, 0.21), font: helveticaFont
                });

                page.drawText(`SEANCE : ${item.workshop.title.toUpperCase()}`, {
                    x: 50, y: height - 280, size: 12, font: helveticaFont
                });

                const participantName = `${p.firstName || ''} ${p.lastName || ''}`.toUpperCase();
                page.drawText(`PARTICIPANT : ${participantName}`, {
                    x: 50, y: height - 320, size: 16, font: helveticaFont
                });

                page.drawText("DOCUMENT CERTIFIE PAR L'ETABLISSEMENT", {
                    x: 50, y: height - 350, size: 9, color: rgb(0.1, 0.6, 0.2), font: helveticaFont
                });
            } else {
                // --- 🏺 MODE VALIDATION (Entreprises - 25/10 places) ---
                // Génère un QR Code unique pour une saisie différée
                page.drawText("JUSTIFICATIF DE SEANCE A VALIDER", {
                    x: 50, y: height - 250, size: 22, color: rgb(0.83, 0.68, 0.21), font: helveticaFont
                });
                page.drawText("A SCANNER POUR ENREGISTRER LE PARTICIPANT", {
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