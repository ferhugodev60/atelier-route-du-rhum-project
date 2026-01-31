import { Router } from 'express';
// 🏺 On importe précisément les fonctions depuis le contrôleur
import { register, login } from '../controllers/authController';

const router = Router();

// On s'assure que 'register' et 'login' existent bien avant de les passer à router
if (!register || !login) {
    console.error("❌ ERREUR CRITIQUE : Les fonctions login ou register sont undefined !");
}

router.post('/register', register);
router.post('/login', login);

export default router;