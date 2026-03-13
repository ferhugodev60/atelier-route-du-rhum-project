import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import router from "./routes";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

// 1. SÉCURITÉ INSTITUTIONNELLE
app.use(helmet({
    crossOriginResourcePolicy: false,
}));

// 2. CONFIGURATION CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

/**
 * 🏺 WEBHOOK STRIPE
 */
app.use('/api/checkout/webhook', express.raw({ type: 'application/json' }));

// --- MIDDLEWARES DE PARSING ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// 3. LOGGER DE MAINTENANCE
app.use((req, res, next) => {
    console.log(`📡 [${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

// 4. ROUTES DU REGISTRE
app.use("/api", router);

// Route de diagnostic simple
app.get("/api/health", (req, res) => {
    res.json({ status: "success", message: "Le serveur est opérationnel." });
});

/**
 * 🏺 ROUTE DE TEST DU REGISTRE DE DONNÉES
 * À utiliser pour identifier pourquoi la boutique reste vide.
 */
app.get("/api/test-db", async (req, res) => {
    try {
        // Tentative de connexion et de comptage simple
        await prisma.$connect();
        const count = await prisma.product.count();
        res.json({
            status: "success",
            message: "Liaison avec la base de données scellée.",
            productsInDatabase: count
        });
    } catch (err: any) {
        console.error("❌ Erreur de liaison DB :", err.message);
        res.status(500).json({
            status: "error",
            message: "Le Registre est inaccessible.",
            technicalError: err.message,
            hint: "Vérifiez la variable DATABASE_URL sur Railway."
        });
    } finally {
        await prisma.$disconnect();
    }
});

// 5. GESTION DES ERREURS CRITIQUES
app.use((err: any, req: any, res: any, next: any) => {
    console.error("❌ Incident détecté :", err.message);
    res.status(500).json({ error: "Erreur interne du système." });
});

const PORT: number = Number(process.env.PORT) || 5001;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`--- 📜 SYSTÈME DE GESTION DE L'ÉTABLISSEMENT ---`);
    console.log(`✅ Infrastructure scellée sur le port : ${PORT}`);
});