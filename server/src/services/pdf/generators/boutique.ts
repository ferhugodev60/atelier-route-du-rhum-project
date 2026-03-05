import { rgb } from 'pdf-lib';
import { COLORS } from '../constants';
import { drawBaseFrame } from '../baseLayout';

/**
 * 🏺 RENDU DE LA PAGE BOUTIQUE (Pour generateOrderPDF)
 * Gère le bon de retrait des flacons avec priorité institutionnelle.
 */
export const renderBoutiquePageContent = (page: any, order: any, bottles: any[], logoImage: any, fontBold: any, fontRegular: any) => {
    const { width, height } = page.getSize();

    // 1. Sceau de base (Bordure, Logo, Référence)
    // Utilise la référence spécifique "COMMANDE" comme dans votre original
    drawBaseFrame(page, order.reference, logoImage, fontBold);

    // 2. Titres du document
    const subHeader = "ACHAT DE BOUTEILLES";
    page.drawText(subHeader, {
        x: (width - fontRegular.widthOfTextAtSize(subHeader, 10)) / 2,
        y: height - 180, size: 10, font: fontRegular, color: COLORS.GOLD
    });

    const docTitle = "BON DE RETRAIT BOUTIQUE";
    page.drawText(docTitle, {
        x: (width - fontBold.widthOfTextAtSize(docTitle, 24)) / 2,
        y: height - 215, size: 24, font: fontBold, color: COLORS.DARK_GREEN
    });

    // 3. 🏺 RÉSOLUTION DU BUG "CE" (Logique originale scellée)
    // On priorise le companyName pour éviter l'affichage de "CE" si le compte est pro.
    const ownerName = order.user.companyName
        ? order.user.companyName.toUpperCase()
        : `${order.user.firstName} ${order.user.lastName}`.toUpperCase();

    page.drawText(ownerName, {
        x: (width - fontBold.widthOfTextAtSize(ownerName, 22)) / 2,
        y: height - 320, size: 22, font: fontBold, color: COLORS.BLACK
    });

    const ownerContact = `${order.user.email}  •  ${order.user.phone || 'SANS TÉLÉPHONE'}`;
    page.drawText(ownerContact, {
        x: (width - fontRegular.widthOfTextAtSize(ownerContact, 10)) / 2,
        y: height - 345, size: 10, font: fontRegular, color: COLORS.GREY
    });

    // 4. Liste des Produits Boutique (Rendu dynamique)
    let productY = height - 420;
    page.drawText("RÉFÉRENCES À RETIRER :", {
        x: 70, y: productY, size: 9, font: fontBold, color: COLORS.GOLD
    });

    productY -= 30;
    bottles.forEach((item: any) => {
        // Extraction sécurisée des données de volume
        const productName = item.volume?.product?.name || "Flacon";
        const productSize = item.volume ? ` (${item.volume.size}${item.volume.unit})` : "";
        const productLabel = `- ${productName}${productSize}`;
        const qtyLabel = `x ${item.quantity}`;

        page.drawText(productLabel, { x: 70, y: productY, size: 11, font: fontBold, color: COLORS.BLACK });
        page.drawText(qtyLabel, { x: 450, y: productY, size: 11, font: fontBold, color: COLORS.DARK_GREEN });

        productY -= 25; // Espacement vertical original
    });

    // 5. Bloc Protocole de Retrait (Encadré institutionnel)
    const boxW = 440; const boxH = 50;
    page.drawRectangle({
        x: (width - boxW) / 2, y: 120, width: boxW, height: boxH,
        borderColor: COLORS.GOLD, borderWidth: 1, color: rgb(0.98, 0.98, 0.96)
    });

    const instructions = "RETRAIT DISPONIBLE À L'ÉTABLISSEMENT";
    page.drawText(instructions, {
        x: (width - fontBold.widthOfTextAtSize(instructions, 10)) / 2,
        y: 140, size: 10, font: fontBold, color: COLORS.BLACK
    });

    // 6. Mention Légale de Pied de Page
    const disclaimer = "PRÉSENTATION DE CE BON ET D'UNE PIÈCE D'IDENTITÉ OBLIGATOIRE";
    page.drawText(disclaimer, {
        x: (width - fontRegular.widthOfTextAtSize(disclaimer, 7)) / 2,
        y: 50, size: 7, font: fontRegular, color: rgb(0.6, 0.6, 0.6)
    });
};