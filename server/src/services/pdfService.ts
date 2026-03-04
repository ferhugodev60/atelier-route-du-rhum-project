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
 * 📜 GÉNÉRATION DU CERTIFICAT INDIVIDUEL (Format A4 Épuré)
 * Version "Zéro Friction" sans Code Client pour éviter la surcharge mentale.
 */
export const generateCertificationPDF = async (participant: any) => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 842.89]);
    const { width, height } = page.getSize();

    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Couleurs Institutionnelles
    const gold = rgb(0.83, 0.69, 0.22);
    const darkGreen = rgb(0.04, 0.1, 0.08);
    const softRed = rgb(0.8, 0, 0);
    const black = rgb(0, 0, 0);

    const workshop = participant.orderItem?.workshop;
    const workshopTitle = (workshop?.title || "SÉANCE INDIVIDUELLE").toUpperCase();

    // 🏺 Extraction des données de commande
    const orderRef = participant.orderItem?.order?.reference || "REF-INCONNUE";
    const companyName = participant.orderItem?.order?.user?.companyName || "ÉTABLISSEMENT";

    // 🏺 Logique de Validité par Level
    const isConception = workshop && workshop.level > 0;
    const dateGeneration = new Date();
    const dateFin = new Date();
    if (isConception) {
        dateFin.setMonth(dateFin.getMonth() + 6); // 6 mois pour Conception
    } else {
        dateFin.setDate(dateFin.getDate() + 30); // 30 jours pour Découverte
    }

    const formatDate = (date: Date) => date.toLocaleDateString('fr-FR');
    const validityPeriod = isConception ? "6 MOIS" : "30 JOURS";

    // 🏺 DESIGN GLOBAL
    page.drawRectangle({ x: 0, y: 0, width, height, color: rgb(1, 1, 1) });
    page.drawRectangle({ x: 20, y: 20, width: width - 40, height: height - 40, borderColor: gold, borderWidth: 0.5 });

    // 🏺 1. BLOC ADMINISTRATIF (En haut à gauche)
    const adminX = 50;
    const adminY = height - 50;
    page.drawText(`DATE D'ÉMISSION : ${formatDate(dateGeneration)}`, { x: adminX, y: adminY, size: 8, font: fontRegular, color: rgb(0.5, 0.5, 0.5) });
    page.drawText(`DOSSIER : ${orderRef}`, { x: adminX, y: adminY - 12, size: 8, font: fontBold, color: black });
    page.drawText(`ENTREPRISE : ${companyName.toUpperCase()}`, { x: adminX, y: adminY - 24, size: 8, font: fontBold, color: black });

    // 🏺 2. LOGO INSTITUTIONNEL (Centré)
    const logoPath = path.join(process.cwd(), 'public', 'assets', 'logo.jpg');
    if (fs.existsSync(logoPath)) {
        const logoBytes = fs.readFileSync(logoPath);
        const logoImage = await pdfDoc.embedJpg(logoBytes);
        const logoHeight = 70;
        const logoWidth = (logoImage.width / logoImage.height) * logoHeight;
        page.drawImage(logoImage, { x: (width - logoWidth) / 2, y: height - 160, width: logoWidth, height: logoHeight });
    }

    // 🏺 3. TITRE DE LA SÉANCE
    const subTitle = "BON POUR UNE SÉANCE";
    const subTitleWidth = fontRegular.widthOfTextAtSize(subTitle, 10);
    page.drawText(subTitle, { x: (width - subTitleWidth) / 2, y: height - 195, size: 10, font: fontRegular, color: gold });

    const titleSize = 28;
    const titleWidth = fontBold.widthOfTextAtSize(workshopTitle, titleSize);
    page.drawText(workshopTitle, { x: (width - titleWidth) / 2, y: height - 235, size: titleSize, font: fontBold, color: darkGreen });

    // 🏺 4. IDENTITÉ DU MEMBRE
    const centerY = height - 370;
    const nameText = `${participant.firstName} ${participant.lastName}`.toUpperCase();
    const nameWidth = fontBold.widthOfTextAtSize(nameText, 32);
    page.drawText(nameText, { x: (width - nameWidth) / 2, y: centerY, size: 32, font: fontBold, color: black });

    const contactInfo = `${participant.email}   •   ${participant.phone || 'SANS TÉLÉPHONE'}`;
    const contactWidth = fontRegular.widthOfTextAtSize(contactInfo, 11);
    page.drawText(contactInfo, { x: (width - contactWidth) / 2, y: centerY - 40, size: 11, font: fontRegular, color: rgb(0.4, 0.4, 0.4) });

    // 🏺 5. BLOC DE VALIDITÉ
    const validityY = centerY - 120;
    const validityLabel = `VALABLE : ${validityPeriod}`;
    const vLabelWidth = fontBold.widthOfTextAtSize(validityLabel, 14);
    page.drawText(validityLabel, { x: (width - vLabelWidth) / 2, y: validityY, size: 14, font: fontBold, color: black });

    const rangeText = `DU ${formatDate(dateGeneration)} AU ${formatDate(dateFin)}`;
    const rangeWidth = fontRegular.widthOfTextAtSize(rangeText, 12);
    page.drawText(rangeText, { x: (width - rangeWidth) / 2, y: validityY - 25, size: 12, font: fontRegular, color: black });

    // 🏺 6. APPEL À L'ACTION (Encadré de réservation)
    const boxW = 460; const boxH = 55;
    const boxX = (width - boxW) / 2;
    const boxY = validityY - 110;
    page.drawRectangle({ x: boxX, y: boxY, width: boxW, height: boxH, borderColor: softRed, borderWidth: 1.5, color: rgb(1, 0.98, 0.98) });

    const actionT = "PROCHAINE ÉTAPE : RÉSERVEZ VOTRE SÉANCE AU 06 41 42 00 28";
    const actionW = fontBold.widthOfTextAtSize(actionT, 11);
    page.drawText(actionT, { x: (width - actionW) / 2, y: boxY + 22, size: 11, font: fontBold, color: softRed });

    // 🏺 7. MENTION DE CADUCITÉ (Pied de page)
    const warning = "POUR TOUTE DATE DE VALIDITÉ DÉPASSÉE OU D'ABSENCE, LA CARTE CADEAU SERA CADUC";
    const warnW = fontRegular.widthOfTextAtSize(warning, 8);
    page.drawText(warning, { x: (width - warnW) / 2, y: 50, size: 8, font: fontRegular, color: rgb(0.7, 0.7, 0.7) });

    return await pdfDoc.save();
};