import { Router } from 'express';
import { addProduct, updateProduct, getStats, validateUserLevel } from '../controllers/adminController';
import { authenticateToken } from '../middleware/authMiddleware';
import { isAdmin } from '../middleware/adminMiddleware';

const router = Router();

// Protection globale du groupe de routes
router.use(authenticateToken, isAdmin);

router.post('/products', addProduct);
router.put('/products/:id', updateProduct);
router.get('/stats', getStats);
router.patch('/users/:userId/level', validateUserLevel);

export default router;