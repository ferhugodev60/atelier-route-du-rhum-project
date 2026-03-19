import { Router } from 'express';
import {
    register,
    login,
    googleLogin,
    completeProfile,
    changePassword,
    setupFinalPassword
} from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

/**
 * --- 👤 ACCÈS STANDARDS ---
 * Inscription et connexion via le protocole classique Email/Mot de passe.
 */
router.post('/register', register);
router.post('/login', login);

/**
 * --- 🌐 ACCÈS SOCIAUX (GOOGLE) ---
 * Identification via le sceau Google. Gère la liaison de comptes automatique.
 */
router.post('/google', googleLogin);

/**
 * --- 🏺 QUALIFICATION DU PROFIL ---
 * Route cruciale pour les nouveaux membres Google.
 * Permet de définir si le compte est LAMBDA ou PRO (SIRET/CSE) pour sceller le profil.
 * Nécessite un jeton valide mais un profil encore "incomplet".
 */
router.post('/complete-profile', authenticateToken, completeProfile);

/**
 * --- 🔑 GESTION DES SECRETS (Mots de passe) ---
 */

/**
 * SCELLAGE DU SECRET PERSONNEL
 * Route publique pour définir le mot de passe via un jeton (QR Code ou Réinitialisation).
 */
router.post('/setup-final-password', setupFinalPassword);

/**
 * MODIFICATION DU SECRET (Connecté)
 * Nécessite une authentification valide pour modifier son secret au Registre.
 */
router.patch('/change-password', authenticateToken, changePassword);

export default router;