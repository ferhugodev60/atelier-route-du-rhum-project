import { Router } from 'express';
import { getShopProducts, createProduct } from '../controllers/productController';
import { getWorkshops, createWorkshop } from '../controllers/workshopController';
import { getMe } from '../controllers/userController';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware';
import { upload } from '../config/cloudinary';

const router = Router();

// --- 🛍️ CATALOGUE PRODUITS ---
router.get('/products', getShopProducts);

router.post(
    '/products',
    authenticateToken,
    isAdmin,
    upload.single('image'), // Champ 'image' attendu dans le FormData
    createProduct
);

// --- 🎓 FORMATIONS PROFESSIONNELLES ---
router.get('/workshops', getWorkshops);

router.post(
    '/workshops',
    authenticateToken,
    isAdmin,
    upload.single('image'), // Champ 'image' attendu dans le FormData
    createWorkshop
);

// --- 👤 ESPACE PERSONNEL ---
router.get('/me', authenticateToken, getMe);

export default router;