import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('--- 🧪 Distillation des Ateliers et Produits ---');

    // Nettoyage complet
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();

    // 1. Les Ateliers de Conception (La Progression)
    await prisma.product.createMany({
        data: [
            { name: "Atelier Conception - Niveau 1 (Fruits)", price: 45.0, category: "Atelier" },
            { name: "Atelier Conception - Niveau 2 (Épices)", price: 55.0, category: "Atelier" },
            { name: "Atelier Conception - Niveau 3 (Plantes)", price: 65.0, category: "Atelier" },
            { name: "Atelier Conception - Niveau 4 (Mixologie)", price: 75.0, category: "Atelier" },
            { name: "Atelier Découverte", price: 30.0, category: "Atelier" },
        ]
    });

    // 2. L'Atelier Découverte (Indépendant)
    await prisma.product.create({
        data: {
            name: "Atelier Découverte (Dégustation & Histoire)",
            price: 60.0,
            category: "Atelier"
        }
    });

    // 3. La Boutique (Les Bouteilles)
    await prisma.product.createMany({
        data: [
            { name: "Ananas & Vanille Bourbon", price: 32.0, category: "Rhum Arrangé", volume: 70, stock: 45 },
            { name: "Ananas & Vanille Bourbon (Format Vrac)", price: 15.0, category: "Vrac", volume: 20, stock: 100 },
            { name: "Banane Flambée & Épices", price: 34.0, category: "Rhum Arrangé", volume: 70, stock: 30 },
            { name: "Mangue Passion", price: 32.0, category: "Rhum Arrangé", volume: 70, stock: 50 },
        ]
    });

    // 4. Utilisateur de test
    const hashedPassword = await bcrypt.hash('rhum2026', 10);
    await prisma.user.create({
        data: {
            email: "hugo@atelier.com",
            password: hashedPassword,
            firstName: "Hugo",
            lastName: "Frr",
            conceptionLevel: 0,
        }
    });

    console.log('--- ✅ Alambic prêt ! Ateliers et Boutique initialisés. ---');
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });