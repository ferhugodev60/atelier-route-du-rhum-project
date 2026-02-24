import { Router } from 'express';
import { register, login, changePassword } from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// --- 👤 ACCÈS ET INSCRIPTION ---
router.post('/register', register);
router.post('/login', login);

/**
 * 🏺 Modification du mot de passe
 * Nécessite une authentification valide pour accéder au registre
 */
router.patch('/change-password', authenticateToken, changePassword);

export default router;