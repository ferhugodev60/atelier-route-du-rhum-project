import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client';
import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';

interface AuthRequest extends Request {
    user?: { userId: string; role: string; };
}

type OrderWithRelations = Prisma.OrderGetPayload<{
    include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true, memberCode: true, companyName: true, siret: true } },
        items: {
            include: {
                workshop: true,
                volume: { include: { product: true } },
                participants: true,
                companyGroup: true // 🏺 Suivi de la cohorte pro
            };
        };
    };
}>;

export const getOrders = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    const isAdmin = req.user?.role === 'ADMIN';
    if (!userId) return res.status(401).json({ error: "Session non identifiée." });
    try {
        const rawOrders = await prisma.order.findMany({
            where: isAdmin ? {} : { userId },
            include: {
                user: { select: { firstName: true, lastName: true, email: true, memberCode: true, companyName: true } },
                items: { include: { workshop: true, volume: { include: { product: true } }, participants: true, companyGroup: true } }
            },
            orderBy: { createdAt: 'desc' }
        }) as OrderWithRelations[];
        const formattedOrders = rawOrders.map(order => ({
            id: order.id,
            reference: order.reference,
            createdAt: order.createdAt,
            total: order.total,
            status: order.status,
            user: order.user,
            isBusiness: order.isBusiness,
            items: order.items.map(item => ({
                name: item.workshop ? `Séance : ${item.workshop.title}` : `${item.volume?.product.name} (${item.volume?.size}${item.volume?.unit})`,
                quantity: item.quantity,
                price: item.price,
                groupName: item.companyGroup?.name || null,
                participants: item.participants.map(p => p.memberCode ? `${p.firstName} ${p.lastName} (${p.memberCode})` : `${p.firstName} ${p.lastName}`)
            }))
        }));
        res.status(200).json(formattedOrders);
    } catch (error) { res.status(500).json({ error: "Erreur de registre." }); }
};

export const getOrderDetails = async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string;
    const userId = req.user?.userId;
    const isAdmin = req.user?.role === 'ADMIN';
    try {
        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                user: true,
                items: { include: { workshop: true, volume: { include: { product: true } }, participants: true, companyGroup: true } }
            }
        }) as OrderWithRelations | null;
        if (!order) return res.status(404).json({ error: "Document introuvable." });
        if (!isAdmin && order.userId !== userId) return res.status(403).json({ error: "Accès non autorisé." });
        res.json(order);
    } catch (error) { res.status(500).json({ error: "Erreur d'extraction." }); }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string;
    const { status } = req.body;
    try {
        const order = await prisma.order.update({
            where: { id },
            data: { status },
            include: { items: { include: { workshop: true, participants: true } } }
        });

        if (status === 'FINALISÉ') {
            // 🏺 1. Promotion individuelle (Particuliers)
            const individualCodes = order.items
                .filter(item => item.workshop !== null && !order.isBusiness)
                .flatMap(item => item.participants.map(p => p.memberCode))
                .filter((code): code is string => !!code);

            if (individualCodes.length > 0) {
                const uniqueCodes = [...new Set(individualCodes)];
                await Promise.all(uniqueCodes.map(code =>
                    prisma.user.update({ where: { memberCode: code }, data: { conceptionLevel: { increment: 1 } } })
                ));
            }

            // 🏺 2. Promotion de Cohorte (Entreprises)
            const businessItems = order.items.filter(item => item.workshop !== null && order.isBusiness && item.companyGroupId);
            if (businessItems.length > 0) {
                await Promise.all(businessItems.map(item =>
                    prisma.companyGroup.update({
                        where: { id: item.companyGroupId! },
                        data: { currentLevel: { increment: 1 } }
                    })
                ));
            }
        }
        res.json(order);
    } catch (error) { res.status(400).json({ error: "Échec logistique." }); }
};

/**
 * 🏺 Génération du Certificat / Carte Cadeau
 * Adaptation du rendu pour les Cohortes Professionnelles de 25 membres.
 */
