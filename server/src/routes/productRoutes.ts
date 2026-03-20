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

// --- 🎓 CURSUS (avant /:id pour éviter le shadowing) ---
router.get('/workshops', optionalAuth, getWorkshops);
router.post('/workshops', authenticateToken, isAdmin, upload.single('image'), createWorkshop);

// --- 👤 COMPTE (avant /:id pour éviter le shadowing) ---
router.get('/me', authenticateToken, getMe);

// --- 🛍️ CATALOGUE ---
router.get('/', optionalAuth, getShopProducts);
router.post('/', authenticateToken, isAdmin, upload.single('image'), createProduct);
router.get('/:id', optionalAuth, getProductById);

export default router;