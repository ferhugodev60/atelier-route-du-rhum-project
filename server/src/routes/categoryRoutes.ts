import { Router } from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getCategories);
router.post('/', authenticateToken, isAdmin, createCategory);
router.put('/:id', authenticateToken, isAdmin, updateCategory); // Nouvelle route
router.delete('/:id', authenticateToken, isAdmin, deleteCategory);

export default router;