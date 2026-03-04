import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path"; // 🏺 AJOUT : Pour la gestion des chemins système
import router from "./routes";

const app = express();

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
 * Doit impérativement rester AVANT express.json()
 */
app.use('/api/checkout/webhook', express.raw({ type: 'application/json' }));

// --- MIDDLEWARES DE PARSING ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * 🏺 ACCÈS AUX RÉSOURCES STATIQUES
 * Permet au serveur de servir les images locales si Cloudinary fait défaut
 * ou pour les justificatifs PDF temporaires.
 */
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// 3. LOGGER DE MAINTENANCE
app.use((req, res, next) => {
    console.log(`📡 [${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

// 4. ROUTES DU REGISTRE
app.use("/api", router);

// Route de diagnostic
app.get("/api/health", (req, res) => {
    res.json({ status: "success", message: "Le serveur est opérationnel." });
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