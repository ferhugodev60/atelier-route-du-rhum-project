// server/src/routes/workshopRoutes.ts
import { Router } from 'express';
import { getWorkshops, createWorkshop, updateWorkshop, deleteWorkshop } from '../controllers/workshopController';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware';
import { upload } from '../config/cloudinary';

const router = Router();

// Public : pour l'affichage sur le site
router.get('/', getWorkshops);

// Privé : pour la gestion administrative
router.post('/', authenticateToken, isAdmin, upload.single('image'), createWorkshop);
router.put('/:id', authenticateToken, isAdmin, upload.single('image'), updateWorkshop);
router.delete('/:id', authenticateToken, isAdmin, deleteWorkshop);

export default router;