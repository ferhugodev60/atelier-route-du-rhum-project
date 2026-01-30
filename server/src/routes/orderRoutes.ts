import { Router } from 'express';
import { createOrder } from '../controllers/orderController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// On place le middleware AVANT le contrôleur
// La requête passe par authenticateToken, puis si OK, va vers createOrder
router.post('/orders', authenticateToken, createOrder);

export default router;