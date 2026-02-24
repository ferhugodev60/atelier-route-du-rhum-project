import { Router } from 'express';
import {
    getMe,
    updateMe,
    getAllUsers,
    getUserDetails,
    updateUserProfile,
    validateUserLevel,
    verifyMemberCode // 🏺 Nouveau : Contrôle des prérequis techniques
} from '../controllers/userController';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware';

const router = Router();

// --- 👤 ROUTES CLIENTS (Auto-gestion et Validation) ---
router.get('/me', authenticateToken, getMe);
router.patch('/me', authenticateToken, updateMe);

/**
 * 🏺 Vérification du Code Passeport
 * Cette route permet de valider l'existence d'un membre et son palier technique
 * avant la confirmation d'une séance de formation.
 */
router.get('/verify/:code', authenticateToken, verifyMemberCode);

// --- 🏛️ ROUTES ADMINISTRATION (Gestion du Registre) ---
router.get('/', authenticateToken, isAdmin, getAllUsers);
router.get('/:id', authenticateToken, isAdmin, getUserDetails);
router.put('/:id', authenticateToken, isAdmin, updateUserProfile);

/**
 * 🏺 Validation de palier technique
 * Permet à l'administrateur de certifier le passage à un niveau supérieur
 * au sein du cursus de conception.
 */
router.patch('/:userId/level', authenticateToken, isAdmin, validateUserLevel);

export default router;