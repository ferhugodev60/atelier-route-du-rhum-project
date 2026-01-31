import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

/**
 * RÉCUPÉRATION : GET /api/orders
 * Filtre désormais les commandes par l'ID de l'utilisateur connecté
 */
export const getUserOrders = async (req: Request, res: Response) => {
    // On récupère l'ID injecté par le middleware authenticateToken
    // @ts-ignore
    const userId = req.user?.userId;

    if (!userId) {
        return res.status(401).json({ error: "Session non identifiée." });
    }

    try {
        console.log(`📜 [ORDERS] Lecture des registres pour l'utilisateur : ${userId}`);

        const orders = await prisma.order.findMany({
            where: { userId: userId }, // 🏺 FILTRE CRUCIAL : Uniquement les commandes du user
            include: {
                items: {
                    include: { product: true }
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
                name: item.product.name,
                quantity: item.quantity
            }))
        }));

        res.status(200).json(formattedOrders);
    } catch (error: any) {
        console.error("🔥 [ERROR GET_ORDERS]:", error.message);
        res.status(500).json({ error: "Impossible de récupérer vos commandes." });
    }
};

/**
 * CRÉATION : POST /api/orders
 */
export const createOrder = async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.user?.userId; // On utilise l'ID du token pour la sécurité
    const { items } = req.body;

    if (!userId) return res.status(401).json({ error: "Non autorisé" });

    try {
        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.findUnique({ where: { id: userId } });
            if (!user) throw new Error("Utilisateur introuvable");

            let totalOrderPrice = 0;
            const orderItemsData = [];

            for (const item of items) {
                const product = await tx.product.findUnique({ where: { id: item.productId } });
                if (!product) throw new Error(`Produit ${item.productId} introuvable`);

                if (product.category === "Atelier") {
                    const match = product.name.match(/Niveau (\d+)/);
                    if (match) {
                        const levelRequired = parseInt(match[1]);
                        if (user.conceptionLevel < levelRequired - 1) {
                            throw new Error(`Niveau ${levelRequired - 1} requis pour cet atelier.`);
                        }
                    }
                } else {
                    if (product.stock < item.quantity) {
                        throw new Error(`Rupture de stock pour : ${product.name}`);
                    }
                    await tx.product.update({
                        where: { id: product.id },
                        data: { stock: { decrement: item.quantity } }
                    });
                }

                totalOrderPrice += product.price * item.quantity;
                orderItemsData.push({
                    productId: product.id,
                    quantity: item.quantity,
                    price: product.price
                });
            }

            return await tx.order.create({
                data: {
                    userId, // Liaison automatique à l'auteur de la requête
                    reference: `ORD-${Date.now()}`,
                    total: totalOrderPrice,
                    status: "En préparation",
                    items: { create: orderItemsData }
                }
            });
        });

        res.status(201).json({ message: "Commande scellée !", order: result });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};