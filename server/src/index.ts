import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/authRoutes'; // Ajoute cet import
import orderRoutes from './routes/orderRoutes'; // Ajoute cet import

dotenv.config();

export const prisma = new PrismaClient(); // Exporté pour être utilisé par les contrôleurs

const app = express();
app.use(cors());
app.use(express.json());

// Points d'entrée de ton API
app.use('/api/auth', authRoutes);
app.use('/api', orderRoutes);

app.get('/api/health', (req, res) => {
    res.json({ message: "L'alambic du serveur est prêt !" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🏺 Serveur démarré sur http://localhost:${PORT}`);
});