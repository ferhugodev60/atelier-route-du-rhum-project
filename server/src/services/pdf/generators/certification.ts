import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';
import path from 'path';
import fs from 'fs';
import { COLORS } from '../constants';
import { drawBaseFrame } from '../baseLayout';

/**
 * 🏺 RENDU D'UNE PAGE PARTICIPANT (Pour generateOrderPDF)
 * Intègre la logique hybride : Certificat nominatif ou QR d'activation.
 */
export const renderParticipantPage = async (page: any, item: any, p: any, order: any, logo: any, fontBold: any, fontRegular: any) => {
    const { width, height } = page.getSize();
    const isConfigured = (p.firstName && p.lastName);
    const isIndividual = isConfigured || p.isValidated;

    // Sceau de base (Bordure, Logo, Référence)
    drawBaseFrame(page, order.reference, logo, fontBold);

    if (isIndividual) {
        // --- 🏺 MODE CERTIFICAT D'ADMISSION (Particulier / CE) ---
        const workshopTitle = item.workshop.title.toUpperCase();

        page.drawText("BON POUR UNE SÉANCE", {
            x: (width - fontRegular.widthOfTextAtSize("BON POUR UNE SÉANCE", 10)) / 2,
            y: height - 180, size: 10, font: fontRegular, color: COLORS.GOLD
        });

        page.drawText(workshopTitle, {
            x: (width - fontBold.widthOfTextAtSize(workshopTitle, 24)) / 2,
            y: height - 215, size: 24, font: fontBold, color: COLORS.DARK_GREEN
        });

        // Identité et Coordonnées
        const nameText = `${p.firstName} ${p.lastName}`.toUpperCase();
        page.drawText(nameText, {
            x: (width - fontBold.widthOfTextAtSize(nameText, 28)) / 2,
            y: height - 340, size: 28, font: fontBold, color: COLORS.BLACK
        });

        const contactInfo = `${p.email}  •  ${p.phone || 'SANS TÉLÉPHONE'}`;
        page.drawText(contactInfo, {
            x: (width - fontRegular.widthOfTextAtSize(contactInfo, 10)) / 2,
            y: height - 365, size: 10, font: fontRegular, color: COLORS.GREY
        });

        // Spécificité Cursus Conception
        if (item.workshop.level > 0 && p.memberCode) {
            const codeText = `CODE PASSEPORT : ${p.memberCode.toUpperCase()}`;
            page.drawText(codeText, {
                x: (width - fontBold.widthOfTextAtSize(codeText, 11)) / 2,
                y: height - 390, size: 11, font: fontBold, color: COLORS.GOLD
            });
        }

        // Période de Validité (Logique de scellage temporelle)
        const isConception = item.workshop.level > 0;
        const dateFin = new Date(order.createdAt);
        if (isConception) {
            dateFin.setMonth(dateFin.getMonth() + 6);
        } else {
            dateFin.setDate(dateFin.getDate() + 30);
        }

        const validityLabel = `VALIDITÉ : ${isConception ? "6 MOIS" : "30 JOURS"}`;
        page.drawText(validityLabel, {
            x: (width - fontBold.widthOfTextAtSize(validityLabel, 12)) / 2,
            y: height - 480, size: 12, font: fontBold, color: COLORS.BLACK
        });

        page.drawText(`ÉCHÉANCE AU ${dateFin.toLocaleDateString('fr-FR')}`, {
            x: (width - fontRegular.widthOfTextAtSize(`ÉCHÉANCE AU ${dateFin.toLocaleDateString('fr-FR')}`, 11)) / 2,
            y: height - 500, size: 11, font: fontRegular, color: COLORS.BLACK
        });

        // Bloc de réservation institutionnel
        page.drawRectangle({
            x: (width - 440) / 2, y: height - 600, width: 440, height: 50,
            borderColor: COLORS.SOFT_RED, borderWidth: 1.5, color: rgb(1, 0.98, 0.98)
        });

        const actionT = "RÉSERVEZ VOTRE SÉANCE AU 06 41 42 00 28";
        page.drawText(actionT, {
            x: (width - fontBold.widthOfTextAtSize(actionT, 11)) / 2,
            y: height - 580, size: 11, font: fontBold, color: COLORS.SOFT_RED
        });

        const warning = "TOUTE SÉANCE NON RÉSERVÉE AVANT ÉCHÉANCE SERA DÉFINITIVEMENT CADUC";
        page.drawText(warning, {
            x: (width - fontRegular.widthOfTextAtSize(warning, 7)) / 2,
            y: 50, size: 7, font: fontRegular, color: COLORS.LIGHT_GREY
        });

    } else {
        // --- 🏺 MODE VALIDATION PRO (QR Codes) ---
        const workshopTitle = item.workshop.title.toUpperCase();

        page.drawText("JUSTIFICATIF À ACTIVER", {
            x: (width - fontRegular.widthOfTextAtSize("JUSTIFICATIF À ACTIVER", 10)) / 2,
            y: height - 180, size: 10, font: fontRegular, color: COLORS.GOLD
        });

        page.drawText(workshopTitle, {
            x: (width - fontBold.widthOfTextAtSize(workshopTitle, 22)) / 2,
            y: height - 215, size: 22, font: fontBold, color: COLORS.DARK_GREEN
        });

        const validationUrl = `${process.env.FRONTEND_URL}/validate/${p.id}`;
        const qrDataUrl = await QRCode.toDataURL(validationUrl, {
            margin: 1, width: 200, color: { dark: '#0a1a14', light: '#ffffff' }
        });
        const qrImage = await page.doc.embedPng(Buffer.from(qrDataUrl.split(',')[1], 'base64'));

        page.drawImage(qrImage, {
            x: (width - 160) / 2, y: 340, width: 160, height: 160
        });

        const instructions = "PROTOCOLE : SCANNEZ CE CODE POUR VOUS ENREGISTRER";
        page.drawRectangle({
            x: (width - 440) / 2, y: 150, width: 440, height: 50,
            borderColor: COLORS.SOFT_RED, borderWidth: 1.5, color: rgb(1, 0.98, 0.98)
        });

        page.drawText(instructions, {
            x: (width - fontBold.widthOfTextAtSize(instructions, 11)) / 2,
            y: 172, size: 11, font: fontBold, color: COLORS.SOFT_RED
        });

        const footer = "TOUTE SÉANCE NON RÉSERVÉE AVANT ÉCHÉANCE SERA DÉFINITIVEMENT CADUC";
        page.drawText(footer, {
            x: (width - fontRegular.widthOfTextAtSize(footer, 7)) / 2,
            y: 50, size: 7, font: fontRegular, color: rgb(0.6, 0.6, 0.6)
        });
    }
};

