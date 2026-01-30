// server/src/controllers/orderController.ts
import { Request, Response } from 'express';
import { prisma } from '../index';

export const createOrder = async (req: Request, res: Response) => {
    const { userId, items } = req.body; // items est un tableau de { productId, quantity }

    try {
        // 1. Récupérer les infos de l'utilisateur
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).json({ error: "Utilisateur introuvable" });

        // 2. Vérifier chaque produit de la commande
        for (const item of items) {
            const product = await prisma.product.findUnique({ where: { id: item.productId } });

            if (product?.category === "Atelier") {
                // Logique de progression
                // Exemple : Pour acheter le Niveau 2, il faut être au niveau 1
                const levelRequired = parseInt(product.name.split("Niveau ")[1]);

                if (user.conceptionLevel < levelRequired - 1) {
                    return res.status(403).json({
                        error: `Niveau insuffisant. Vous devez valider le Niveau ${levelRequired - 1} avant.`
                    });
                }
            }
        }

        // 3. Si tout est OK, créer la commande
        const order = await prisma.order.create({
            data: {
                userId,
                reference: `ORD-${Date.now()}`,
                total: 0, // À calculer selon les prix des produits
                items: {
                    create: items.map((i: any) => ({
                        productId: i.productId,
                        quantity: i.quantity,
                        price: 0 // À récupérer dynamiquement
                    }))
                }
            }
        });

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la commande" });
    }
};