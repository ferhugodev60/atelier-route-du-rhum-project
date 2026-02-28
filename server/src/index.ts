import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import router from "./routes";

const app = express();

// 1. SÉCURITÉ INSTITUTIONNELLE
app.use(helmet({
    crossOriginResourcePolicy: false,
}));

// 2. CONFIGURATION CORS (Stabilité Production)
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

/**
 * 🏺 WEBHOOK STRIPE
 * Intercepte les signaux bruts avant tout parsing JSON.
 */
app.use('/api/checkout/webhook', express.raw({ type: 'application/json' }));

// --- MIDDLEWARES DE PARSING ---
app.use(express.json());

/**
 * 🏺 RÉCEPTION FORMULAIRE PDF (Option A)
 * Crucial : Permet de lire les données envoyées par le bouton "Valider" du PDF.
 */
app.use(express.urlencoded({ extended: true }));

// 3. LOGGER DE MAINTENANCE
app.use((req, res, next) => {
    console.log(`📡 [${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

// 4. ROUTES DU REGISTRE
app.use("/api", router);

// Route de diagnostic
app.get("/api/health", (req, res) => {
    res.json({ status: "success", message: "Le serveur opérationnel." });
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