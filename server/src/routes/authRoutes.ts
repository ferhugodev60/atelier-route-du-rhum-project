import { Router } from 'express';
import { register, login, changePassword } from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware'; // Assure-toi que ce middleware existe

const router = Router();

if (!register || !login || !changePassword) {
    console.error("❌ ERREUR CRITIQUE : Une fonction du contrôleur auth est undefined !");
}

router.post('/register', register);
router.post('/login', login);

// Route pour changer le mot de passe (Protégée)
router.patch('/change-password', authenticateToken, changePassword);

export default router;