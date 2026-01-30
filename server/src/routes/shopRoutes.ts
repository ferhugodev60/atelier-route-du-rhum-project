import { Router } from 'express';
import { getAllProducts, getShopProducts, getWorkshops } from '../controllers/productController';
import { getMe } from '../controllers/userController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/products', getAllProducts);
router.get('/products/shop', getShopProducts);
router.get('/products/workshops', getWorkshops);

// Route protégée : il faut être connecté pour voir son profil
router.get('/users/me', authenticateToken, getMe);

export default router;