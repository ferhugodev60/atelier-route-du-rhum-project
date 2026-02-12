import { Router } from 'express';
import { createCheckoutSession, handleWebhook } from '../controllers/checkoutController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/create-session', authenticateToken, createCheckoutSession);

// 🏺 Route appelée par Stripe directement
router.post('/webhook', handleWebhook);

export default router;