export const downloadOrderPDF = async (req: AuthRequest, res: Response) => {
    const orderId = req.params.orderId as string;
    const userId = req.user?.userId;

    try {
        const order = await prisma.order.findFirst({
            where: { id: orderId, userId: userId },
            include: {
                user: true,
                items: { include: { workshop: true, volume: { include: { product: true } }, participants: true, companyGroup: true } }
            }
        }) as OrderWithRelations | null;

        if (!order) return res.status(404).json({ error: "Dossier introuvable." });

        const doc = new PDFDocument({ size: 'A4', margin: 0 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Certificat_${order.reference}.pdf`);
        doc.pipe(res);

        const pageWidth = doc.page.width;
        const margin = 50;
        const contentWidth = pageWidth - (margin * 2);
        const logoPath = path.join(process.cwd(), 'public', 'assets', 'logo.jpg');
        const fileExists = fs.existsSync(logoPath);

        const drawHeaderInfo = (title?: string) => {
            const topY = 40;
            doc.fontSize(8).font('Helvetica').fillColor('#999999');
            doc.text(`Émis le : ${new Date(order.createdAt).toLocaleDateString('fr-FR')}`, margin, topY);
            if (title) doc.text(`${title.toUpperCase()}`, margin, topY, { width: contentWidth, align: 'right' });
        };

        const drawFooter = () => {
            doc.fontSize(10).font('Helvetica-Bold').fillColor('#FF0000')
                .text("POUR TOUTE DATE DE VALIDITÉ DÉPASSÉE LA CARTE CADEAU SERA CADUC.", margin, 780, { width: contentWidth, align: 'center' });
        };

        const workshopItems = order.items.filter(i => i.workshop);
        const bottleItems = order.items.filter(i => i.volume);

        workshopItems.forEach((item, index) => {
            if (index > 0) doc.addPage();
            drawHeaderInfo(item.workshop?.title);
            if (fileExists) { doc.image(logoPath, (pageWidth - 140) / 2, 85, { width: 140 }); }
            doc.y = 190;

            const isConception = (item.workshop?.level ?? 0) > 0;
            const validityLabel = isConception ? "6 mois" : "30 jours";
            const expiryDate = new Date(order.createdAt);
            expiryDate.setDate(expiryDate.getDate() + (isConception ? 180 : 30));

            doc.moveTo(margin + 50, doc.y).lineTo(pageWidth - margin - 50, doc.y).strokeColor('#D4AF37').lineWidth(1.5).stroke();
            doc.moveDown(2);

            // 🏺 Titre adapté au type de client
            const mainTitle = "BON POUR UN ATELIER";
            doc.fontSize(20).font('Helvetica-Bold').fillColor('#D4AF37').text(mainTitle, margin, doc.y, { width: contentWidth, align: 'center' });

            doc.moveDown(1.5);
            doc.fontSize(11).font('Helvetica').fillColor('#000000').text(`Ce certificat certifie un accès privilégié à la séance pour une durée de ${validityLabel}.`, margin, doc.y, { width: contentWidth, align: 'center' });
            doc.moveDown(1);
            doc.fontSize(15).font('Helvetica-Bold').text(`VALABLE JUSQU'AU : ${expiryDate.toLocaleDateString('fr-FR')}`, margin, doc.y, { width: contentWidth, align: 'center' });
            doc.moveDown(2);
            doc.moveTo(margin + 50, doc.y).lineTo(pageWidth - margin - 50, doc.y).strokeColor('#D4AF37').stroke();

            doc.moveDown(4);

            // 🏺 Affichage de la Cohorte si Pro
            if (order.isBusiness && item.companyGroup) {
                doc.fontSize(12).font('Helvetica-Bold').fillColor('#D4AF37').text(`COHORTE CERTIFIÉE : ${item.companyGroup.name.toUpperCase()}`, margin, doc.y);
                doc.moveDown(1);
            } else {
                doc.fontSize(11).font('Helvetica-Bold').fillColor('#D4AF37').text("PARTICIPANTS :", margin, doc.y, { underline: true });
                doc.moveDown(1);
            }

            doc.fillColor('#000000');
            item.participants.forEach((p, idx) => {
                const name = [p.firstName, p.lastName].filter(Boolean).join(' ');
                const code = p.memberCode ? ` [Code client : ${p.memberCode}]` : "";
                doc.fontSize(9).font('Helvetica-Bold').text(`${idx + 1}. ${name}${code}`, margin + 15);

                if (p.phone || p.email) {
                    const contacts = [p.phone, p.email].filter(Boolean).join('  |  ');
                    doc.fontSize(8).font('Helvetica-Oblique').fillColor('#666666').text(contacts, margin + 30);
                    doc.fillColor('#000000');
                }
                doc.moveDown(0.5);
            });
            drawFooter();
        });

        if (bottleItems.length > 0) {
            doc.addPage();
            drawHeaderInfo("Dotations & Bouteilles");
            if (fileExists) { doc.image(logoPath, (pageWidth - 140) / 2, 85, { width: 140 }); }
            doc.y = 190;
            doc.moveTo(margin + 50, doc.y).lineTo(pageWidth - margin - 50, doc.y).strokeColor('#D4AF37').lineWidth(1.5).stroke();
            doc.moveDown(2.5);
            doc.fontSize(22).font('Helvetica-Bold').fillColor('#D4AF37').text("BON DE RETRAIT DES BOUTEILLES", margin, doc.y, { width: contentWidth, align: 'center' });
            doc.moveDown(2);
            doc.moveTo(margin + 50, doc.y).lineTo(pageWidth - margin - 50, doc.y).strokeColor('#D4AF37').stroke();

            doc.moveDown(4);
            doc.fontSize(11).font('Helvetica-Bold').fillColor('#D4AF37').text("ACHETEUR :", margin, doc.y, { underline: true });
            doc.moveDown(0.5);
            doc.fillColor('#000000');

            // 🏺 Affichage de l'entité pro si applicable
            const buyerIdentity = order.isBusiness ? `${order.user.companyName} (Réf: ${order.user.lastName})` : `${order.user.firstName} ${order.user.lastName}`;
            doc.fontSize(10).font('Helvetica-Bold').text(buyerIdentity, margin + 15);

            const buyerContacts = [];
            if (order.user.phone) buyerContacts.push(`Tél : ${order.user.phone}`);
            if (order.user.email) buyerContacts.push(`E-mail : ${order.user.email}`);
            if (buyerContacts.length > 0) {
                doc.fontSize(9).font('Helvetica-Oblique').fillColor('#666666').text(buyerContacts.join('  |  '), margin + 15);
                doc.fillColor('#000000');
            }

            doc.moveDown(3);
            doc.fontSize(11).font('Helvetica-Bold').fillColor('#D4AF37').text("BOUTEILLES RÉSERVÉES :", margin, doc.y, { underline: true });
            doc.moveDown(0.5);
            bottleItems.forEach(p => {
                doc.fontSize(10).text(`• ${p.volume?.product.name} (${p.volume?.size}${p.volume?.unit}) — Quantité : ${p.quantity}`, margin + 15);
            });
            drawFooter();
        }
        doc.end();
    } catch (error) { res.status(500).json({ error: "Échec technique." }); }
};

export const createOrder = async (req: AuthRequest, res: Response) => { /* Géré par Webhook */ };