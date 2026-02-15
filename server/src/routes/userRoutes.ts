import { Router } from 'express';
import {
    getMe,
    updateMe,
    getAllUsers,
    getUserDetails,
    updateUserProfile,
    validateUserLevel
} from '../controllers/userController';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware';

const router = Router();

// --- 👤 ROUTES CLIENTS ---
router.get('/me', authenticateToken, getMe);
router.patch('/me', authenticateToken, updateMe);

// --- 🏛️ ROUTES ADMINISTRATION ---
router.get('/', authenticateToken, isAdmin, getAllUsers);
router.get('/:id', authenticateToken, isAdmin, getUserDetails); // 🏺 Accès au dossier complet
router.put('/:id', authenticateToken, isAdmin, updateUserProfile);
router.patch('/:userId/level', authenticateToken, isAdmin, validateUserLevel);

export default router;