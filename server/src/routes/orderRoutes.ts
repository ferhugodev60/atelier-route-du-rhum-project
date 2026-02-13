import { Router } from 'express';
import { getUserOrders, createOrder, downloadOrderPDF } from '../controllers/orderController';
import { authenticateToken } from '../middleware/authMiddleware';
import { validate } from '../middleware/validator';
import { orderSchema } from "../schemas/shopSchemas";

const router = Router();

router.get('/', authenticateToken, getUserOrders);
router.get('/:orderId/download', authenticateToken, downloadOrderPDF); // Route PDF

router.post(
    '/',
    authenticateToken,
    validate(orderSchema),
    createOrder
);

export default router;