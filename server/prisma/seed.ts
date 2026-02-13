import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('--- 🧹 Nettoyage complet ---');
    await prisma.participant.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.productVolume.deleteMany();
    await prisma.product.deleteMany();
    await prisma.workshop.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    // 🏺 Configuration Cloudinary
    // Remplacez 'votre_cloud_name' par votre identifiant réel
    const baseUrl = "https://res.cloudinary.com/votre_cloud_name/image/upload/v1/atelier-rhum/products";

    console.log('--- 🏷️ Catégories ---');
    const catRhum = await prisma.category.create({
        data: {
            name: "Rhum arrangé",
            description: "Bouteilles contenant des fruits entiers. Rempotables plusieurs fois."
        }
    });

    const catVrac = await prisma.category.create({
        data: {
            name: "Vrac",
            description: "Rhum arrangé sans fruits, prêt à la consommation."
        }
    });

    const catDame = await prisma.category.create({
        data: {
            name: "Location de Dame-Jeanne",
            description: "Nos formats de prestige disponibles pour vos évènements."
        }
    });

    console.log('--- 📦 Produits ---');

    await prisma.product.create({
        data: {
            name: "Ananas & Vanille",
            description: "Une macération solaire rempotable à l'infini. Gardez les fruits et complétez avec votre rhum blanc.",
            image: `${baseUrl}/ananas-vanille.jpg`,
            categoryId: catRhum.id,
            volumes: {
                create: [
                    { size: 25, unit: " Centilitres", price: 20.0, stock: 10 },
                    { size: 50, unit: " Centilitres", price: 39.0, stock: 15 },
                    { size: 1, unit: " Litre", price: 75.0, stock: 5 }
                ]
            }
        }
    });

    await prisma.product.create({
        data: {
            name: "Mangue & Passion",
            description: "Format Vrac : une infusion intense sans fruits, prête pour une dégustation immédiate.",
            image: `${baseUrl}/mangue-passion.jpg`,
            categoryId: catVrac.id,
            volumes: {
                create: [
                    { size: 33, unit: " Centilitres", price: 25.0, stock: 10 },
                    { size: 70, unit: " Centilitres", price: 65.0, stock: 15 },
                    { size: 1, unit: " Litre", price: 75.0, stock: 5 }
                ]
            }
        }
    });

    await prisma.product.create({
        data: {
            name: "Dame Jeanne (Location)",
            description: "Location d'une dame-jeanne traditionnelle en verre avec son panier d'osier.",
            image: `${baseUrl}/dame-jeanne.jpg`,
            categoryId: catDame.id,
            volumes: {
                create: [
                    { size: 3, unit: " Litres", price: 150.0, stock: 10 },
                    { size: 6, unit: " Litres", price: 300.0, stock: 10 }
                ]
            }
        }
    });

    console.log('--- 🎓 Ateliers ---');

    await prisma.workshop.create({
        data: {
            level: 0,
            title: "L'Atelier Découverte",
            description: "Explorez notre label lors d’un échange privilégié avec le Druide. Au menu : forum question / réponse et dégustation généreuse d'une demi-palette de notre rhum.",
            image: `${baseUrl}/workshops/decouverte.jpg`,
            format: "1h30 de dégustation guidée et de partage historique.",
            quote: "Explorez notre label lors d’un échange privilégié avec le Druide. Au menu : forum question / réponse et dégustation généreuse d'une demi-palette de notre rhum.",
            price: 60.0
        }
    });

    await prisma.workshop.create({
        data: {
            level: 1,
            title: "L'Atelier Fruits",
            description: "Maitrise des acides de fruits",
            color: "#1b6319",
            image: `${baseUrl}/workshops/fruits.jpg`,
            format: "2h30 avec l'expérience qui inclut une bouteille d'1 litre de rhum arrangé.",
            availability: "Du Mardi au Samedi",
            quote: "Apprenez à travailler les fruits frais de saison pour créer une macération harmonieuse.",
            price: 140.0
        }
    });

    await prisma.workshop.create({
        data: {
            level: 2,
            title: "L'Atelier Épices",
            description: "Le caractère et la structure de votre nectar",
            color: "#be5aff",
            image: `${baseUrl}/workshops/epices.jpg`,
            format: "3h avec l'expérience qui inclut l'épisothèque : une boîte de 10 flacons (gustatif, informatif et olfactif).",
            availability: "Du Mardi au Samedi",
            quote: "Plongez dans l'univers des épices rares pour donner une structure unique et boisée à votre rhum.",
            price: 170.0
        }
    });

    await prisma.workshop.create({
        data: {
            level: 3,
            title: "L'Atelier Plantes",
            description: "L'exploration botanique et florale",
            color: "#0074D9",
            image: `${baseUrl}/workshops/plantes.jpg`,
            format: "4h avec l'expérience qui inclut la pharmatech : une boîte de 10 flacons (gustatif, informatif et olfactif).",
            availability: "Du Mardi au Samedi",
            quote: "Utilisez des herbes aromatiques et des plantes pour apporter des notes florales complexes à votre signature d'alchimiste.",
            price: 210.0
        }
    });

    await prisma.workshop.create({
        data: {
            level: 4,
            title: "L'Atelier Mixologie",
            description: "L'art ultime du service et du cocktail.",
            color: "#500101",
            image: `${baseUrl}/workshops/mixologie.jpg`,
            format: "8h avec l'expérience qui inclut la conception de 6 recettes de 25 centilitres.",
            availability: "Du Mardi au Jeudi de 10h à 20h (Repas de 2h inclus)",
            quote: "Une immersion complète de 8 heures pour maîtriser les techniques de bar professionnelles et créer vos propres cocktails signatures.",
            price: 420.0
        }
    });

    console.log('--- 👤 Comptes ---');
    const hashedAdmin = await bcrypt.hash('rhum2026', 10);
    await prisma.user.create({
        data: {
            email: "hugo@atelier.com",
            password: hashedAdmin,
            firstName: "Hugo",
            lastName: "Frr",
            role: "ADMIN",
            conceptionLevel: 0
        }
    });

    const hashedUser = await bcrypt.hash('rhum2026', 10);
    await prisma.user.create({
        data: {
            email: "test@exemple.com",
            password: hashedUser,
            firstName: "Jean",
            lastName: "Dupont",
            phone: "0708091011",
            role: "USER",
            conceptionLevel: 1
        }
    });

    console.log("✅ Alambic synchronisé !");
}

main()
    .catch((e) => { console.error('❌ Erreur lors du remplissage :', e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });