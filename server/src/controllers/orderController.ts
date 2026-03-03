import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client';
import * as pdfService from '../services/pdfService';

interface AuthRequest extends Request {
    user?: { userId: string; role: string; };
}

type OrderWithRelations = Prisma.OrderGetPayload<{
    include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true, memberCode: true, companyName: true, siret: true, isEmployee: true, conceptionLevel: true } },
        items: { include: { workshop: true, volume: { include: { product: true } }, participants: true, companyGroup: true } };
    };
}>;

/**
 * 📜 EXTRACTION DU REGISTRE DES COMMANDES
 */
export const getOrders = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    const isAdmin = req.user?.role === 'ADMIN';
    if (!userId) return res.status(401).json({ error: "Identification requise." });

    try {
        const rawOrders = await prisma.order.findMany({
            where: isAdmin ? {} : { userId },
            include: {
                user: { select: { firstName: true, lastName: true, email: true, memberCode: true, companyName: true, isEmployee: true } },
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
                id: item.id,
                name: item.workshop ? `Séance : ${item.workshop.title}` : `${item.volume?.product.name} (${item.volume?.size}${item.volume?.unit})`,
                quantity: item.quantity,
                price: item.price,
                groupName: item.companyGroup?.name || null,
                participants: item.participants
            }))
        }));
        res.status(200).json(formattedOrders);
    } catch (error) {
        res.status(500).json({ error: "Erreur de lecture du registre." });
    }
};

/**
 * 📜 DÉTAILS D'UN DOSSIER DE VENTE
 */
export const getOrderDetails = async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string;
    const isAdmin = req.user?.role === 'ADMIN';

    try {
        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                user: true,
                items: { include: { workshop: true, volume: { include: { product: true } }, participants: true, companyGroup: true } }
            }
        }) as OrderWithRelations | null;

        if (!order || (!isAdmin && order.userId !== req.user?.userId)) {
            return res.status(403).json({ error: "Accès refusé ou document introuvable." });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: "Erreur d'extraction." });
    }
};

/**
 * 📜 ÉMARGEMENT ET CERTIFICATION TECHNIQUE (QR CODE)
 */
export const updateParticipantStatus = async (req: AuthRequest, res: Response) => {
    const participantId = req.params.participantId as string;
    const { firstName, lastName, isValidated } = req.body;

    try {
        const participant = await prisma.participant.update({
            where: { id: participantId },
            data: { firstName, lastName, isValidated, validatedAt: isValidated ? new Date() : null },
            include: { orderItem: { include: { participants: true, workshop: true, companyGroup: true, order: true } } }
        });

        const orderItem = (participant as any).orderItem;
        const validatedCount = orderItem.participants.filter((p: any) => p.isValidated).length;
        const isCohortComplete = validatedCount === orderItem.quantity;

        // 🏺 Mise à jour des niveaux si la cohorte est complète
        if (isCohortComplete && orderItem.workshop) {
            const levelTarget = orderItem.workshop.level;
            await prisma.$transaction([
                prisma.companyGroup.updateMany({
                    where: { id: orderItem.companyGroupId || undefined },
                    data: { currentLevel: levelTarget }
                }),
                prisma.user.update({
                    where: { id: orderItem.order.userId },
                    data: { conceptionLevel: levelTarget }
                })
            ]);
        }
        res.json({ message: "Certification scellée.", currentCount: validatedCount, isComplete: isCohortComplete });
    } catch (error) {
        res.status(400).json({ error: "Échec de la validation technique." });
    }
};

/**
 * 📜 MISE À JOUR DU STATUT ET SCELLAGE DES PLACES
 */
export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string;
    const { status } = req.body;

    try {
        const updatedOrder = await prisma.order.update({
            where: { id },
            data: { status },
            include: { items: { include: { workshop: true, participants: true } }, user: true }
        });

        // 🏺 PROTOCOLE DE CRÉATION DES PLACES (Entreprises / Particuliers)
        if (status === 'PAYÉ' || status === 'FINALISÉ') {
            for (const item of updatedOrder.items) {
                // Création des slots uniquement si le registre est vide pour cet item
                if (item.workshop && item.participants.length === 0) {

                    let companyGroupId = null;
                    // Pour les entreprises, on crée le groupe institutionnel s'il n'existe pas
                    if (updatedOrder.isBusiness) {
                        const group = await prisma.companyGroup.create({
                            data: {
                                name: `Contrat ${updatedOrder.reference}`,
                                ownerId: updatedOrder.userId,
                                currentLevel: item.workshop.level,
                            }
                        });
                        companyGroupId = group.id;
                    }

                    // Gravure massive des places (Cas PRO : isValidated à false pour forcer le QR)
                    const participantsData = Array.from({ length: item.quantity }).map(() => ({
                        orderItemId: item.id,
                        companyGroupId: companyGroupId,
                        isValidated: false
                    }));

                    await prisma.participant.createMany({ data: participantsData });
                }

                // Promotion de niveau pour les particuliers
                if (!updatedOrder.isBusiness && item.workshop && item.workshop.level > updatedOrder.user.conceptionLevel) {
                    await prisma.user.update({
                        where: { id: updatedOrder.userId },
                        data: { conceptionLevel: item.workshop.level }
                    });
                }
            }
        }
        res.json(updatedOrder);
    } catch (error) {
        res.status(400).json({ error: "Échec de mise à jour du registre." });
    }
};

/**
 * 📜 CRÉATION MANUELLE D'UN SLOT D'ÉMARGEMENT
 */
export const addManualParticipant = async (req: AuthRequest, res: Response) => {
    const { orderItemId } = req.body;
    try {
        const orderItem = await prisma.orderItem.findUnique({ where: { id: orderItemId as string } });
        if (!orderItem) return res.status(404).json({ error: "Ligne de dossier introuvable." });

        const newParticipant = await prisma.participant.create({
            data: { orderItemId: orderItem.id, companyGroupId: orderItem.companyGroupId, isValidated: false }
        });
        res.status(201).json(newParticipant);
    } catch (error) {
        res.status(400).json({ error: "Échec de l'ajout manuel." });
    }
};

/**
 * 📜 GÉNÉRATION DU JUSTIFICATIF PDF (HYBRIDE : RÉSUMÉ OU QR CODES)
 */
export const downloadOrderPDF = async (req: AuthRequest, res: Response) => {
    const orderId = req.params.orderId as string;

    try {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
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

        if (!order) return res.status(404).json({ error: "Dossier introuvable au Registre." });

        // Appel au moteur hybride (Texte si noms présents, sinon QR Code)
        const pdfBytes = await pdfService.generateOrderPDF(order);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Justificatif_${order.reference}.pdf`);
        res.send(Buffer.from(pdfBytes));
    } catch (error) {
        console.error("❌ Incident de scellage PDF :", error);
        res.status(500).json({ error: "Échec technique du registre PDF." });
    }
};

export const createOrder = async (req: AuthRequest, res: Response) => {
    res.status(501).json({ message: "La création de commande est gérée par le protocole Webhook Stripe." });
};