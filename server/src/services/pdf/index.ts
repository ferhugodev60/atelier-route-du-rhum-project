import { PDFDocument } from 'pdf-lib';
import { PAGE_SIZE } from './constants';
import { getSharedAssets } from './baseLayout';
import { renderParticipantPage } from './generators/certification';
import { renderGiftCardPageContent } from './generators/giftCard';
import { renderBoutiquePageContent } from './generators/boutique';

export const generateOrderPDF = async (order: any) => {
    console.log(`🏺 [PDF_INDEX] Début génération pour commande : ${order.reference}`);
    const pdfDoc = await PDFDocument.create();

    console.log("🏺 [PDF_INDEX] Chargement des assets partagés...");
    const { fontBold, fontRegular, logoImage } = await getSharedAssets(pdfDoc);
    console.log(`🏺 [PDF_INDEX] Assets : FontBold=${!!fontBold}, FontRegular=${!!fontRegular}, Logo=${!!logoImage}`);

    for (const item of order.items) {
        console.log(`🏺 [PDF_INDEX] Traitement Item : groupNames=${item.groupNames}, workshop=${!!item.workshop}`);

        if (item.workshop) {
            const participants = item.participants || [];
            console.log(`   ➡️ Workshop détecté : ${item.workshop.title} (${participants.length} participants)`);
            for (const p of participants) {
                const isConfigured = (p.firstName && p.lastName);
                if (order.isBusiness && isConfigured) continue;

                const page = pdfDoc.addPage(PAGE_SIZE);
                await renderParticipantPage(page, item, p, order, logoImage, fontBold, fontRegular);
            }
        }
        else if (item.groupNames === 'GIFT_CARD') {
            console.log(`   ➡️ GIFT_CARD détectée. Création d'une page...`);
            const page = pdfDoc.addPage(PAGE_SIZE);
            await renderGiftCardPageContent(page, item, order.reference, logoImage, fontBold, fontRegular);
        }
    }

    const bottles = order.items.filter((i: any) => i.volumeId);
    if (bottles.length > 0) {
        console.log(`   ➡️ Boutique détectée : ${bottles.length} flacons. Création d'une page...`);
        const bPage = pdfDoc.addPage(PAGE_SIZE);
        renderBoutiquePageContent(bPage, order, bottles, logoImage, fontBold, fontRegular);
    }

    console.log("🏺 [PDF_INDEX] Finalisation et sauvegarde du document...");
    const bytes = await pdfDoc.save();
    console.log(`🏺 [PDF_INDEX] PDF généré avec succès (${bytes.length} octets)`);
    return bytes;
};

export { generateGiftCardPDF } from './generators/giftCard';
export { generateCertificationPDF } from './generators/certification';