/**
 * 📜 GÉNÉRATEUR DU CERTIFICAT INDIVIDUEL (Format exporté autonome)
 */
export const generateCertificationPDF = async (participant: any) => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 842.89]);
    const { width, height } = page.getSize();

    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

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
        dateFin.setMonth(dateFin.getMonth() + 6);
    } else {
        dateFin.setDate(dateFin.getDate() + 30);
    }

    const formatDate = (date: Date) => date.toLocaleDateString('fr-FR');
    const validityPeriod = isConception ? "6 MOIS" : "30 JOURS";

    // 🏺 DESIGN GLOBAL
    page.drawRectangle({ x: 0, y: 0, width, height, color: rgb(1, 1, 1) });
    page.drawRectangle({ x: 20, y: 20, width: width - 40, height: height - 40, borderColor: COLORS.GOLD, borderWidth: 0.5 });

    // 🏺 1. BLOC ADMINISTRATIF
    const adminX = 50;
    const adminY = height - 50;
    page.drawText(`DATE D'ÉMISSION : ${formatDate(dateGeneration)}`, { x: adminX, y: adminY, size: 8, font: fontRegular, color: rgb(0.5, 0.5, 0.5) });
    page.drawText(`DOSSIER : ${orderRef}`, { x: adminX, y: adminY - 12, size: 8, font: fontBold, color: COLORS.BLACK });
    page.drawText(`ENTREPRISE : ${companyName.toUpperCase()}`, { x: adminX, y: adminY - 24, size: 8, font: fontBold, color: COLORS.BLACK });

    // 🏺 2. LOGO INSTITUTIONNEL
    const logoPath = path.join(process.cwd(), 'public', 'assets', 'logo.jpg');
    if (fs.existsSync(logoPath)) {
        const logoBytes = fs.readFileSync(logoPath);
        const logoImage = await pdfDoc.embedJpg(logoBytes);
        const logoHeight = 70;
        const logoWidth = (logoImage.width / logoImage.height) * logoHeight;
        page.drawImage(logoImage, { x: (width - logoWidth) / 2, y: height - 160, width: logoWidth, height: logoHeight });
    }

    // 🏺 3. TITRE DE LA SÉANCE
    page.drawText("BON POUR UNE SÉANCE", { x: (width - fontRegular.widthOfTextAtSize("BON POUR UNE SÉANCE", 10)) / 2, y: height - 195, size: 10, font: fontRegular, color: COLORS.GOLD });
    page.drawText(workshopTitle, { x: (width - fontBold.widthOfTextAtSize(workshopTitle, 28)) / 2, y: height - 235, size: 28, font: fontBold, color: COLORS.DARK_GREEN });

    // 🏺 4. IDENTITÉ DU MEMBRE
    const nameText = `${participant.firstName} ${participant.lastName}`.toUpperCase();
    page.drawText(nameText, { x: (width - fontBold.widthOfTextAtSize(nameText, 32)) / 2, y: height - 370, size: 32, font: fontBold, color: COLORS.BLACK });

    const contactInfo = `${participant.email}   •   ${participant.phone || 'SANS TÉLÉPHONE'}`;
    page.drawText(contactInfo, { x: (width - fontRegular.widthOfTextAtSize(contactInfo, 11)) / 2, y: height - 410, size: 11, font: fontRegular, color: COLORS.GREY });

    // 🏺 5. BLOC DE VALIDITÉ
    const validityY = height - 490;
    page.drawText(`VALABLE : ${validityPeriod}`, { x: (width - fontBold.widthOfTextAtSize(`VALABLE : ${validityPeriod}`, 14)) / 2, y: validityY, size: 14, font: fontBold, color: COLORS.BLACK });
    page.drawText(`DU ${formatDate(dateGeneration)} AU ${formatDate(dateFin)}`, { x: (width - fontRegular.widthOfTextAtSize(`DU ${formatDate(dateGeneration)} AU ${formatDate(dateFin)}`, 12)) / 2, y: validityY - 25, size: 12, font: fontRegular, color: COLORS.BLACK });

    // 🏺 6. APPEL À L'ACTION
    const boxW = 460; const boxH = 55;
    const boxY = validityY - 110;
    page.drawRectangle({ x: (width - boxW) / 2, y: boxY, width: boxW, height: boxH, borderColor: COLORS.SOFT_RED, borderWidth: 1.5, color: rgb(1, 0.98, 0.98) });
    page.drawText("PROCHAINE ÉTAPE : RÉSERVEZ VOTRE SÉANCE AU 06 41 42 00 28", { x: (width - fontBold.widthOfTextAtSize("PROCHAINE ÉTAPE : RÉSERVEZ VOTRE SÉANCE AU 06 41 42 00 28", 11)) / 2, y: boxY + 22, size: 11, font: fontBold, color: COLORS.SOFT_RED });

    // 🏺 7. MENTION DE CADUCITÉ
    page.drawText("POUR TOUTE DATE DE VALIDITÉ DÉPASSÉE OU D'ABSENCE, LA CARTE CADEAU SERA CADUC", { x: (width - fontRegular.widthOfTextAtSize("POUR TOUTE DATE DE VALIDITÉ DÉPASSÉE OU D'ABSENCE, LA CARTE CADEAU SERA CADUC", 8)) / 2, y: 50, size: 8, font: fontRegular, color: COLORS.LIGHT_GREY });

    return await pdfDoc.save();
};