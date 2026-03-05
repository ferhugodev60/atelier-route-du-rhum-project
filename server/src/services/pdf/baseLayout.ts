// server/src/services/pdf/baseLayout.ts
import { StandardFonts, rgb } from 'pdf-lib';
import path from 'path';
import fs from 'fs';
import { COLORS } from './constants';

export const getSharedAssets = async (pdfDoc: any) => {
    // 🏺 Scellage des polices et du logo
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const logoPath = path.join(process.cwd(), 'public', 'assets', 'logo.jpg');

    let logoImage = null;
    if (fs.existsSync(logoPath)) {
        logoImage = await pdfDoc.embedJpg(fs.readFileSync(logoPath));
    }
    return { fontBold, fontRegular, logoImage };
};

export const drawBaseFrame = (page: any, ref: string, logoImage: any, fontBold: any, label: string = "DOSSIER") => {
    const { width, height } = page.getSize();

    // 🏺 1. NETTOYAGE DE LA PAGE (Fond Blanc forcé)
    page.drawRectangle({ x: 0, y: 0, width, height, color: rgb(1, 1, 1) });

    // 2. Bordure Or
    page.drawRectangle({
        x: 20, y: 20, width: width - 40, height: height - 40,
        borderColor: COLORS.GOLD, borderWidth: 0.5
    });

    // 3. Référence (Noir pur explicite)
    page.drawText(`RÉFÉRENCE ${label} : ${ref}`, {
        x: 50, y: height - 50, size: 8, font: fontBold, color: rgb(0, 0, 0)
    });

    // 4. Logo
    if (logoImage) {
        const logoHeight = 60;
        const logoWidth = (logoImage.width / logoImage.height) * logoHeight;
        page.drawImage(logoImage, {
            x: (width - logoWidth) / 2, y: height - 140, width: logoWidth, height: logoHeight
        });
    }
};