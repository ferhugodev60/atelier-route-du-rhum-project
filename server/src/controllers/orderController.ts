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
        user: {
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                memberCode: true,
                companyName: true,
                siret: true,
                isEmployee: true
            }
        },
        items: {
            include: {
                workshop: true,
                volume: { include: { product: true } },
                participants: true,
                companyGroup: true
            };
        };
    };
}>;

/**
 * 🏺 Extraction du Registre des Commandes
 */
export const getOrders = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    const isAdmin = req.user?.role === 'ADMIN';

    if (!userId) {
        return res.status(401).json({ error: "Identification requise." });
    }

    try {
        const rawOrders = await prisma.order.findMany({
            where: isAdmin ? {} : { userId },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                        memberCode: true,
                        companyName: true,
                        isEmployee: true
                    }
                },
                items: {
                    include: {
                        workshop: true,
                        volume: { include: { product: true } },
                        participants: true,
                        companyGroup: true
                    }
                }
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
                name: item.workshop
                    ? `Séance : ${item.workshop.title}`
                    : `${item.volume?.product.name} (${item.volume?.size}${item.volume?.unit})`,
                quantity: item.quantity,
                price: item.price,
                groupName: item.companyGroup?.name || null,
                participants: item.participants.map(p =>
                    p.memberCode ? `${p.firstName} ${p.lastName} (${p.memberCode})` : `${p.firstName} ${p.lastName}`
                )
            }))
        }));

        res.status(200).json(formattedOrders);
    } catch (error) {
        res.status(500).json({ error: "Erreur de lecture du registre." });
    }
};

/**
 * 🏺 Détails d'un Dossier de Vente
 */
export const getOrderDetails = async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string;
    const userId = req.user?.userId;
    const isAdmin = req.user?.role === 'ADMIN';

    try {
        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                user: true,
                items: {
                    include: {
                        workshop: true,
                        volume: { include: { product: true } },
                        participants: true,
                        companyGroup: true
                    }
                }
            }
        }) as OrderWithRelations | null;

        if (!order) {
            return res.status(404).json({ error: "Document introuvable." });
        }

        if (!isAdmin && order.userId !== userId) {
            return res.status(403).json({ error: "Accès refusé." });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ error: "Erreur d'extraction." });
    }
};

/**
 * 🏺 Mise à jour du Statut et Promotion Technique
 */
export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string;
    const { status } = req.body;

    try {
        const order = await prisma.order.update({
            where: { id },
            data: { status },
            include: {
                items: {
                    include: {
                        workshop: true,
                        participants: true
                    }
                }
            }
        });

        if (status === 'FINALISÉ') {
            const individualCodes = order.items
                .filter(item => item.workshop !== null && !order.isBusiness)
                .flatMap(item => item.participants.map(p => p.memberCode))
                .filter((code): code is string => !!code);

            if (individualCodes.length > 0) {
                await Promise.all([...new Set(individualCodes)].map(code =>
                    prisma.user.update({
                        where: { memberCode: code },
                        data: { conceptionLevel: { increment: 1 } }
                    })
                ));
            }

            const businessItems = order.items.filter(item =>
                item.workshop !== null && order.isBusiness && item.companyGroupId
            );

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
    } catch (error) {
        res.status(400).json({ error: "Échec de mise à jour logistique." });
    }
};

/**
 * 🏺 Génération du Certificat / Billetterie
 */
