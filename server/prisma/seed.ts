import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const prisma = new PrismaClient();

/**
 * 🏺 Génération du Code Passeport Membre certifié
 * Format : RR-26-XXXX [cite: 2026-02-12]
 */
const generateMemberCode = () => {
    const year = "26";
    const random = crypto.randomBytes(2).toString('hex').toUpperCase();
    return `RR-${year}-${random}`;
};

async function main() {
    console.log('--- 🧹 Purge du Registre technique ---');
    await prisma.participant.deleteMany();
    await prisma.companyGroup.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.productVolume.deleteMany();
    await prisma.product.deleteMany();
    await prisma.workshop.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    console.log('--- 🏷️ Configuration des Catégories ---');
    const catRhum = await prisma.category.create({
        data: {
            name: "Rhum arrangé",
            description: "Préparations artisanales avec fruits entiers. Potentiel de macération prolongée.",
            image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1470&auto=format&fit=crop"
        }
    });

    const catVrac = await prisma.category.create({
        data: {
            name: "Vrac",
            description: "Sélections prêtes à la dégustation immédiate, sans résidus solides.",
            image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1470&auto=format&fit=crop"
        }
    });

    const catDame = await prisma.category.create({
        data: {
            name: "Location de Dame-Jeanne",
            description: "Prestations événementielles de prestige en grands formats.",
            image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1470&auto=format&fit=crop"
        }
    });

    console.log('--- 📦 Référencement des Produits ---');
    await prisma.product.create({
        data: {
            name: "Ananas & Vanille",
            description: "Macération solaire optimisée pour un rempotage cyclique.",
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
            description: "Infusion intense filtrée pour une structure aromatique limpide.",
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

    console.log('--- 🎓 Déploiement du Cursus (Modèle de Tarification Duale) ---');
    /**
     * 🏺 Centralisation sur 5 séances.
     * Le champ 'price' sert au public, 'priceInstitutional' au profil PRO/CE.
     */
    const trainingModules = [
        {
            level: 0, title: "L'Atelier Découverte",
            price: 60.0, priceInst: 50.0,
            format: "1h30 d'analyse sensorielle guidée.",
            quote: "Premiers pas dans l'univers technique du label.",
            image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweo5UfygpC2S3i2AcaG73QxtyKrYrc4qGgUdGOTE0MDr6qCTw3Qw9xiZH95KWQOv4RWrSa_UrJgYAuEzFWEGGNxR7QhX0RX1l2Rn7pkhdxv0yBl2E1GdywRvYYE9y7cXyYv0q_Zw2yJJGak=s680-w680-h510-rw"
        },
        {
            level: 1, title: "L'Atelier Fruits",
            price: 140.0, priceInst: 120.0,
            color: "#2f7700",
            format: "2h30 d'ingénierie aromatique, incluant une unité d'un litre.",
            quote: "Maîtrise des équilibres et des acides de fruits.",
            image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1470&auto=format&fit=crop"
        },
        {
            level: 2, title: "L'Atelier Épices",
            price: 170.0, priceInst: 150.0,
            color: "#be5aff",
            format: "3h de formation avancée avec accès à l'épisothèque.",
            quote: "Architecture et structure des nectars complexes.",
            image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1470&auto=format&fit=crop"
        },
        {
            level: 3, title: "L'Atelier Plantes",
            price: 210.0, priceInst: 190.0,
            color: "#009bf3",
            format: "4h d'immersion botanique et florale.",
            quote: "Exploration des notes de tête et des extraits végétaux.",
            image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1470&auto=format&fit=crop"
        },
        {
            level: 4, title: "L'Atelier Mixologie",
            price: 420.0, priceInst: 400.0,
            color: "#80070D",
            format: "8h de perfectionnement technique, incluant le déjeuner de travail.",
            quote: "L'art ultime du service et de la composition complexe.",
            image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1470&auto=format&fit=crop"
        }
    ];

    for (const mod of trainingModules) {
        await prisma.workshop.create({
            data: {
                level: mod.level,
                type: "PARTICULIER",
                title: mod.title,
                description: "Module de formation technique certifié par l'Établissement.",
                image: mod.image,
                quote: mod.quote,
                format: mod.format,
                color: mod.color || null,
                price: mod.price,
                priceInstitutional: mod.priceInst // 🏺 Protection du flux Stripe
            }
        });
    }

    console.log('--- 👤 Certification des Comptes Membres ---');
    const defaultPassword = await bcrypt.hash('rhum2026', 10);
    const proPassword = await bcrypt.hash('ce2026', 10);

    // Direction (Admin)
    await prisma.user.create({
        data: {
            email: "hugo@atelier.com",
            memberCode: generateMemberCode(),
            password: defaultPassword,
            firstName: "Hugo",
            lastName: "Frr",
            role: "ADMIN"
        }
    });

    // Membre Standard (User)
    await prisma.user.create({
        data: {
            email: "jean.dupont@exemple.com",
            memberCode: generateMemberCode(),
            password: defaultPassword,
            firstName: "Jean",
            lastName: "Dupont",
            role: "USER"
        }
    });

    // Partenaire Institutionnel (PRO)
    await prisma.user.create({
        data: {
            email: "ce@airbus.com",
            memberCode: generateMemberCode(),
            password: proPassword,
            firstName: "Responsable",
            lastName: "CE Airbus",
            role: "PRO",
            companyName: "Airbus SAS",
            siret: "12345678901234"
        }
    });

    console.log("✅ Registre consolidé et synchronisé !");
}

main()
    .catch((e) => { console.error('❌ Échec de la synchronisation :', e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });