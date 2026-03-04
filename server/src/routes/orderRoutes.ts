import { Router } from 'express';
import {
    getOrders,
    getOrderCountByLevel,
    getOrderDetails,
    updateOrderStatus,
    downloadOrderPDF,
    createOrder,
    updateParticipantStatus,
    addManualParticipant
} from '../controllers/orderController';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware';
import { validate } from '../middleware/validator';
import { orderSchema } from "../schemas/shopSchemas";

const router = Router();

/**
 * --- 🏛️ SERVICES DE VÉRIFICATION ---
 */
// 🏺 Route certifiée pour valider le palier technique (25 initial / 10 recharge)
// Doit impérativement être placée avant la route /:id pour éviter les conflits de routage.
router.get('/check-level/:level', authenticateToken, getOrderCountByLevel);

/**
 * --- 🏛️ GESTION ADMINISTRATIVE (Maison) ---
 */
// Liste globale ou personnelle selon le rôle au Registre
router.get('/', authenticateToken, getOrders);

// Dossier détaillé (Admin ou Propriétaire du dossier de vente)
router.get('/:id', authenticateToken, getOrderDetails);

// Mise à jour du statut logistique (Admin uniquement)
router.patch('/:id/status', authenticateToken, isAdmin, updateOrderStatus);

/**
 * 🏺 ÉMARGEMENT INDIVIDUEL (Cohortes Pro)
 * Gestion des slots de certification technique.
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
// Téléchargement du justificatif certifié (Passeport ou QR Codes)
router.get('/:orderId/download', authenticateToken, downloadOrderPDF);

router.post(
    '/',
    authenticateToken,
    validate(orderSchema),
    createOrder
);

export default router;