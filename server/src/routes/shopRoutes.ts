import { Router } from 'express';
// On sépare les imports pour plus de clarté
import { createProduct, getShopProducts } from '../controllers/productController';
import { createWorkshop, getWorkshops } from '../controllers/workshopController';
import { getMe } from '../controllers/userController';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware';
import { upload } from '../config/cloudinary';

const router = Router();

// --- 🛍️ ROUTES BOUTIQUE (Bouteilles, Vrac, Dame-Jeanne) ---
router.get('/products', getShopProducts);

// Route Admin pour créer un produit (avec upload d'image et multi-volumes)
router.post('/products', authenticateToken, isAdmin, upload.single('image'), createProduct);


// --- 🎓 ROUTES ATELIERS (Découverte et Conception) ---
router.get('/workshops', getWorkshops);

// Route Admin pour créer un atelier (avec couleur et image)
router.post('/workshops', authenticateToken, isAdmin, upload.single('image'), createWorkshop);


// --- 👤 ROUTES UTILISATEURS ---
router.get('/users/me', authenticateToken, getMe);

export default router;