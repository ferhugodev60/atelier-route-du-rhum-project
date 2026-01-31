import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import router from "./routes";

const app = express();

// 1. SÉCURITÉ HELMET (Assouplie pour le dev local)
app.use(helmet({
    crossOriginResourcePolicy: false,
}));

// 2. CONFIGURATION CORS (La plus stable)
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// 3. LOGGER (Pour confirmer que le signal passe)
app.use((req, res, next) => {
    console.log(`🏺 [${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

// 4. ROUTES
app.use("/api", router);

// Route de test directe
app.get("/api/health", (req, res) => {
    res.json({ status: "success", message: "L'alambic répond sur le port 5001 !" });
});

// 5. GESTION DES ERREURS
app.use((err: any, req: any, res: any, next: any) => {
    console.error("❌ Erreur interceptée :", err.message);
    res.status(500).json({ error: "Erreur interne" });
});

const PORT: number = Number(process.env.PORT) || 5001;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`--- 🏺 L'Atelier de la Route du Rhum ---`);
    console.log(`✅ Serveur débloqué sur : http://localhost:${PORT}`);
});