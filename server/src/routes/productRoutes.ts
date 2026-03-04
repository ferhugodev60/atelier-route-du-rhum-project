import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { getShopProducts, createProduct } from '../controllers/productController';
import { getWorkshops, createWorkshop } from '../controllers/workshopController';
import { getMe } from '../controllers/userController';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware';
import { upload } from '../config/cloudinary';

const router = Router();

/**
 * 🏺 MIDDLEWARE D'IDENTIFICATION OPTIONNELLE
 * Permet au Registre de reconnaître le membre (PRO/CE) pour appliquer
 * les tarifs préférentiels, sans bloquer l'accès au public.
 */
const optionalAuth = (req: any, res: any, next: any) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (token) {
        try {
            req.user = jwt.verify(token, process.env.JWT_SECRET!) as any;
        } catch {
        }
    }
    next();
};

// --- 🛍️ CATALOGUE PRODUITS ---
// 🏺 MODIFICATION : Identification du membre pour activer les -10%
router.get('/', optionalAuth, getShopProducts);

router.post(
    '/',
    authenticateToken,
    isAdmin,
    upload.single('image'),
    createProduct
);

// --- 🎓 CURSUS PROFESSIONNELS ---
// 🏺 MODIFICATION : Identification du membre pour les tarifs Cursus institutionnels
router.get('/workshops', optionalAuth, getWorkshops);

router.post(
    '/workshops',
    authenticateToken,
    isAdmin,
    upload.single('image'),
    createWorkshop
);

// --- 👤 ESPACE PERSONNEL ---
router.get('/me', authenticateToken, getMe);

export default router;