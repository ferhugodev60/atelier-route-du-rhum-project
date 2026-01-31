import { Router } from 'express';
import { getAllProducts, getShopProducts, getWorkshops, createProduct } from '../controllers/productController';
import { upload } from '../config/cloudinary';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getAllProducts);
router.get('/shop', getShopProducts);
router.get('/workshops', getWorkshops);

// Création réservée aux admins (à coupler avec un middleware isAdmin plus tard)
router.post('/', authenticateToken, upload.single('image'), createProduct);

export default router;