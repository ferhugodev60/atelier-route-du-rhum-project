import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

/**
 * RÉCUPÉRATION : GET /api/orders
 */
export const getUserOrders = async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.user?.userId;

    if (!userId) return res.status(401).json({ error: "Session non identifiée." });

    try {
        const orders = await prisma.order.findMany({
            where: { userId: userId },
            include: {
                items: {
                    include: {
                        workshop: true,
                        volume: { include: { product: true } }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        const formattedOrders = orders.map(order => ({
            id: order.id,
            reference: order.reference,
            createdAt: order.createdAt,
            total: order.total,
            status: order.status,
            items: order.items.map((item: any) => ({
                // On affiche soit le titre de l'atelier, soit le nom du produit + volume
                name: item.workshop
                    ? item.workshop.title
                    : `${item.volume.product.name} (${item.volume.size}${item.volume.unit})`,
                quantity: item.quantity,
                price: item.price
            }))
        }));

        res.status(200).json(formattedOrders);
    } catch (error: any) {
        res.status(500).json({ error: "Impossible de récupérer vos registres de commandes." });
    }
};

/**
 * CRÉATION : POST /api/orders
 */
export const createOrder = async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.user?.userId;
    const { items } = req.body; // Array de { workshopId?, volumeId?, quantity }

    if (!userId) return res.status(401).json({ error: "Authentification requise." });

    try {
        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.findUnique({ where: { id: userId } });
            if (!user) throw new Error("Compte utilisateur introuvable.");

            let totalOrderPrice = 0;
            const orderItemsData = [];

            for (const item of items) {
                // --- CAS 1 : C'EST UN ATELIER ---
                if (item.workshopId) {
                    const workshop = await tx.workshop.findUnique({ where: { id: item.workshopId } });
                    if (!workshop) throw new Error("Atelier introuvable.");

                    // 🏺 SÉCURITÉ : Vérification de la progression
                    // La formule : Niveau de l'Atelier <= Niveau actuel + 1
                    if (workshop.level > 0) {
                        if (user.conceptionLevel < workshop.level - 1) {
                            throw new Error(`Accès refusé : Vous devez valider le Niveau ${workshop.level - 1} avant de commander le niveau "${workshop.title}".`);
                        }
                    }

                    totalOrderPrice += workshop.price * item.quantity;
                    orderItemsData.push({
                        workshopId: workshop.id,
                        quantity: item.quantity,
                        price: workshop.price
                    });
                }

                // --- CAS 2 : C'EST UNE BOUTEILLE (VOLUME) ---
                else if (item.volumeId) {
                    const volume = await tx.productVolume.findUnique({
                        where: { id: item.volumeId },
                        include: { product: true }
                    });
                    if (!volume) throw new Error("Format de produit introuvable.");

                    // Vérification et mise à jour des stocks
                    if (volume.stock < item.quantity) {
                        throw new Error(`Rupture de stock pour ${volume.product.name} en format ${volume.size}${volume.unit}.`);
                    }

                    await tx.productVolume.update({
                        where: { id: volume.id },
                        data: { stock: { decrement: item.quantity } }
                    });

                    totalOrderPrice += volume.price * item.quantity;
                    orderItemsData.push({
                        volumeId: volume.id,
                        quantity: item.quantity,
                        price: volume.price
                    });
                }
            }

            // Création finale de la commande
            return await tx.order.create({
                data: {
                    userId,
                    reference: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                    total: totalOrderPrice,
                    status: "EN PRÉPARATION",
                    items: { create: orderItemsData }
                }
            });
        });

        res.status(201).json({ message: "La commande a été scellée avec succès.", order: result });
    } catch (error: any) {
        console.error("🔥 [CREATE_ORDER ERROR]:", error.message);
        res.status(400).json({ error: error.message });
    }
};