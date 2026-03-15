import { Router } from 'express';
import {
    getWorkshops,
    getWorkshopById, // 🏺 Nouvelle importation
    createWorkshop,
    updateWorkshop,
    deleteWorkshop
} from '../controllers/workshopController';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware';
import { upload } from '../config/cloudinary';

const router = Router();

// --- 📋 ACCÈS PUBLIC ---
// Pour l'affichage de la liste globale des cursus
router.get('/', getWorkshops);

// 🏺 ESSENTIEL : Pour alimenter la page "Détails" (Savoir plus)
router.get('/:id', getWorkshopById);

// --- ⚖️ ACCÈS ADMINISTRATIF ---
// Scellage des nouveaux paliers ou modification du Registre
router.post('/', authenticateToken, isAdmin, upload.single('image'), createWorkshop);
router.put('/:id', authenticateToken, isAdmin, upload.single('image'), updateWorkshop);
router.delete('/:id', authenticateToken, isAdmin, deleteWorkshop);

export default router;