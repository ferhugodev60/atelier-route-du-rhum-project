import { rgb } from 'pdf-lib';
import { COLORS, PAGE_SIZE } from '../constants';
import { drawBaseFrame, getSharedAssets } from '../baseLayout';
import { prisma } from '../../../lib/prisma'; // 🏺 Import indispensable pour le scellage de secours
import { PDFDocument } from 'pdf-lib';

/**
 * 🏺 RENDU D'UNE PAGE CARTE CADEAU (Registre Global)
 * Procédure asynchrone pour garantir l'extraction du code RHUM-.
 */
export const renderGiftCardPageContent = async (
    page: any,
    item: any,
    orderRef: string,
    logoImage: any,
    fontBold: any,
    fontRegular: any
) => {
    const { width, height } = page.getSize();

    console.log(`🏺 [PDF_EXTRACT] --- DÉBUT EXTRACTION CODE ---`);
    console.log(`🏺 [PDF_EXTRACT] OrderRef (Fallback) : ${orderRef}`);
    console.log(`🏺 [PDF_EXTRACT] Item Name reçu : "${item.name}"`);

    // 1. Sceau de base (Bordure et Logo)
    drawBaseFrame(page, orderRef, logoImage, fontBold);

    // 2. Titres Institutionnels
    const docTitle = "CARTE CADEAU ÉTABLISSEMENT";
    page.drawText(docTitle, {
        x: (width - fontBold.widthOfTextAtSize(docTitle, 22)) / 2,
        y: height - 210, size: 22, font: fontBold, color: COLORS.DARK_GREEN
    });

    const subTitle = "VOTRE PASSEPORT POUR LE CURSUS DE CONCEPTION";
    page.drawText(subTitle, {
        x: (width - fontRegular.widthOfTextAtSize(subTitle, 10)) / 2,
        y: height - 235, size: 10, font: fontRegular, color: COLORS.GOLD
    });

    // 3. Montant Scellé (EUR)
    const amountText = `${item.price} EUR`;
    page.drawText(amountText, {
        x: (width - fontBold.widthOfTextAtSize(amountText, 60)) / 2,
        y: height - 380, size: 60, font: fontBold, color: rgb(0, 0, 0)
    });

    // 🏺 4. IMPRESSION DU CODE DE RÉSERVATION (Le Scellage Invincible)
    let extractedCode = orderRef;

    // Tentative 1 : Extraction via le nom (Regex)
    const match = item.name?.match(/RHUM-[A-Z0-9]+/);

    if (match) {
        extractedCode = match[0];
        console.log(`✅ [PDF_EXTRACT] Code identifié via Regex : ${extractedCode}`);
    }
    // Tentative 2 : Recherche directe en base de données (Sécurité ultime)
    else {
        console.log(`⚠️ [PDF_EXTRACT] Aucun code dans le nom. Interrogation du Registre GiftCard...`);
        const dbCard = await prisma.giftCard.findFirst({
            where: {
                amount: item.price,
                status: 'ACTIF'
            },
            orderBy: { createdAt: 'desc' }
        });

        if (dbCard) {
            extractedCode = dbCard.code;
            console.log(`✅ [PDF_EXTRACT] Code récupéré en base : ${extractedCode}`);
        } else {
            console.warn(`⚠️ [PDF_EXTRACT] Échec total de détection. Usage du numéro de dossier.`);
        }
    }

    const codeLabel = "VOTRE CODE DE CARTE CADEAU :";
    page.drawText(codeLabel, {
        x: (width - fontRegular.widthOfTextAtSize(codeLabel, 12)) / 2,
        y: height - 460, size: 12, font: fontRegular, color: rgb(0.4, 0.4, 0.4)
    });

    page.drawText(extractedCode, {
        x: (width - fontBold.widthOfTextAtSize(extractedCode, 32)) / 2,
        y: height - 505, size: 32, font: fontBold, color: COLORS.DARK_GREEN
    });

    // 5. Date de Validité (12 mois après achat)
    const dateEcheance = new Date(item.createdAt || new Date());
    dateEcheance.setFullYear(dateEcheance.getFullYear() + 1);
    const dateStr = dateEcheance.toLocaleDateString('fr-FR');

    const validityText = `VALABLE 12 MOIS — JUSQU'AU ${dateStr}`;
    page.drawText(validityText, {
        x: (width - fontBold.widthOfTextAtSize(validityText, 13)) / 2,
        y: height - 580, size: 13, font: fontBold, color: rgb(0, 0, 0)
    });

    // 6. Protocole d'Usage (Encadré)
    const boxW = 460; const boxH = 60; const boxY = 160;
    page.drawRectangle({
        x: (width - boxW) / 2, y: boxY, width: boxW, height: boxH,
        borderColor: COLORS.GOLD, borderWidth: 1, color: rgb(0.98, 0.98, 0.96)
    });

    const instructions = "UTILISABLE SUR NOTRE SITE OU À L'ÉTABLISSEMENT";
    page.drawText(instructions, {
        x: (width - fontBold.widthOfTextAtSize(instructions, 11)) / 2,
        y: boxY + 25, size: 11, font: fontBold, color: rgb(0, 0, 0)
    });

    // 7. Mention de Caducité
    const warning = "TOUTE CARTE NON UTILISÉE AVANT ÉCHÉANCE SERA DÉFINITIVEMENT CADUC";
    page.drawText(warning, {
        x: (width - fontRegular.widthOfTextAtSize(warning, 8)) / 2,
        y: 60, size: 8, font: fontRegular, color: COLORS.LIGHT_GREY
    });
};

/**
 * 📜 GÉNÉRATEUR DU TITRE AUTONOME (Modèle Solo)
 */
export const generateGiftCardPDF = async (giftCard: any) => {
    try {
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage(PAGE_SIZE);
        const { fontBold, fontRegular, logoImage } = await getSharedAssets(pdfDoc);

        // On utilise la fonction de rendu unifiée avec 'await'
        await renderGiftCardPageContent(
            page,
            {
                price: giftCard.amount,
                name: `TITRE DE CURSUS : ${giftCard.code}`,
                createdAt: giftCard.createdAt
            },
            giftCard.code,
            logoImage,
            fontBold,
            fontRegular
        );

        return await pdfDoc.save();
    } catch (err: any) {
        console.error(`❌ [PDF_SOLO_CRASH] :`, err.message);
        throw err;
    }
};