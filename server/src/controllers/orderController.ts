import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client';
import PDFDocument from 'pdfkit';

interface AuthRequest extends Request {
    user?: { userId: string; role: string; };
}

type OrderWithRelations = Prisma.OrderGetPayload<{
    include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true, memberCode: true } },
        items: {
            include: {
                workshop: true;
                volume: { include: { product: true } };
                participants: true;
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
                user: { select: { firstName: true, lastName: true, email: true, memberCode: true } },
                items: {
                    include: {
                        workshop: true,
                        volume: { include: { product: true } },
                        participants: true
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
            items: order.items.map(item => ({
                name: item.workshop
                    ? `Séance : ${item.workshop.title}`
                    : `${item.volume?.product.name} (${item.volume?.size}${item.volume?.unit})`,
                quantity: item.quantity,
                price: item.price,
                participants: item.participants.map(p =>
                    p.memberCode
                        ? `${p.firstName} ${p.lastName} (${p.memberCode})`
                        : `${p.firstName} ${p.lastName}`
                )
            }))
        }));

        res.status(200).json(formattedOrders);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération du registre." });
    }
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
                items: {
                    include: {
                        workshop: true,
                        volume: { include: { product: true } },
                        participants: true
                    }
                }
            }
        }) as OrderWithRelations | null;

        if (!order) return res.status(404).json({ error: "Document introuvable." });

        if (!isAdmin && order.userId !== userId) {
            return res.status(403).json({ error: "Accès non autorisé." });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de l'extraction des détails." });
    }
};

/**
 * 🏺 Mise à jour logistique et Promotion Collective
 * Le palier technique est incrémenté pour TOUS les participants certifiés.
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

        // 🏺 Promotion automatique collective si FINALISÉ
        if (status === 'FINALISÉ') {
            const codesToPromote = order.items
                .filter(item => item.workshop !== null)
                .flatMap(item => item.participants.map(p => p.memberCode))
                .filter((code): code is string => !!code);

            const uniqueCodes = [...new Set(codesToPromote)];

            if (uniqueCodes.length > 0) {
                await Promise.all(uniqueCodes.map(code =>
                    prisma.user.update({
                        where: { memberCode: code },
                        data: { conceptionLevel: { increment: 1 } }
                    })
                ));
                console.log(`🏛️ Promotion collective certifiée pour ${uniqueCodes.length} membre(s).`);
            }
        }

        res.json(order);
    } catch (error) {
        res.status(400).json({ error: "Échec de la mise à jour logistique du dossier." });
    }
};

export const downloadOrderPDF = async (req: AuthRequest, res: Response) => {
    const orderId = req.params.orderId as string;
    const userId = req.user?.userId;

    try {
        const order = await prisma.order.findFirst({
            where: { id: orderId, userId: userId },
            include: {
                items: {
                    include: {
                        workshop: true,
                        volume: { include: { product: true } },
                        participants: true
                    }
                }
            }
        }) as OrderWithRelations | null;

        if (!order) return res.status(404).json({ error: "Document introuvable." });

        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Commande_${order.reference}.pdf`);
        doc.pipe(res);

        doc.fontSize(20).text('RÉCAPITULATIF DE COMMANDE', { align: 'center' });
        doc.moveDown(2);

        doc.fontSize(10).font('Helvetica-Bold').text(`Référence : ${order.reference}`);
        doc.font('Helvetica').text(`Date : ${new Date(order.createdAt).toLocaleDateString('fr-FR')}`);
        doc.moveDown();
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown();

        order.items.forEach((item) => {
            const name = item.workshop
                ? item.workshop.title
                : `${item.volume?.product.name} (${item.volume?.size}${item.volume?.unit})`;

            doc.fontSize(10).font('Helvetica-Bold').text(`${name}`, { continued: true });
            doc.text(` (x${item.quantity})`, { continued: true });
            doc.text(`${(item.price * item.quantity).toFixed(2)}€`, { align: 'right' });

            if (item.participants.length > 0) {
                doc.fontSize(8).font('Helvetica').text("Participants : ", { continued: true });
                const participantList = item.participants.map(p =>
                    p.memberCode ? `${p.firstName} ${p.lastName} [${p.memberCode}]` : `${p.firstName} ${p.lastName}`
                ).join(', ');
                doc.text(participantList);
            }

            doc.moveDown(1);
        });

        doc.moveDown();
        doc.moveTo(350, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown();
        doc.fontSize(14).font('Helvetica-Bold').text(`TOTAL RÉGLÉ : ${order.total.toFixed(2)}€`, { align: 'right' });

        doc.moveDown(10);
        doc.fontSize(9).text(
            "Ce document certifie votre achat. Veuillez le présenter lors de votre retrait ou au début de votre séance de formation.",
            { align: 'center' }
        );

        doc.end();
    } catch (error) {
        res.status(500).json({ error: "Erreur de génération du PDF." });
    }
};

export const createOrder = async (req: AuthRequest, res: Response) => { /* Géré par Webhook Stripe */ };