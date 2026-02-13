import { Router } from 'express';
import { createProduct, getShopProducts } from '../controllers/productController';
import { createWorkshop, getWorkshops } from '../controllers/workshopController';
import { getMe } from '../controllers/userController';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware';
import { upload } from '../config/cloudinary';

const router = Router();

// Routes catalogue
router.get('/products', getShopProducts);
router.post('/products', authenticateToken, isAdmin, upload.single('image'), createProduct);

// Routes formations
router.get('/workshops', getWorkshops);
router.post('/workshops', authenticateToken, isAdmin, upload.single('image'), createWorkshop);

// Profil utilisateur
router.get('/users/me', authenticateToken, getMe);

export default router;