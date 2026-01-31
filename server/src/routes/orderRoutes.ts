import { Router } from 'express';
import { getUserOrders, createOrder } from '../controllers/orderController';

const router = Router();

// URL finale : GET http://localhost:5001/api/orders
router.get('/', getUserOrders);

// URL finale : POST http://localhost:5001/api/orders
router.post('/', createOrder);

export default router;