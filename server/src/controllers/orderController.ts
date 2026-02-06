import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client';

/**
 * 🏺 Extension du type Request pour inclure l'utilisateur authentifié
 */
interface AuthRequest extends Request {
    user?: {
        userId: string;
        role: string;
    };
}

/**
 * 🏺 Définition d'un type complexe pour inclure toutes les relations de la commande
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
 * Affiche l'historique avec les participants pour chaque atelier
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
        }) as OrderWithRelations[]; // 🏺 Cast pour garantir l'accès aux propriétés incluses

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
                // On liste les noms des participants pour l'affichage
                participants: item.participants.map(p => `${p.firstName} ${p.lastName}`)
            }))
        }));

        res.status(200).json(formattedOrders);
    } catch (error: any) {
        res.status(500).json({ error: "Impossible de récupérer vos registres." });
    }
};

/**
 * CRÉATION : POST /api/orders
 * Gère la transaction, les stocks et la création des participants
 */
export const createOrder = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    const { items } = req.body;

    if (!userId) return res.status(401).json({ error: "Authentification requise." });

    try {
        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.findUnique({ where: { id: userId } });
            if (!user) throw new Error("Compte utilisateur introuvable.");

            let totalOrderPrice = 0;
            const orderItemsData = [];

            for (const item of items) {
                // --- CAS 1 : ATELIER ---
                if (item.workshopId) {
                    const workshop = await tx.workshop.findUnique({ where: { id: item.workshopId } });
                    if (!workshop) throw new Error("Atelier introuvable.");

                    // 🏺 Vérification du niveau de conception
                    if (workshop.level > 0 && user.conceptionLevel < workshop.level - 1) {
                        throw new Error(`Accès refusé : Niveau ${workshop.level - 1} requis.`);
                    }

                    totalOrderPrice += workshop.price * item.quantity;

                    orderItemsData.push({
                        quantity: item.quantity,
                        price: workshop.price,
                        workshopId: workshop.id,
                        // 🏺 Création imbriquée des participants
                        participants: {
                            create: (item.participants || []).map((p: any) => ({
                                firstName: p.firstName,
                                lastName: p.lastName,
                                phone: p.phone
                            }))
                        }
                    });
                }

                // --- CAS 2 : BOUTEILLE (VOLUME) ---
                else if (item.volumeId) {
                    const volume = await tx.productVolume.findUnique({
                        where: { id: item.volumeId },
                        include: { product: true }
                    });

                    if (!volume) throw new Error("Format de produit introuvable.");
                    if (volume.stock < item.quantity) {
                        throw new Error(`Rupture de stock pour ${volume.product.name}.`);
                    }

                    // Mise à jour des stocks en direct
                    await tx.productVolume.update({
                        where: { id: volume.id },
                        data: { stock: { decrement: item.quantity } }
                    });

                    totalOrderPrice += volume.price * item.quantity;
                    orderItemsData.push({
                        quantity: item.quantity,
                        price: volume.price,
                        volumeId: volume.id
                    });
                }
            }

            // Création de la commande finale
            return await tx.order.create({
                data: {
                    userId,
                    reference: `ORD-${new Date().getTime()}`,
                    total: totalOrderPrice,
                    status: "EN PRÉPARATION",
                    items: {
                        create: orderItemsData
                    }
                }
            });
        });

        res.status(201).json({
            message: "La commande a été scellée avec succès.",
            order: result
        });
    } catch (error: any) {
        console.error("🔥 [CREATE_ORDER ERROR]:", error.message);
        res.status(400).json({ error: error.message });
    }
};