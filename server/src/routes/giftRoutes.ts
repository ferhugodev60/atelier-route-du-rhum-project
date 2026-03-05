import { Router } from 'express';
import { createGiftCard, validateGiftCode } from '../controllers/giftController';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware';

const router = Router();

/**
 * 🏺 GÉNÉRATION DE TITRE (ADMIN)
 * Seule la direction peut sceller manuellement de nouveaux titres
 * au sein du Registre sans passer par le tunnel Stripe.
 */
router.post('/', authenticateToken, isAdmin, createGiftCard);

/**
 * 🏺 CONTRÔLE DE VALIDITÉ (PUBLIC / CLIENT)
 * Permet de vérifier le solde et la caducité (12 mois) d'un code
 * avant son application sur un Dossier de Vente.
 */
router.post('/validate', validateGiftCode);

export default router;