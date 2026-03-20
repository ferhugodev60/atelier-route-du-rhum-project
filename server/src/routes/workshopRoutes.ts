import { Router } from 'express';
import {
    getWorkshops,
    getWorkshopById,
    getWorkshopBySlug,
    createWorkshop,
    updateWorkshop,
    deleteWorkshop
} from '../controllers/workshopController';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware';
import { upload } from '../config/cloudinary';

const router = Router();

// --- 📋 ACCÈS PUBLIC ---
router.get('/', getWorkshops);

// Routes sémantiques (avant /:id pour éviter le shadowing)
router.get('/decouverte', getWorkshopBySlug);
router.get('/conception/:level', getWorkshopBySlug);

router.get('/:id', getWorkshopById);

// --- ⚖️ ACCÈS ADMINISTRATIF ---
// Scellage des nouveaux paliers ou modification du Registre
router.post('/', authenticateToken, isAdmin, upload.single('image'), createWorkshop);
router.put('/:id', authenticateToken, isAdmin, upload.single('image'), updateWorkshop);
router.delete('/:id', authenticateToken, isAdmin, deleteWorkshop);

export default router;