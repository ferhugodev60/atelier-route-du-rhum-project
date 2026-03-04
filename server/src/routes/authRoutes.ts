import { Router } from 'express';
import { register, login, changePassword, setupFinalPassword } from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// --- 👤 ACCÈS ET INSCRIPTION ---
router.post('/register', register);
router.post('/login', login);

/**
 * 🏺 SCELLAGE DU SECRET PERSONNEL
 * Route publique permettant de définir son mot de passe via le jeton reçu par email.
 * Cette étape finalise l'inscription "Zéro Friction" après le scan du QR Code.
 */
router.post('/setup-final-password', setupFinalPassword);

/**
 * 🏺 MODIFICATION DU MOT DE PASSE (Connecté)
 * Nécessite une authentification valide pour accéder au registre et modifier son secret.
 */
router.patch('/change-password', authenticateToken, changePassword);

export default router;