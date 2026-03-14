import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { getShopProducts, getProductById, createProduct } from '../controllers/productController';
import { getWorkshops, createWorkshop } from '../controllers/workshopController';
import { getMe } from '../controllers/userController';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware';
import { upload } from '../config/cloudinary';

const router = Router();

const optionalAuth = (req: any, res: any, next: any) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (token) {
        try {
            req.user = jwt.verify(token, process.env.JWT_SECRET!) as any;
        } catch {}
    }
    next();
};

// --- 🛍️ CATALOGUE ---
router.get('/', optionalAuth, getShopProducts);
router.get('/:id', optionalAuth, getProductById); // 🏺 Route pour la page détail SEO

router.post('/', authenticateToken, isAdmin, upload.single('image'), createProduct);

// --- 🎓 CURSUS ---
router.get('/workshops', optionalAuth, getWorkshops);
router.post('/workshops', authenticateToken, isAdmin, upload.single('image'), createWorkshop);

// --- 👤 COMPTE ---
router.get('/me', authenticateToken, getMe);

export default router;