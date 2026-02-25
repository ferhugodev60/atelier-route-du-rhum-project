import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const prisma = new PrismaClient();

// 🏺 Fonction de génération du Code Passeport Membre [cite: 2026-02-12]
const generateMemberCode = () => {
    const year = "26";
    const random = crypto.randomBytes(2).toString('hex').toUpperCase();
    return `RR-${year}-${random}`;
};

async function main() {
    console.log('--- 🧹 Nettoyage du Registre ---');
    await prisma.participant.deleteMany();
    await prisma.companyGroup.deleteMany(); // 🏺 Nettoyage des cohortes
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.productVolume.deleteMany();
    await prisma.product.deleteMany();
    await prisma.workshop.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

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

    console.log('--- 📦 Catalogue Produits ---');
    await prisma.product.create({
        data: {
            name: "Ananas & Vanille",
            description: "Une macération solaire rempotable à l'infini. Gardez les fruits et complétez avec votre rhum blanc.",
            image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1470&auto=format&fit=crop",
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
            image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1470&auto=format&fit=crop",
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

    console.log('--- 🎓 Ateliers (Particuliers) ---');
    // ... (Découverte et Conception aux tarifs publics)
    await prisma.workshop.create({
        data: {
            level: 0,
            type: "PARTICULIER",
            title: "L'Atelier Découverte",
            description: "Explorez notre label lors d’un échange privilégié avec le Druide.",
            image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweo5UfygpC2S3i2AcaG73QxtyKrYrc4qGgUdGOTE0MDr6qCTw3Qw9xiZH95KWQOv4RWrSa_UrJgYAuEzFWEGGNxR7QhX0RX1l2Rn7pkhdxv0yBl2E1GdywRvYYE9y7cXyYv0q_Zw2yJJGak=s680-w680-h510-rw",
            quote: "Forum question / réponse et dégustation généreuse d'une demi-palette.",
            format: "1h30 de dégustation guidée.",
            price: 60.0
        }
    });

    await prisma.workshop.create({
        data: {
            level: 1,
            type: "PARTICULIER",
            title: "L'Atelier Fruits",
            color: "#2f7700",
            description: "Maitrise des acides de fruits",
            image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            format: "2h30 avec une bouteille d'1 litre incluse.",
            quote: "Apprenez à travailler les fruits frais de saison.",
            price: 140.0
        }
    });

    await prisma.workshop.create({
        data: {
            level: 2,
            type: "PARTICULIER",
            title: "L'Atelier Épices",
            color: "#be5aff",
            description: "Le caractère et la structure de votre nectar",
            image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            format: "3h avec l'épisothèque incluse.",
            quote: "Plongez dans l'univers des épices rares.",
            price: 170.0
        }
    });

    await prisma.workshop.create({
        data: {
            level: 3,
            type: "PARTICULIER",
            title: "L'Atelier Plantes",
            color: "#009bf3",
            description: "L'exploration botanique et florale",
            image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            format: "4h avec la pharmatech incluse.",
            quote: "Utilisez herbes et plantes pour vos notes florales.",
            price: 210.0
        }
    });

    await prisma.workshop.create({
        data: {
            level: 4,
            type: "PARTICULIER",
            title: "L'Atelier Mixologie",
            color: "#80070D",
            description: "L'art ultime du service et du cocktail.",
            image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            format: "8h d'immersion totale, repas de 2h inclus.",
            quote: "Maîtrisez les techniques de bar professionnelles.",
            price: 420.0
        }
    });

    console.log('--- 🏢 Offres Entreprise (Comité d’Entreprise) ---');
    // 🏺 Tarifs PRO : -10€ sur niveau 0, -20€ sur les paliers de conception

    await prisma.workshop.create({
        data: {
            level: 0,
            type: "ENTREPRISE",
            title: "L'Atelier Découverte (PRO)",
            description: "Format Séminaire : Explorez notre label avec vos équipes.",
            image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweo5UfygpC2S3i2AcaG73QxtyKrYrc4qGgUdGOTE0MDr6qCTw3Qw9xiZH95KWQOv4RWrSa_UrJgYAuEzFWEGGNxR7QhX0RX1l2Rn7pkhdxv0yBl2E1GdywRvYYE9y7cXyYv0q_Zw2yJJGak=s680-w680-h510-rw",
            format: "Privatisation : 1h30 de dégustation et partage historique.",
            quote: "La cohésion d'équipe à travers l'histoire du rhum.",
            price: 50.0 // 🏺 -10€
        }
    });

    await prisma.workshop.create({
        data: {
            level: 1,
            type: "ENTREPRISE",
            title: "L'Atelier Fruits (PRO)",
            color: "#2f7700",
            description: "Maitrise des acides de fruits - Session de cohésion.",
            image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            format: "Privatisation : 2h30 avec une bouteille d'1 litre par participant.",
            quote: "Travail d'équipe sur l'harmonie des fruits de saison.",
            price: 120.0 // 🏺 -20€
        }
    });

    await prisma.workshop.create({
        data: {
            level: 2,
            type: "ENTREPRISE",
            title: "L'Atelier Épices (PRO)",
            color: "#be5aff",
            description: "Caractère et structure - Session Alchimie.",
            image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            format: "Privatisation : 3h avec l'épisothèque incluse.",
            quote: "Développez la créativité collective via les épices rares.",
            price: 150.0 // 🏺 -20€
        }
    });

    await prisma.workshop.create({
        data: {
            level: 3,
            type: "ENTREPRISE",
            title: "L'Atelier Plantes (PRO)",
            color: "#009bf3",
            description: "Exploration botanique en brigade.",
            image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            format: "Privatisation : 4h avec la pharmatech incluse.",
            quote: "Un voyage sensoriel pour renforcer les liens botaniques.",
            price: 190.0 // 🏺 -20€
        }
    });

    await prisma.workshop.create({
        data: {
            level: 4,
            type: "ENTREPRISE",
            title: "L'Atelier Mixologie (PRO)",
            color: "#80070D",
            description: "L'excellence du service pour vos événements de prestige.",
            image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            format: "Journée Séminaire : 8h, repas inclus, création de 6 recettes.",
            quote: "Maîtrise de l'art du cocktail pour vos cadres et collaborateurs.",
            price: 400.0 // 🏺 -20€
        }
    });

    console.log('--- 👤 Membres Certifiés ---');
    const hashedAdmin = await bcrypt.hash('rhum2026', 10);
    await prisma.user.create({
        data: {
            email: "hugo@atelier.com",
            memberCode: generateMemberCode(),
            password: hashedAdmin,
            firstName: "Hugo",
            lastName: "Frr",
            role: "ADMIN"
        }
    });

    const hashedUser = await bcrypt.hash('rhum2026', 10);
    await prisma.user.create({
        data: {
            email: "jean.dupont@exemple.com",
            memberCode: generateMemberCode(),
            password: hashedUser,
            firstName: "Jean",
            lastName: "Dupont",
            role: "USER"
        }
    });

    // 🏺 Création d'un compte Professionnel Test
    const hashedPro = await bcrypt.hash('ce2026', 10);
    await prisma.user.create({
        data: {
            email: "ce@airbus.com",
            memberCode: generateMemberCode(),
            password: hashedPro,
            firstName: "Responsable",
            lastName: "CE Airbus",
            role: "PRO",
            companyName: "Airbus SAS",
            siret: "12345678901234"
        }
    });

    console.log("✅ Registre synchronisé : Catalogue Particulier & Professionnel opérationnel !");
}

main()
    .catch((e) => { console.error('❌ Erreur de remplissage :', e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });