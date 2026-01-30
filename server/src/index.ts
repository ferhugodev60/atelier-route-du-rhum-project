import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import * as dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Importation des routes
import authRoutes from './routes/authRoutes';
import orderRoutes from './routes/orderRoutes';
import shopRoutes from './routes/shopRoutes';
import adminRoutes from './routes/adminRoutes'; // Ajouté pour ton back-office

dotenv.config();

// Exportation de l'instance Prisma
export const prisma = new PrismaClient();

const app = express();

/* --- 🛡️ COUCHE DE SÉCURITÉ RÉSEAU --- */

// 1. Blindage des headers HTTP (Protection contre XSS, sniffing, etc.)
app.use(helmet());

// 2. Limitation du trafic (Anti-Brute Force / Anti-DoS)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limite chaque IP à 100 requêtes par fenêtre
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Trop de requêtes. L'alambic a besoin de souffler, réessayez dans 15 minutes." }
});
app.use('/api/', limiter);

// 3. Configuration CORS restrictive
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Autorise uniquement ton Front
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
}));

// 4. Limitation de la taille des données entrantes (Anti-Payload trop lourd)
app.use(express.json({ limit: '10kb' }));

/* --- 🛣️ ROUTES DE L'API --- */

app.use('/api/auth', authRoutes);
app.use('/api', orderRoutes);
app.use('/api', shopRoutes);
app.use('/api/admin', adminRoutes);

// Test de santé (Health Check)
app.get('/api/health', (req: Request, res: Response) => {
    res.json({
        status: "success",
        message: "L'alambic est scellé et opérationnel.",
        timestamp: new Date().toISOString()
    });
});

/* --- 🚨 GESTIONNAIRE D'ERREURS GLOBAL --- */

// Capture toutes les erreurs non gérées pour éviter de faire fuiter des infos techniques
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(`[ERREUR SERVEUR] ${new Date().toISOString()}:`, err.stack);

    res.status(500).json({
        error: "Une erreur interne est survenue. Nos alchimistes sont sur le coup."
    });
});

/* --- 🚀 LANCEMENT --- */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`--- 🏺 L'Atelier de la Route du Rhum ---`);
    console.log(`✅ Serveur sécurisé : http://localhost:${PORT}`);
    console.log(`🛡️  Protection Helmet & Rate-Limit : Activée`);
});