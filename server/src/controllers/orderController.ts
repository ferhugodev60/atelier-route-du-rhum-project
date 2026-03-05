import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client';
import * as pdfService from '../services/pdf';

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
 * Résout le bug "undefined" en transmettant les métadonnées scellées.
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
            items: order.items.map(item => {
                // 🏺 LOGIQUE DE NOMMAGE SCELLÉE : On utilise le nom stocké en base (qui contient le code RHUM-)
                const displayName = item.name || (item.workshop
                    ? `Séance : ${item.workshop.title}`
                    : (item.volume ? `${item.volume.product.name} (${item.volume.size}${item.volume.unit})` : "Article technique"));

                return {
                    id: item.id,
                    name: displayName,
                    quantity: item.quantity,
                    price: item.price,
                    groupNames: item.groupNames,
                    groupName: item.companyGroup?.name || null,
                    workshop: item.workshop,
                    volume: item.volume,
                    participants: item.participants
                };
            })
        }));
        res.status(200).json(formattedOrders);
    } catch (error) {
        console.error("❌ Erreur Registre Orders :", error);
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

        if (status === 'PAYÉ' || status === 'FINALISÉ') {
            for (const item of updatedOrder.items) {
                if (item.workshop && item.participants.length === 0) {
                    let companyGroupId = null;
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

                    const participantsData = Array.from({ length: item.quantity }).map(() => ({
                        orderItemId: item.id,
                        companyGroupId: companyGroupId,
                        isValidated: false
                    }));

                    await prisma.participant.createMany({ data: participantsData });
                }

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
 * 📜 GÉNÉRATION DU JUSTIFICATIF PDF
 */
export const downloadOrderPDF = async (req: AuthRequest, res: Response) => {
    const orderId = req.params.orderId as string;
    console.log(`📡 [API_DOWNLOAD] Requête reçue pour OrderID : ${orderId}`);

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

        if (!order) {
            console.error(`📡 [API_DOWNLOAD] Commande ${orderId} introuvable.`);
            return res.status(404).json({ error: "Dossier introuvable." });
        }

        console.log("📡 [API_DOWNLOAD] Lancement du service PDF...");
        const pdfBytes = await pdfService.generateOrderPDF(order);

        if (!pdfBytes || pdfBytes.length === 0) {
            console.error("📡 [API_DOWNLOAD] Le PDF retourné est VIDE !");
            return res.status(500).json({ error: "Génération vide." });
        }

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Justificatif_${order.reference}.pdf`);

        console.log(`📡 [API_DOWNLOAD] Envoi du buffer (${pdfBytes.length} octets) au client.`);
        res.send(Buffer.from(pdfBytes));
    } catch (error: any) {
        console.error("❌ [API_DOWNLOAD_ERROR] :", error.message);
        res.status(500).json({ error: "Échec technique du registre PDF." });
    }
};

/**
 * 🏺 VÉRIFICATION DE L'HISTORIQUE PAR PALIER TECHNIQUE
 */
export const getOrderCountByLevel = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    const level = req.params.level as string;

    if (!userId) return res.status(401).json({ error: "Identification requise." });

    try {
        const count = await prisma.order.count({
            where: {
                userId,
                status: 'PAYÉ',
                isBusiness: true,
                items: {
                    some: {
                        workshop: {
                            level: parseInt(level)
                        }
                    }
                }
            }
        });

        res.json({ count });
    } catch (error) {
        console.error("🔥 [REGISTRE_ERREUR]:", error);
        res.status(500).json({ error: "Échec de consultation du Registre d'historique." });
    }
};

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

export const createOrder = async (req: AuthRequest, res: Response) => {
    res.status(501).json({ message: "La création de commande est gérée par le protocole Webhook Stripe." });
};