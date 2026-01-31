import { Router } from 'express';
import { getUserOrders, createOrder } from '../controllers/orderController';
import { authenticateToken } from '../middleware/authMiddleware';
import { validate } from '../middleware/validator';
import {orderSchema} from "../schemas/shopSchemas";

const router = Router();

/**
 * @route   GET /api/orders
 */
router.get('/', authenticateToken, getUserOrders);

/**
 * @route   POST /api/orders
 * @note    Ajout du middleware de validation avant le contrôleur
 */
router.post(
    '/',
    authenticateToken,
    validate(orderSchema), // 🏺 Le verrou de sécurité est ici
    createOrder
);

export default router;