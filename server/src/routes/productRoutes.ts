import { Router } from 'express';
import { getShopProducts, createProduct } from '../controllers/productController';
import { getWorkshops, createWorkshop } from '../controllers/workshopController';
import { getMe } from '../controllers/userController';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware';
import { upload } from '../config/cloudinary';

const router = Router();

// --- 🛍️ CATALOGUE PRODUITS ---
// Accessible via GET /api/products
router.get('/', getShopProducts);

// Accessible via POST /api/products
router.post(
    '/',
    authenticateToken,
    isAdmin,
    upload.single('image'), // Gestion du fichier via Cloudinary
    createProduct
);

// --- 🎓 FORMATIONS PROFESSIONNELLES ---
// Accessible via GET /api/products/workshops
router.get('/workshops', getWorkshops);

// Accessible via POST /api/products/workshops
router.post(
    '/workshops',
    authenticateToken,
    isAdmin,
    upload.single('image'),
    createWorkshop
);

// --- 👤 ESPACE PERSONNEL ---
// Accessible via GET /api/products/me
router.get('/me', authenticateToken, getMe);

export default router;