import { Router } from 'express';
import {
    getOrders,
    getOrderDetails,
    updateOrderStatus,
    downloadOrderPDF,
    createOrder,
    updateParticipantStatus, addManualParticipant
} from '../controllers/orderController';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware';
import { validate } from '../middleware/validator';
import { orderSchema } from "../schemas/shopSchemas";

const router = Router();

/**
 * --- 🏛️ GESTION ADMINISTRATIVE (Maison) ---
 */
// Liste globale ou personnelle selon le rôle
router.get('/', authenticateToken, getOrders);

// Dossier détaillé (Admin ou Propriétaire de la commande)
router.get('/:id', authenticateToken, getOrderDetails);

// Mise à jour du statut logistique (Admin uniquement)
router.patch('/:id/status', authenticateToken, isAdmin, updateOrderStatus);

/**
 * 🏺 ÉMARGEMENT INDIVIDUEL (Cohortes Pro)
 * Correction des erreurs TS2304 et TS2552
 */
router.patch(
    '/participants/:participantId/status',
    authenticateToken,
    isAdmin,
    updateParticipantStatus
);

router.post('/items/participants/manual', authenticateToken, isAdmin, addManualParticipant);

/**
 * --- 👤 SERVICES CLIENTS ---
 */
router.get('/:orderId/download', authenticateToken, downloadOrderPDF);

router.post(
    '/',
    authenticateToken,
    validate(orderSchema),
    createOrder
);

export default router;