import { Request, Response } from 'express';
import { prisma } from '../index';

export const createOrder = async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { items } = req.body;

    if (!userId) return res.status(401).json({ error: "Non authentifié" });

    try {
        // On lance une transaction pour garantir l'intégrité des données
        const result = await prisma.$transaction(async (tx) => {

            const user = await tx.user.findUnique({ where: { id: userId } });
            if (!user) throw new Error("Utilisateur introuvable");

            let totalOrderPrice = 0;
            const orderItemsData = [];

            for (const item of items) {
                const product = await tx.product.findUnique({ where: { id: item.productId } });
                if (!product) throw new Error(`Produit ${item.productId} introuvable`);

                // 1. GESTION DES ATELIERS (Vérification du niveau, pas de stock)
                if (product.category === "Atelier") {
                    const match = product.name.match(/Niveau (\d+)/);
                    if (match) {
                        const levelRequired = parseInt(match[1]);
                        if (user.conceptionLevel < levelRequired - 1) {
                            throw new Error(`Niveau ${levelRequired - 1} requis pour cet atelier.`);
                        }
                    }
                    // Note : On ne vérifie pas le stock pour les ateliers
                }

                // 2. GESTION DES PRODUITS PHYSIQUES (Vérification + Décrémentation du stock)
                else {
                    if (product.stock < item.quantity) {
                        throw new Error(`Rupture de stock pour : ${product.name}`);
                    }

                    // On met à jour le stock immédiatement dans la transaction
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

            // 3. Création finale de la commande
            return await tx.order.create({
                data: {
                    userId,
                    reference: `ORD-${Date.now()}`,
                    total: totalOrderPrice,
                    items: { create: orderItemsData }
                },
                include: { items: true }
            });
        });

        res.status(201).json({ message: "Commande réussie !", order: result });

    } catch (error: any) {
        // Si une erreur survient (niveau requis, stock insuffisant), la transaction s'annule
        res.status(400).json({ error: error.message });
    }
};