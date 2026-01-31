import { Router } from 'express';
import {
    getStats,
    validateUserLevel,
    updateProductStock
} from '../controllers/adminController';
import { createProduct } from '../controllers/productController';
import { createWorkshop } from '../controllers/workshopController';

// Utilisation du middleware de sécurité que nous avons consolidé
import { authenticateToken, isAdmin } from '../middleware/authMiddleware';
import { upload } from '../config/cloudinary';

const router = Router();

/**
 * 🛡️ PROTECTION GLOBALE
 * Toutes les routes ci-dessous exigent un Token valide ET le rôle ADMIN.
 */
router.use(authenticateToken, isAdmin);

// --- 📈 TABLEAU DE BORD ---
// Récupérer les statistiques (Ventes, utilisateurs, stocks critiques)
router.get('/stats', getStats);

// --- 📦 GESTION DU CATALOGUE ---
// Ajouter une bouteille (avec gestion Multer pour l'image)
router.post('/products', upload.single('image'), createProduct);

// Ajouter un atelier (avec couleur et image Cloudinary)
router.post('/workshops', upload.single('image'), createWorkshop);

// Mettre à jour les stocks d'un volume spécifique
router.patch('/products/stock/:volumeId', updateProductStock);

// --- 🎓 SUIVI DES ÉLÈVES ---
// Valider manuellement le passage au niveau supérieur d'un utilisateur
router.patch('/users/:userId/level', validateUserLevel);

export default router;