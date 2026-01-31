import { Router } from 'express';
import { updateMe } from '../controllers/userController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Route : /api/users/me
router.patch('/me', authenticateToken, updateMe);

export default router;