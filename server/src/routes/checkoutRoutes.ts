import { Router } from 'express';
import { createCheckoutSession, handleWebhook } from '../controllers/checkoutController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

/**
 * 📜 PROTOCOLE DE PAIEMENT
 * Nécessite une identification pour lier la commande au dossier utilisateur.
 */
router.post('/create-session', authenticateToken, createCheckoutSession);

/**
 * 🏺 WEBHOOK STRIPE (PUBLIC)
 * Canal de communication direct entre Stripe et votre Registre.
 * Déclenche le scellage des places (25/10) après succès du paiement.
 */
router.post('/webhook', handleWebhook);

export default router;