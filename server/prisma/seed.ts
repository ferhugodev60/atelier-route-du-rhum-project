import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const prisma = new PrismaClient();

/**
 * 🏺 Génération du Code Passeport Membre certifié
 * Format : RR-26-XXXX
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

    console.log('--- 📦 Référencement des Produits ---');
    await prisma.product.create({
        data: {
            name: "Café Gingembre",
            description: "Café Gingembre Caramel, rhum agricole",
            image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1470&auto=format&fit=crop",
            categoryId: catRhum.id,
            volumes: {
                create: [
                    { size: 50, unit: " Centilitres", price: 39.0, stock: 5 },
                ]
            }
        }
    });

    await prisma.product.create({
        data: {
            name: "Citron Vert Gingembre",
            description: "Citron Vert Gingembre Vanille menthe blanche canne à sucre, rhum agricole",
            image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1470&auto=format&fit=crop",
            categoryId: catRhum.id,
            volumes: {
                create: [
                    { size: 50, unit: " Centilitres", price: 39.0, stock: 5 },
                ]
            }
        }
    });

    await prisma.product.create({
        data: {
            name: "PIMENT-TIMUT",
            description: "Piment de Guadeloupe Cardamome poivre timut kumquat vanille sucre de canne, rhum agricole",
            image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1470&auto=format&fit=crop",
            categoryId: catRhum.id,
            volumes: {
                create: [
                    { size: 50, unit: " Centilitres", price: 39.0, stock: 5 },
                ]
            }
        }
    });

    await prisma.product.create({
        data: {
            name: "Carotte fruit du dragon",
            description: "Carotte fruit du dragon rouge citron vert sucre de canne, rhum agricole",
            image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1470&auto=format&fit=crop",
            categoryId: catRhum.id,
            volumes: {
                create: [
                    { size: 50, unit: " Centilitres", price: 39.0, stock: 5 },
                ]
            }
        }
    });

    await prisma.product.create({
        data: {
            name: "DRAGON-GOJI",
            description: "Fruit du dragon rouge ananas pains de sucre baie de goji sucre de canne, rhum agricole",
            image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1470&auto=format&fit=crop",
            categoryId: catRhum.id,
            volumes: {
                create: [
                    { size: 50, unit: " Centilitres", price: 39.0, stock: 5 },
                ]
            }
        }
    });

    await prisma.product.create({
        data: {
            name: "Banane-choco",
            description: "Banane chocolat vanille caramel, rhum agricole",
            image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1470&auto=format&fit=crop",
            categoryId: catRhum.id,
            volumes: {
                create: [
                    { size: 50, unit: " Centilitres", price: 39.0, stock: 5 },
                ]
            }
        }
    });

    console.log('--- 🎓 Déploiement du Cursus ---');
    const trainingModules = [
        {
            level: 0, title: "L'Atelier Découverte",
            price: 60.0, priceInst: 50.0,
            format: "1h30 d'analyse sensorielle guidée.",
            duration: "1h30",
            availability: "Du mardi au samedi, valable 30 jours après achat",
            quote: "Découverte du label avec un forum question/réponse et la mise à disposition d'une demie palette de rhum. Valable 30 jours après achat.",
            fullDescription: "Une immersion complète dans l'univers de l'Établissement. Apprenez les bases de la dégustation et découvrez l'histoire de notre savoir-faire à travers une analyse sensorielle guidée.",
            image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweo5UfygpC2S3i2AcaG73QxtyKrYrc4qGgUdGOTE0MDr6qCTw3Qw9xiZH95KWQOv4RWrSa_UrJgYAuEzFWEGGNxR7QhX0RX1l2Rn7pkhdxv0yBl2E1GdywRvYYE9y7cXyYv0q_Zw2yJJGak=s680-w680-h510-rw"
        },
        {
            level: 1, title: "L'Atelier Fruits",
            price: 140.0, priceInst: 120.0,
            color: "#2f7700",
            format: "2h30 d'ingénierie aromatique, incluant une bouteille d'un litre.",
            duration: "2h30",
            availability: "Du mardi au samedi, valable 6 mois après achat.",
            quote: "Maîtrise des acides de fruits.",
            fullDescription: "Maîtrisez l'équilibre des saveurs fruitées. De la sélection des fruits frais à la mise en macération, scellez votre premier flacon sous l'œil de l'expert.",
            image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1470&auto=format&fit=crop"
        },
        {
            level: 2, title: "L'Atelier Épices",
            price: 170.0, priceInst: 150.0,
            color: "#be5aff",
            format: "3h de formation avancée avec accès à l'épisothèque.",
            duration: "3h00",
            availability: "Du mardi au samedi, valable 6 mois après achat.",
            quote: "Architecture et structure des nectars complexes.",
            fullDescription: "Explorez la profondeur des épices du monde. Un module technique pour comprendre la structure, la chaleur et la longueur en bouche de vos créations.",
            image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1470&auto=format&fit=crop"
        },
        {
            level: 3, title: "L'Atelier Plantes",
            price: 210.0, priceInst: 190.0,
            color: "#009bf3",
            format: "4h d'immersion botanique et florale.",
            duration: "4h00",
            availability: "Du mardi au samedi, valable 6 mois après achat.",
            quote: "Exploration des notes de tête et des extraits végétaux.",
            fullDescription: "L'art de la botanique appliquée. Apprenez à travailler les fleurs, les herbes et les extraits végétaux pour des nectars d'une élégance et d'une fraîcheur rares.",
            image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1470&auto=format&fit=crop"
        },
        {
            level: 4, title: "L'Atelier XXL Mixologie",
            price: 420.0, priceInst: 400.0,
            color: "#80070D",
            format: "8h de perfectionnement technique, incluant le déjeuner.",
            duration: "8h00",
            availability: "Du mardi au jeudi, valable 6 mois après achat.",
            quote: "L'art ultime du service et de la composition complexe.",
            fullDescription: "Le sommet de l'expertise de l'Établissement. Une journée entière pour maîtriser les compositions les plus complexes et l'art du service de prestige.",
            image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1470&auto=format&fit=crop"
        }
    ];

    for (const mod of trainingModules) {
        await prisma.workshop.create({
            data: {
                level: mod.level,
                type: "PARTICULIER",
                title: mod.title,
                description: "Atelier technique certifié par l'Établissement.",
                fullDescription: mod.fullDescription, // 🏺 Synchronisé avec le Registre
                image: mod.image,
                quote: mod.quote,
                format: mod.format,
                duration: mod.duration,
                availability: mod.availability,
                color: mod.color || null,
                price: mod.price,
                priceInstitutional: mod.priceInst
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
            phone: "0768976012",
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
            phone: "0768976012",
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
            email: "ce@chanel.com",
            phone: "0768976012",
            memberCode: generateMemberCode(),
            password: proPassword,
            firstName: "Lucas",
            lastName: "Martin",
            role: "PRO",
            companyName: "CHANEL",
            siret: "54205276600087"
        }
    });

    await prisma.user.create({
        data: {
            email: "ferreira.hugo602@gmail.com",
            phone: "0768976012",
            memberCode: generateMemberCode(),
            password: defaultPassword,
            firstName: "Hugo",
            lastName: "FERREIRA",
            role: "USER",
            isEmployee: true,
            companyName: "Analis Finance",
            siret: "12345678901234"
        }
    });

    console.log("✅ Registre consolidé et synchronisé !");
}

main()
    .catch((e) => { console.error('❌ Échec de la synchronisation :', e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });