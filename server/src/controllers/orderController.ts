import { Request, Response } from 'express';
import { prisma } from '../lib/prisma'; // Utilisation du dossier lib

/**
 * RÉCUPÉRATION : GET /api/orders
 * Cette fonction alimente ton composant OrderHistory.tsx
 */
export const getUserOrders = async (req: Request, res: Response) => {
    // Dans un vrai flux, on utiliserait : const userId = req.user?.id;
    // Pour le test, on va récupérer les commandes existantes
    try {
        const orders = await prisma.order.findMany({
            include: {
                items: {
                    include: { product: true } // Pour récupérer le nom du produit
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Formattage pour correspondre à ton interface React
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
        console.error("🔥 [ERROR GET ORDERS]:", error.message);
        res.status(500).json({ error: "Impossible de lire le registre des commandes." });
    }
};

/**
 * CRÉATION : POST /api/orders
 * Ta logique de transaction originale corrigée
 */
export const createOrder = async (req: Request, res: Response) => {
    // @ts-ignore - userId viendra de ton middleware auth
    const userId = req.user?.id || req.body.userId;
    const { items } = req.body;

    if (!userId) return res.status(401).json({ error: "Non authentifié" });

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
                    userId,
                    reference: `ORD-${Date.now()}`,
                    total: totalOrderPrice,
                    status: "En préparation",
                    items: { create: orderItemsData }
                }
            });
        });

        res.status(201).json({ message: "Commande réussie !", order: result });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};