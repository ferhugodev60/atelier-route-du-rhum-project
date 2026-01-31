import { Router } from 'express';
import { getUserOrders, createOrder } from '../controllers/orderController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// URL : http://localhost:5001/api/orders
// On protège les routes pour injecter req.user.userId
router.get('/', authenticateToken, getUserOrders);
router.post('/', authenticateToken, createOrder);

export default router;