export const downloadOrderPDF = async (req: AuthRequest, res: Response) => {
    const orderId = req.params.orderId as string;
    const userId = req.user?.userId;

    try {
        const order = await prisma.order.findFirst({
            where: { id: orderId, userId: userId },
            include: {
                user: true,
                items: {
                    include: {
                        workshop: true,
                        volume: { include: { product: true } },
                        participants: true,
                        companyGroup: true
                    }
                }
            }
        }) as OrderWithRelations | null;

        if (!order) {
            return res.status(404).json({ error: "Dossier introuvable." });
        }

        const workshopItems = order.items.filter(i => i.workshop);
        const bottleItems = order.items.filter(i => i.volume);

        if (workshopItems.length === 0 && bottleItems.length === 0) {
            return res.status(400).json({ error: "Aucun contenu certifié dans ce dossier." });
        }

        const doc = new PDFDocument({ size: 'A4', margin: 0, autoFirstPage: false });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Certificats_${order.reference}.pdf`);
        doc.pipe(res);

        const pageWidth = 595.28;
        const margin = 50;
        const contentWidth = pageWidth - (margin * 2);
        const logoPath = path.join(process.cwd(), 'public', 'assets', 'logo.jpg');
        const fileExists = fs.existsSync(logoPath);

        workshopItems.forEach((item) => {
            const isConception = (item.workshop?.level ?? 0) > 0;
            const expiryDate = new Date(order.createdAt);
            expiryDate.setDate(expiryDate.getDate() + (isConception ? 180 : 30));
            const wsTitle = (item.workshop?.title || "Séance de formation").toUpperCase();

            if (order.isBusiness) {
                // 🏢 SCÉNARIO PRO : BONS ENRICHIS
                for (let i = 0; i < (item.quantity || 0); i++) {
                    doc.addPage();

                    // Métadonnées Header
                    doc.fontSize(7).font('Helvetica').fillColor('#999999');
                    doc.text(`RÉF COMMANDE : ${order.reference}`, margin, 35);
                    doc.text(`DATE D'ÉMISSION : ${new Date(order.createdAt).toLocaleDateString('fr-FR')}`, margin, 45);
                    doc.text(`SIRET CLIENT : ${order.user.siret || 'Non renseigné'}`, margin, 55);

                    if (fileExists) {
                        try { doc.image(logoPath, (pageWidth - 140) / 2, 85, { width: 140 }); } catch(e) {}
                    }

                    doc.y = 190;
                    doc.moveDown(2);
                    doc.fontSize(20).font('Helvetica-Bold').fillColor('#D4AF37').text("BON POUR UN ATELIER", margin, doc.y, { width: contentWidth, align: 'center' });

                    doc.moveDown(0.5);
                    doc.fontSize(14).font('Helvetica-Bold').fillColor('#000000').text(wsTitle, margin, doc.y, { width: contentWidth, align: 'center' });

                    doc.moveDown(1);
                    doc.fontSize(14).font('Helvetica-Bold').fillColor('#D4AF37').text(`VALABLE JUSQU'AU : ${expiryDate.toLocaleDateString('fr-FR')}`, margin, doc.y, { width: contentWidth, align: 'center' });

                    doc.moveDown(2.5);
                    doc.fontSize(10).font('Helvetica-Bold').fillColor('#D4AF37').text("BÉNÉFICIAIRE (À COMPLÉTER) :", margin + 30);

                    doc.moveDown(1.5);
                    ["NOM :", "PRÉNOM :", "EMAIL :", "TÉLÉPHONE :"].forEach(f => {
                        doc.fontSize(9).font('Helvetica').fillColor('#666666').text(f, margin + 50);
                        doc.moveTo(margin + 120, doc.y - 2).lineTo(pageWidth - margin - 50, doc.y - 2).strokeColor('#CCCCCC').lineWidth(0.5).stroke();
                        doc.moveDown(1.5);
                    });

                    doc.moveDown(2);
                    doc.fontSize(9).font('Helvetica-Bold').fillColor('#D4AF37').text("SIGNATURE DU BÉNÉFICIAIRE / CACHET CE :", margin + 30);
                    doc.rect(margin + 30, doc.y + 10, contentWidth - 60, 60).strokeColor('#EEEEEE').lineWidth(0.5).stroke();

                    // 🏺 Encart RÉSERVATION - AJOUT DU NUMÉRO
                    const boxTop = 635;
                    doc.rect(margin + 20, boxTop, contentWidth - 40, 120).strokeColor('#D4AF37').lineWidth(1).stroke();

                    doc.fontSize(10).font('Helvetica-Bold').fillColor('#000000')
                        .text("IMPORTANT : RÉSERVATION OBLIGATOIRE", margin, boxTop + 15, { width: contentWidth, align: 'center' });

                    doc.fontSize(22).font('Helvetica-Bold').fillColor('#D4AF37')
                        .text("06 41 42 00 28", margin, boxTop + 40, { width: contentWidth, align: 'center' });

                    doc.fontSize(8).font('Helvetica').fillColor('#000000')
                        .text(`Contactez impérativement l'Établissement pour planifier vos dates. Capacité limitée à 15 places maximum par session.`, margin + 40, boxTop + 85, {
                            width: contentWidth - 80,
                            align: 'center',
                            lineGap: 2
                        });

                    doc.fontSize(9).font('Helvetica-Bold').fillColor('#FF0000')
                        .text("POUR TOUTE DATE DE VALIDITÉ DÉPASSÉE LA CARTE CADEAU SERA CADUC.", margin, 785, { width: contentWidth, align: 'center' });
                }
            } else {
                // 👤 SCÉNARIO PARTICULIER
                doc.addPage();

                doc.fontSize(7).font('Helvetica').fillColor('#999999');
                doc.text(`Réf : ${order.reference} | Émis le : ${new Date(order.createdAt).toLocaleDateString('fr-FR')}`, margin, 35);

                // 🏺 Ajout Employeur pour Salarié CE
                if (order.user.isEmployee) {
                    doc.text(`BÉNÉFICIAIRE CE : ${order.user.companyName} | SIRET : ${order.user.siret}`, margin, 45);
                }

                doc.text(wsTitle, margin, 40, { width: contentWidth, align: 'right' });
                if (fileExists) {
                    try { doc.image(logoPath, (pageWidth - 140) / 2, 85, { width: 140 }); } catch(e) {}
                }

                doc.y = 190;
                doc.moveDown(2);
                doc.fontSize(20).font('Helvetica-Bold').fillColor('#D4AF37').text("BON POUR UN ATELIER", margin, doc.y, { width: contentWidth, align: 'center' });

                doc.moveDown(1.5);
                const validityLabel = isConception ? "6 mois" : "30 jours";
                doc.fontSize(11).font('Helvetica').fillColor('#000000').text(`Certificat d'accès à l'atelier valable ${validityLabel}.`, margin, doc.y, { width: contentWidth, align: 'center' });
                doc.moveDown(1);
                doc.fontSize(15).font('Helvetica-Bold').text(`DATE D'ÉCHÉANCE : ${expiryDate.toLocaleDateString('fr-FR')}`, margin, doc.y, { width: contentWidth, align: 'center' });

                doc.moveDown(4);
                doc.fontSize(11).font('Helvetica-Bold').fillColor('#D4AF37').text("PARTICIPANT(S) :", margin, doc.y, { underline: true });
                doc.moveDown(1);
                (item.participants || []).forEach((p, idx) => {
                    const name = [p.firstName, p.lastName].filter(Boolean).join(' ');
                    doc.fontSize(9).font('Helvetica-Bold').fillColor('#000000').text(`${idx + 1}. ${name}${p.memberCode ? ` [${p.memberCode}]` : ""}`, margin + 15);
                    if (p.phone || p.email) {
                        doc.fontSize(8).font('Helvetica-Oblique').fillColor('#666666').text([p.phone, p.email].filter(Boolean).join('  |  '), margin + 30);
                    }
                    doc.moveDown(0.5);
                });

                const boxTop = 580;
                doc.rect(margin + 20, boxTop, contentWidth - 40, 120).strokeColor('#D4AF37').lineWidth(1).stroke();

                doc.fontSize(10).font('Helvetica-Bold').fillColor('#000000')
                    .text("PLANIFICATION DE L'ATELIER SUR RENDEZ-VOUS", margin, boxTop + 15, { width: contentWidth, align: 'center' });

                doc.fontSize(22).font('Helvetica-Bold').fillColor('#D4AF37')
                    .text("06 41 42 00 28", margin, boxTop + 40, { width: contentWidth, align: 'center' });

                doc.fontSize(8).font('Helvetica').fillColor('#000000')
                    .text("Veuillez contacter l'Établissement pour convenir d'un créneau pour votre atelier. Munissez-vous de ce document et d'une pièce d'identité.", margin + 40, boxTop + 85, {
                        width: contentWidth - 80,
                        align: 'center',
                        lineGap: 2
                    });

                doc.fontSize(9).font('Helvetica-Bold').fillColor('#FF0000').text("POUR TOUTE DATE DE VALIDITÉ DÉPASSÉE, LA CARTE CADEAU SERA CADUC.", margin, 780, { width: contentWidth, align: 'center' });
            }
        });

        if (bottleItems.length > 0) {
            // 🍷 SECTION DOTATIONS
            doc.addPage();

            doc.fontSize(7).font('Helvetica').fillColor('#999999');
            doc.text(`RÉF COMMANDE : ${order.reference}`, margin, 35);
            doc.text(`DATE D'ÉMISSION : ${new Date(order.createdAt).toLocaleDateString('fr-FR')}`, margin, 45);

            if (order.user.isEmployee) {
                doc.text(`ACHETEUR BÉNÉFICIAIRE : ${order.user.companyName}`, margin, 55);
            }

            if (fileExists) {
                try { doc.image(logoPath, (pageWidth - 140) / 2, 85, { width: 140 }); } catch(e) {}
            }

            doc.y = 190;
            doc.moveDown(2.5);
            doc.fontSize(22).font('Helvetica-Bold').fillColor('#D4AF37').text("BON DE RETRAIT DE BOUTEILLES", margin, doc.y, { width: contentWidth, align: 'center' });

            doc.moveDown(4);
            doc.fontSize(11).font('Helvetica-Bold').fillColor('#D4AF37').text("IDENTITÉ DE L'ACHETEUR :", margin, doc.y, { underline: true });
            doc.moveDown(1);
            doc.fillColor('#000000');

            const identity = order.user.isEmployee
                ? `${order.user.firstName} ${order.user.lastName} (Entreprise : ${order.user.companyName})`
                : `${order.user.firstName} ${order.user.lastName}`;

            doc.fontSize(10).font('Helvetica-Bold').text(identity, margin + 15);
            if (order.user.phone || order.user.email) {
                const contact = [order.user.phone, order.user.email].filter(Boolean).join('  |  ');
                doc.fontSize(9).font('Helvetica-Oblique').fillColor('#666666').text(contact, margin + 15);
            }

            doc.moveDown(3);
            doc.fontSize(11).font('Helvetica-Bold').fillColor('#D4AF37').text("PRODUITS À RÉCUPÉRER :", margin, doc.y, { underline: true });
            doc.moveDown(1);
            doc.fillColor('#000000');

            bottleItems.forEach(p => {
                doc.fontSize(10).font('Helvetica-Bold').text(`• ${p.volume?.product.name}`, margin + 15);
                doc.fontSize(9).font('Helvetica').text(`Format : ${p.volume?.size}${p.volume?.unit} — Quantité : ${p.quantity}`, margin + 30);
                doc.moveDown(0.5);
            });

            const boxTop = 580;
            doc.rect(margin + 20, boxTop, contentWidth - 40, 120).strokeColor('#D4AF37').lineWidth(1).stroke();

            doc.fontSize(10).font('Helvetica-Bold').fillColor('#000000').text("RETRAIT SUR RENDEZ-VOUS", margin, boxTop + 15, { width: contentWidth, align: 'center' });

            doc.fontSize(22).font('Helvetica-Bold').fillColor('#D4AF37').text("06 41 42 00 28", margin, boxTop + 40, { width: contentWidth, align: 'center' });

            doc.fontSize(8).font('Helvetica').fillColor('#000000').text("Veuillez contacter l'Établissement pour convenir d'un créneau de récupération de vos produits. Munissez-vous de ce document et d'une pièce d'identité.", margin + 40, boxTop + 85, { width: contentWidth - 80, align: 'center', lineGap: 2 });
        }

        doc.end();
    } catch (error) {
        if (!res.headersSent) {
            res.status(500).json({ error: "Échec technique du registre PDF." });
        } else {
            res.end();
        }
    }
};

export const createOrder = async (req: AuthRequest, res: Response) => { /* Géré par Webhook */ };