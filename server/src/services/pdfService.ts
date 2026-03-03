import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';
import path from 'path';
import fs from 'fs';

/**
 * 🏺 MOTEUR DE GÉNÉRATION DU REGISTRE PDF
 * Gère le rendu groupé : Résumé (Particulier) ou QR Codes (Entreprise).
 */
export const generateOrderPDF = async (order: any) => {
    const pdfDoc = await PDFDocument.create();
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const logoPath = path.join(process.cwd(), 'public', 'assets', 'logo.jpg');
    const logoBytes = fs.existsSync(logoPath) ? fs.readFileSync(logoPath) : null;
    const logoImage = logoBytes ? await pdfDoc.embedJpg(logoBytes) : null;

    for (const item of order.items) {
        if (!item.workshop) continue;

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
            const isPreFilled = (p.firstName && p.lastName) || p.isValidated;

            if (isPreFilled) {
                // --- 🏺 MODE RÉSUMÉ (Particuliers / CSE) ---
                page.drawText("CONFIRMATION DE RÉSERVATION", {
                    x: 50, y: height - 250, size: 22, color: rgb(0.83, 0.68, 0.21), font: helveticaFont
                });

                page.drawText(`SÉANCE : ${item.workshop.title.toUpperCase()}`, {
                    x: 50, y: height - 280, size: 12, font: helveticaFont, color: rgb(1, 1, 1)
                });

                const participantName = `${p.firstName || ''} ${p.lastName || ''}`.toUpperCase();
                page.drawText(`PARTICIPANT : ${participantName}`, {
                    x: 50, y: height - 320, size: 16, font: helveticaFont, color: rgb(1, 1, 1)
                });

                page.drawText("DOCUMENT CERTIFIÉ PAR L'ÉTABLISSEMENT", {
                    x: 50, y: height - 350, size: 9, color: rgb(0.1, 0.6, 0.2), font: helveticaFont
                });
            } else {
                // --- 🏺 MODE VALIDATION (Entreprises - QR Codes) ---
                page.drawText("JUSTIFICATIF DE SÉANCE À VALIDER", {
                    x: 50, y: height - 250, size: 22, color: rgb(0.83, 0.68, 0.21), font: helveticaFont
                });
                page.drawText("À SCANNER POUR ENREGISTRER LE PARTICIPANT", {
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

    // SECTION PRODUITS BOUTIQUE
    const bottleItems = order.items.filter((i: any) => i.volumeId);
    if (bottleItems.length > 0) {
        const page = pdfDoc.addPage([595.28, 842.89]);
        if (logoImage) page.drawImage(logoImage, { x: (595.28 - 140) / 2, y: 722.89, width: 140, height: 60 });
        page.drawText("BON DE RETRAIT DE PRODUITS", {
            x: 50, y: 592.89, size: 22, color: rgb(0.83, 0.68, 0.21), font: helveticaFont
        });
        bottleItems.forEach((p: any, idx: number) => {
            const productName = p.volume?.product?.name || "Produit Boutique";
            page.drawText(`- ${productName} x ${p.quantity}`, {
                x: 70, y: 542.89 - (idx * 25), size: 10, font: helveticaFont, color: rgb(1, 1, 1)
            });
        });
    }

    return await pdfDoc.save();
};

/**
 * 📜 GÉNÉRATION DU CERTIFICAT INDIVIDUEL (Après validation)
 * Document officiel Noir & Or avec Code Client.
 */
export const generateCertificationPDF = async (participant: any) => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 420]); // Format paysage type diplôme
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const workshopTitle = participant.orderItem?.workshop?.title || "SÉANCE INDIVIDUELLE";

    // 🏺 Design Institutionnel
    page.drawRectangle({ x: 0, y: 0, width: 595.28, height: 420, color: rgb(0.04, 0.1, 0.08) }); // Fond Noir
    page.drawRectangle({ x: 20, y: 20, width: 555.28, height: 380, borderColor: rgb(0.83, 0.69, 0.22), borderWidth: 2 }); // Bordure Or

    page.drawText('CERTIFICAT DE PRÉSENCE', { x: 50, y: 340, size: 26, font, color: rgb(0.83, 0.69, 0.22) });
    page.drawText('SCELLÉ AU REGISTRE DE L\'ÉTABLISSEMENT', { x: 50, y: 315, size: 8, font, color: rgb(1, 1, 1) });

    // Informations Identité
    page.drawText(`MEMBRE : ${participant.firstName} ${participant.lastName}`, { x: 50, y: 250, size: 16, font, color: rgb(1, 1, 1) });
    page.drawText(`SÉANCE : ${workshopTitle.toUpperCase()}`, { x: 50, y: 215, size: 16, font, color: rgb(1, 1, 1) });

    page.drawText(`CONTACT : ${participant.email}`, { x: 50, y: 180, size: 10, font, color: rgb(0.5, 0.5, 0.5) });
    if (participant.phone) {
        page.drawText(`TEL : ${participant.phone}`, { x: 50, y: 160, size: 10, font, color: rgb(0.5, 0.5, 0.5) });
    }

    // 🏺 Mise en avant du Code Client (Rectange translucide Or)
    page.drawRectangle({ x: 50, y: 60, width: 250, height: 70, color: rgb(0.83, 0.69, 0.22), opacity: 0.1 });
    page.drawText('VOTRE CODE CLIENT OFFICIEL :', { x: 65, y: 110, size: 9, font, color: rgb(0.83, 0.69, 0.22) });
    page.drawText(participant.memberCode || "EN ATTENTE", { x: 65, y: 80, size: 22, font, color: rgb(0.83, 0.69, 0.22) });

    // Note sur les avantages boutique
    page.drawText('-10% SUR LA BOUTIQUE', { x: 320, y: 80, size: 10, font, color: rgb(1, 1, 1) });

    return await pdfDoc.save();
};