import { Router } from 'express';
import {
    getStats,
    getAllUsers,
    validateUserLevel,
    updateProductStock,
    updateProduct,
    deleteProduct,
    updateCategory
} from '../controllers/adminController';

import { updateWorkshop, deleteWorkshop } from '../controllers/workshopController';

import {
    getOrders,
    getOrderDetails,
    updateOrderStatus
} from '../controllers/orderController';

import { createProduct } from '../controllers/productController';
import { createWorkshop } from '../controllers/workshopController';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware';
import { upload } from '../config/cloudinary';

const router = Router();

/**
 * 🛡️ GARDE DU REGISTRE
 * Ce périmètre est strictement réservé à la direction certifiée.
 */
router.use(authenticateToken, isAdmin);

// --- 📈 ANALYSE D'ACTIVITÉ (Dashboard) ---
router.get('/stats', getStats);

// --- 👥 RÉPERTOIRE DES MEMBRES ---
router.get('/users', getAllUsers);
router.patch('/users/:userId/level', validateUserLevel);

// --- 📦 GESTION DES RÉFÉRENCES (Boutique) ---
router.post('/products', upload.single('image'), createProduct);
router.put('/products/:id', upload.single('image'), updateProduct);
router.delete('/products/:id', deleteProduct);
router.patch('/products/stock/:volumeId', updateProductStock);

// --- 🏷️ GESTION DES COLLECTIONS (Interface Boutique) ---
router.put('/categories/:id', upload.single('image'), updateCategory);

// --- 🎓 ARCHITECTURE DU CURSUS (Séances) ---
router.post('/workshops', upload.single('image'), createWorkshop);
router.put('/workshops/:id', upload.single('image'), updateWorkshop); // 🏺 Modification certifiée
router.delete('/workshops/:id', deleteWorkshop); // 🏺 Suppression du Registre

// --- 🧾 JOURNAL DES VENTES (Dossiers) ---
router.get('/orders', getOrders); // 🏺 Vue exhaustive des transactions
router.get('/orders/:id', getOrderDetails); // 🏺 Audit granulaire d'un dossier
router.patch('/orders/:id/status', updateOrderStatus); // 🏺 Validation manuelle/Certification

export default router;