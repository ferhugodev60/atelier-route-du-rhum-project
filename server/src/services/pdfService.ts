import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';
import path from 'path';
import fs from 'fs';

/**
 * 📜 GÉNÉRATEUR DE REGISTRE PDF INSTITUTIONNEL
 * Gère le rendu hybride : Certificats nominatifs ou QR Codes d'activation.
 */
export const generateOrderPDF = async (order: any) => {
    const pdfDoc = await PDFDocument.create();
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Couleurs Institutionnelles
    const gold = rgb(0.83, 0.69, 0.22);
    const darkGreen = rgb(0.04, 0.1, 0.08);
    const softRed = rgb(0.8, 0, 0);
    const black = rgb(0, 0, 0);

    // 🏺 Chargement certifié du Logo de l'Établissement
    const logoPath = path.join(process.cwd(), 'public', 'assets', 'logo.jpg');
    const logoBytes = fs.existsSync(logoPath) ? fs.readFileSync(logoPath) : null;
    const logoImage = logoBytes ? await pdfDoc.embedJpg(logoBytes) : null;

    for (const item of order.items) {
        if (!item.workshop) continue;
        const participants = item.participants || [];

        for (const p of participants) {
            const isConfigured = (p.firstName && p.lastName);

            // 🏺 LOGIQUE DE FILTRAGE DYNAMIQUE (PRO UNIQUEMENT)
            // Si la commande est PRO et que l'identité est déjà scellée, on ignore la page.
            if (order.isBusiness && isConfigured) {
                continue;
            }

            const page = pdfDoc.addPage([595.28, 842.89]);
            const { width, height } = page.getSize();

            // Bordure Institutionnelle Or
            page.drawRectangle({
                x: 20, y: 20, width: width - 40, height: height - 40,
                borderColor: gold, borderWidth: 0.5
            });

            // Entête et Logo
            page.drawText(`RÉFÉRENCE DOSSIER : ${order.reference}`, {
                x: 50, y: height - 50, size: 8, font: fontBold, color: black
            });

            if (logoImage) {
                const logoHeight = 60;
                const logoWidth = (logoImage.width / logoImage.height) * logoHeight;
                page.drawImage(logoImage, {
                    x: (width - logoWidth) / 2, y: height - 140, width: logoWidth, height: logoHeight
                });
            }

            // --- 🏺 CONDITION DE RENDU : CERTIFICAT vs ACTIVATION ---
            const isIndividual = isConfigured || p.isValidated;

            if (isIndividual) {
                // --- MODE CERTIFICAT D'ADMISSION (Particulier / CE) ---
                const workshopTitle = item.workshop.title.toUpperCase();
                page.drawText("BON POUR UNE SÉANCE", {
                    x: (width - fontRegular.widthOfTextAtSize("BON POUR UNE SÉANCE", 10)) / 2,
                    y: height - 180, size: 10, font: fontRegular, color: gold
                });
                page.drawText(workshopTitle, {
                    x: (width - fontBold.widthOfTextAtSize(workshopTitle, 24)) / 2,
                    y: height - 215, size: 24, font: fontBold, color: darkGreen
                });

                // Identité et Coordonnées
                const nameText = `${p.firstName} ${p.lastName}`.toUpperCase();
                page.drawText(nameText, {
                    x: (width - fontBold.widthOfTextAtSize(nameText, 28)) / 2,
                    y: height - 340, size: 28, font: fontBold, color: black
                });

                const contactInfo = `${p.email}  •  ${p.phone || 'SANS TÉLÉPHONE'}`;
                page.drawText(contactInfo, {
                    x: (width - fontRegular.widthOfTextAtSize(contactInfo, 10)) / 2,
                    y: height - 365, size: 10, font: fontRegular, color: rgb(0.4, 0.4, 0.4)
                });

                // Spécificité Cursus Conception
                if (item.workshop.level > 0 && p.memberCode) {
                    const codeText = `CODE PASSEPORT : ${p.memberCode.toUpperCase()}`;
                    page.drawText(codeText, {
                        x: (width - fontBold.widthOfTextAtSize(codeText, 11)) / 2,
                        y: height - 390, size: 11, font: fontBold, color: gold
                    });
                }

                // Période de Validité
                const isConception = item.workshop.level > 0;
                const dateFin = new Date(order.createdAt);
                isConception ? dateFin.setMonth(dateFin.getMonth() + 6) : dateFin.setDate(dateFin.getDate() + 30);

                const validityLabel = `VALIDITÉ : ${isConception ? "6 MOIS" : "30 JOURS"}`;
                page.drawText(validityLabel, {
                    x: (width - fontBold.widthOfTextAtSize(validityLabel, 12)) / 2,
                    y: height - 480, size: 12, font: fontBold, color: black
                });
                page.drawText(`ÉCHÉANCE AU ${dateFin.toLocaleDateString('fr-FR')}`, {
                    x: (width - fontRegular.widthOfTextAtSize(`ÉCHÉANCE AU ${dateFin.toLocaleDateString('fr-FR')}`, 11)) / 2,
                    y: height - 500, size: 11, font: fontRegular, color: black
                });

                // Bloc de réservation
                page.drawRectangle({
                    x: (width - 440) / 2, y: height - 600, width: 440, height: 50,
                    borderColor: softRed, borderWidth: 1.5, color: rgb(1, 0.98, 0.98)
                });
                const actionT = "RÉSERVEZ VOTRE SÉANCE AU 06 41 42 00 28";
                page.drawText(actionT, {
                    x: (width - fontBold.widthOfTextAtSize(actionT, 11)) / 2,
                    y: height - 580, size: 11, font: fontBold, color: softRed
                });

                const warning = "TOUTE SÉANCE NON RÉSERVÉE AVANT ÉCHÉANCE SERA DÉFINITIVEMENT CADUC";
                page.drawText(warning, {
                    x: (width - fontRegular.widthOfTextAtSize(warning, 7)) / 2,
                    y: 50, size: 7, font: fontRegular, color: rgb(0.7, 0.7, 0.7)
                });

            } else {
                // --- MODE VALIDATION PRO (QR Codes) ---
                const workshopTitle = item.workshop.title.toUpperCase();
                page.drawText("JUSTIFICATIF À ACTIVER", {
                    x: (width - fontRegular.widthOfTextAtSize("JUSTIFICATIF À ACTIVER", 10)) / 2,
                    y: height - 180, size: 10, font: fontRegular, color: gold
                });
                page.drawText(workshopTitle, {
                    x: (width - fontBold.widthOfTextAtSize(workshopTitle, 22)) / 2,
                    y: height - 215, size: 22, font: fontBold, color: darkGreen
                });

                const validationUrl = `${process.env.FRONTEND_URL}/validate/${p.id}`;
                const qrDataUrl = await QRCode.toDataURL(validationUrl, {
                    margin: 1, width: 200, color: { dark: '#0a1a14', light: '#ffffff' }
                });
                const qrImage = await pdfDoc.embedPng(Buffer.from(qrDataUrl.split(',')[1], 'base64'));

                page.drawImage(qrImage, { x: (width - 160) / 2, y: 340, width: 160, height: 160 });

                const instructions = "PROTOCOLE : SCANNEZ CE CODE POUR VOUS ENREGISTRER";
                page.drawRectangle({
                    x: (width - 440) / 2, y: 150, width: 440, height: 50,
                    borderColor: softRed, borderWidth: 1.5, color: rgb(1, 0.98, 0.98)
                });
                page.drawText(instructions, {
                    x: (width - fontBold.widthOfTextAtSize(instructions, 11)) / 2,
                    y: 172, size: 11, font: fontBold, color: softRed
                });

                const footer = "TOUTE SÉANCE NON RÉSERVÉE AVANT ÉCHÉANCE SERA DÉFINITIVEMENT CADUC";
                page.drawText(footer, {
                    x: (width - fontRegular.widthOfTextAtSize(footer, 7)) / 2,
                    y: 50, size: 7, font: fontRegular, color: rgb(0.6, 0.6, 0.6)
                });
            }
        }
    }

    // --- 🏺 BLOC DE RETRAIT BOUTIQUE (Priorité Institutionnelle Absolue) ---
    const bottles = order.items.filter((i: any) => i.volumeId);

    if (bottles.length > 0) {
        const bPage = pdfDoc.addPage([595.28, 842.89]);
        const { width, height } = bPage.getSize();

        // Bordure Institutionnelle Or
        bPage.drawRectangle({
            x: 20, y: 20, width: width - 40, height: height - 40,
            borderColor: gold, borderWidth: 0.5
        });

        // Entête et Logo
        bPage.drawText(`RÉFÉRENCE COMMANDE : ${order.reference}`, {
            x: 50, y: height - 50, size: 8, font: fontBold, color: black
        });

        if (logoImage) {
            const logoHeight = 60;
            const logoWidth = (logoImage.width / logoImage.height) * logoHeight;
            bPage.drawImage(logoImage, {
                x: (width - logoWidth) / 2, y: height - 140, width: logoWidth, height: logoHeight
            });
        }

        const docTitle = "BON DE RETRAIT BOUTIQUE";
        bPage.drawText("ACHAT DE BOUTEILLES", {
            x: (width - fontRegular.widthOfTextAtSize("ACHAT DE BOUTEILLES", 10)) / 2,
            y: height - 180, size: 10, font: fontRegular, color: gold
        });
        bPage.drawText(docTitle, {
            x: (width - fontBold.widthOfTextAtSize(docTitle, 24)) / 2,
            y: height - 215, size: 24, font: fontBold, color: darkGreen
        });

        /** * 🏺 RÉSOLUTION DÉFINITIVE DU BUG "CE" :
         * On vérifie d'abord si un nom d'entreprise existe au Registre.
         * Si oui, on affiche UNIQUEMENT le companyName pour court-circuiter le firstName ("CE").
         */
        const ownerName = order.user.companyName
            ? order.user.companyName.toUpperCase()
            : `${order.user.firstName} ${order.user.lastName}`.toUpperCase();

        bPage.drawText(ownerName, {
            x: (width - fontBold.widthOfTextAtSize(ownerName, 22)) / 2,
            y: height - 320, size: 22, font: fontBold, color: black
        });

        const ownerContact = `${order.user.email}  •  ${order.user.phone || 'SANS TÉLÉPHONE'}`;
        bPage.drawText(ownerContact, {
            x: (width - fontRegular.widthOfTextAtSize(ownerContact, 10)) / 2,
            y: height - 345, size: 10, font: fontRegular, color: rgb(0.4, 0.4, 0.4)
        });

        // Liste des Produits Boutique
        let productY = height - 420;
        bPage.drawText("RÉFÉRENCES À RETIRER :", {
            x: 70, y: productY, size: 9, font: fontBold, color: gold
        });

        productY -= 30;
        bottles.forEach((item: any) => {
            const productName = item.volume?.product?.name || "Flacon";
            const productSize = item.volume ? ` (${item.volume.size}${item.volume.unit})` : "";
            const productLabel = `- ${productName}${productSize}`;
            const qtyLabel = `x ${item.quantity}`;

            bPage.drawText(productLabel, { x: 70, y: productY, size: 11, font: fontBold });
            bPage.drawText(qtyLabel, { x: 450, y: productY, size: 11, font: fontBold, color: darkGreen });
            productY -= 25;
        });

        // Bloc Protocole de Retrait
        const boxW = 440; const boxH = 50;
        bPage.drawRectangle({
            x: (width - boxW) / 2, y: 120, width: boxW, height: boxH,
            borderColor: gold, borderWidth: 1, color: rgb(0.98, 0.98, 0.96)
        });

        const instructions = "RETRAIT DISPONIBLE À L'ÉTABLISSEMENT";
        bPage.drawText(instructions, {
            x: (width - fontBold.widthOfTextAtSize(instructions, 10)) / 2,
            y: 140, size: 10, font: fontBold, color: black
        });

        const disclaimer = "PRÉSENTATION DE CE BON ET D'UNE PIÈCE D'IDENTITÉ OBLIGATOIRE";
        bPage.drawText(disclaimer, {
            x: (width - fontRegular.widthOfTextAtSize(disclaimer, 7)) / 2,
            y: 50, size: 7, font: fontRegular, color: rgb(0.6, 0.6, 0.6)
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