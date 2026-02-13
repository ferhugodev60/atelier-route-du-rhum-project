import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client';
import PDFDocument from 'pdfkit';

/**
 * Extension de l'interface Request pour inclure l'utilisateur authentifié
 */
interface AuthRequest extends Request {
    user?: {
        userId: string;
        role: string;
    };
}

/**
 * Définition du type complexe incluant toutes les relations nécessaires
 * pour l'historique et la génération de PDF.
 */
type OrderWithRelations = Prisma.OrderGetPayload<{
    include: {
        items: {
            include: {
                workshop: true;
                volume: { include: { product: true } };
                participants: true;
            };
        };
    };
}>;

/**
 * RÉCUPÉRATION : GET /api/orders
 */
export const getUserOrders = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Session non identifiée." });

    try {
        const orders = await prisma.order.findMany({
            where: { userId: userId },
            include: {
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

        const formattedOrders = orders.map((order: OrderWithRelations) => ({
            id: order.id,
            reference: order.reference,
            createdAt: order.createdAt,
            total: order.total,
            status: order.status,
            items: order.items.map((item) => ({
                name: item.workshop
                    ? item.workshop.title
                    : `${item.volume?.product.name} (${item.volume?.size}${item.volume?.unit})`,
                quantity: item.quantity,
                price: item.price,
                participants: item.participants.map(p => `${p.firstName} ${p.lastName}`)
            }))
        }));

        res.status(200).json(formattedOrders);
    } catch (error: any) {
        res.status(500).json({ error: "Impossible de récupérer vos commandes." });
    }
};

/**
 * GÉNÉRATION ET TÉLÉCHARGEMENT DU PDF
 */
export const downloadOrderPDF = async (req: AuthRequest, res: Response) => {
    const { orderId } = req.params;
    const userId = req.user?.userId;

    // Résolution de TS2322 : On garantit que orderId est une string unique
    if (!orderId || typeof orderId !== 'string') {
        return res.status(400).json({ error: "Identifiant de commande invalide." });
    }

    try {
        // Utilisation de findFirst pour filtrer par ID et UserId simultanément
        const order = await prisma.order.findFirst({
            where: {
                id: orderId,
                userId: userId
            },
            include: {
                items: {
                    include: {
                        workshop: true,
                        volume: { include: { product: true } }
                    }
                }
            }
        }) as OrderWithRelations | null; // Résolution de TS2339 par le cast

        if (!order) return res.status(404).json({ error: "Document introuvable." });

        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Commande_${order.reference}.pdf`);

        doc.pipe(res);

        // Header professionnel
        doc.fontSize(20).text('RÉCAPITULATIF DE COMMANDE', { align: 'center' });
        doc.moveDown(2);

        // Infos Commande
        doc.fontSize(10).font('Helvetica-Bold').text(`Référence : ${order.reference}`);
        doc.font('Helvetica').text(`Date : ${new Date(order.createdAt).toLocaleDateString('fr-FR')}`);
        doc.moveDown();
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown();

        // Articles
        doc.fontSize(12).font('Helvetica-Bold').text('Détails de la sélection :', { underline: true });
        doc.moveDown();

        order.items.forEach((item) => {
            const name = item.workshop
                ? item.workshop.title
                : `${item.volume?.product.name} (${item.volume?.size}${item.volume?.unit})`;

            doc.fontSize(10).font('Helvetica').text(`${name}`, { continued: true });
            doc.text(` (x${item.quantity})`, { continued: true });
            doc.text(`${(item.price * item.quantity).toFixed(2)}€`, { align: 'right' });
            doc.moveDown(0.5);
        });

        doc.moveDown();
        doc.moveTo(350, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown();

        // Total
        doc.fontSize(14).font('Helvetica-Bold').text(`TOTAL RÉGLÉ : ${order.total.toFixed(2)}€`, { align: 'right' });

        // Footer
        doc.moveDown(10);
        doc.fontSize(9).font('Helvetica-Oblique').text(
            "Ce document certifie votre achat. Veuillez le présenter lors de votre retrait en établissement ou au début de votre séance de formation.",
            { align: 'center' }
        );

        doc.end();
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la génération du PDF." });
    }
};

export const createOrder = async (req: AuthRequest, res: Response) => {
    // Logique gérée par le Webhook Stripe
};