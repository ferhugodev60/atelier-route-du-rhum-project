import { Router } from 'express';
import {
    getMe,
    updateMe,
    getAllUsers,
    updateUserProfile,
    validateUserLevel
} from '../controllers/userController';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware';

const router = Router();

/**
 * --- 👤 ROUTES CLIENTS ---
 */
router.get('/me', authenticateToken, getMe);
router.patch('/me', authenticateToken, updateMe);

/**
 * --- 🏛️ ROUTES ADMINISTRATION ---
 */

// Consultation globale de la clientèle
router.get('/', authenticateToken, isAdmin, getAllUsers);

// Mise à jour complète d'une fiche client
router.put('/:id', authenticateToken, isAdmin, updateUserProfile);

// Validation rapide de la progression pédagogique
router.patch('/:userId/level', authenticateToken, isAdmin, validateUserLevel);

export default router;