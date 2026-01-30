import { Router } from 'express';
import { register, login } from '../controllers/authController';
import { validate, registerSchema } from '../middleware/validator';

const router = Router();

// On valide les données AVANT de lancer la fonction register
router.post('/register', validate(registerSchema), register);
router.post('/login', login);

export default router;