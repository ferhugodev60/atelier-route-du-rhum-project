import { Router } from 'express';
// Import des contrôleurs spécialisés
import { getShopProducts, createProduct } from '../controllers/productController';
import { getWorkshops, createWorkshop } from '../controllers/workshopController';
import { getMe } from '../controllers/userController';

// Import de la sécurité et du stockage
import { authenticateToken, isAdmin } from '../middleware/authMiddleware';
import { upload } from '../config/cloudinary';

const router = Router();

// --- 🛍️ BOUTIQUE (Bouteilles, Vrac, Dame-Jeanne) ---
// Récupérer le catalogue des bouteilles avec leurs volumes
router.get('/products', getShopProducts);

// Créer une nouvelle bouteille (Admin uniquement)
router.post(
    '/products',
    authenticateToken,
    isAdmin,
    upload.single('image'),
    createProduct
);

// --- 🎓 ATELIERS (Découverte et Conception) ---
// Récupérer le parcours pédagogique ordonné par niveau
router.get('/workshops', getWorkshops);

// Créer un nouvel atelier (Admin uniquement)
router.post(
    '/workshops',
    authenticateToken,
    isAdmin,
    upload.single('image'),
    createWorkshop
);

// --- 👤 UTILISATEUR ---
// Voir son profil et sa progression (conceptionLevel)
router.get('/me', authenticateToken, getMe);

export default router;