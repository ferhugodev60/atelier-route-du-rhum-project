import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('--- 🧪 Distillation des Ateliers et Produits ---');

    // 1. Nettoyage complet
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();

    // 2. Création des Produits (Boutique & Ateliers)
    // On utilise des variables pour stocker certains produits afin de créer la commande après
    const rhum1 = await prisma.product.create({
        data: { name: "Ananas & Vanille Bourbon", price: 32.0, category: "Rhum Arrangé", volume: 70, stock: 45 }
    });

    const atelier1 = await prisma.product.create({
        data: { name: "Atelier Conception - Niveau 1 (Fruits)", price: 45.0, category: "Atelier" }
    });

    // Le reste peut être créé en masse
    await prisma.product.createMany({
        data: [
            { name: "Atelier Conception - Niveau 2 (Épices)", price: 55.0, category: "Atelier" },
            { name: "Atelier Conception - Niveau 3 (Plantes)", price: 65.0, category: "Atelier" },
            { name: "Banane Flambée & Épices", price: 34.0, category: "Rhum Arrangé", volume: 70, stock: 30 },
            { name: "Mangue Passion", price: 32.0, category: "Rhum Arrangé", volume: 70, stock: 50 },
        ]
    });

    // 3. Création de l'Utilisateur de test
    const hashedPassword = await bcrypt.hash('rhum2026', 10);
    const user = await prisma.user.create({
        data: {
            email: "hugo@atelier.com",
            password: hashedPassword,
            firstName: "Hugo",
            lastName: "Frr",
            conceptionLevel: 0,
        }
    });

    // 4. Création d'une commande historique pour Hugo
    // Cela permet de tester immédiatement ton composant OrderHistory
    await prisma.order.create({
        data: {
            userId: user.id,
            reference: `ORD-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
            total: 77.0, // 32 (Rhum) + 45 (Atelier)
            status: "Terminée",
            items: {
                create: [
                    {
                        productId: rhum1.id,
                        quantity: 1,
                        price: rhum1.price
                    },
                    {
                        productId: atelier1.id,
                        quantity: 1,
                        price: atelier1.price
                    }
                ]
            }
        }
    });

    console.log('--- ✅ Alambic prêt ! Hugo a maintenant une commande en historique. ---');
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });