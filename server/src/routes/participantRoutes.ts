import { Router } from 'express';
import * as participantController from '../controllers/participantController';

const router = Router();

/**
 * 🏺 ROUTE DE SCELLAGE PUBLIQUE
 * Point d'entrée unique pour la validation des QR Codes issus des PDF.
 * Cette route déclenche la création automatique de compte "Zéro Friction".
 */
router.post('/validate/:id', participantController.validateParticipantFromPDF);

export default router;