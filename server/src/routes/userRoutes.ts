import { Router } from 'express';
import { getMe, updateMe } from '../controllers/userController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

/**
 * @route   GET /api/users/me
 * @desc    Récupérer les informations de l'utilisateur (inclut le conceptionLevel)
 * @access  Privé (User)
 */
router.get('/me', authenticateToken, getMe);

/**
 * @route   PATCH /api/users/me
 * @desc    Mettre à jour les informations de profil (Prénom, Nom, Téléphone)
 * @access  Privé (User)
 * @note    Le contrôleur doit empêcher la modification du rôle ou du niveau
 */
router.patch('/me', authenticateToken, updateMe);

export default router;