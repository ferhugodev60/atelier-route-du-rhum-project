import { Router } from 'express';
import {
    getStats,
    validateUserLevel,
    updateProductStock,
    updateProduct,
    deleteProduct
} from '../controllers/adminController';
import { createProduct } from '../controllers/productController';
import { createWorkshop } from '../controllers/workshopController';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware';
import { upload } from '../config/cloudinary';

const router = Router();

// 🛡️ Sécurité : Seul l'admin accède à ces routes
router.use(authenticateToken, isAdmin);

// --- 📈 DASHBOARD ---
router.get('/stats', getStats);

// --- 🛍️ GESTION BOUTIQUE ---
router.post('/products', upload.single('image'), createProduct); // Ajouter
router.put('/products/:id', upload.single('image'), updateProduct); // Modifier (texte + image)
router.delete('/products/:id', deleteProduct); // Supprimer
router.patch('/products/stock/:volumeId', updateProductStock); // Ajuster stock

// --- 🎓 GESTION FORMATIONS ---
router.post('/workshops', upload.single('image'), createWorkshop);

// --- 👤 ÉLÈVES ---
router.patch('/users/:userId/level', validateUserLevel);

export default router;