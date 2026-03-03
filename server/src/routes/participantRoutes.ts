import { Router } from 'express';
import * as participantController from '../controllers/participantController';

const router = Router();

/**
 * 🏺 ROUTE DE SCELLAGE PUBLIQUE
 * Point d'entrée unique pour la validation des QR Codes issus des PDF.
 * Cette route déclenche la création ou la réparation automatique de compte.
 */
router.post('/validate/:id', participantController.validateParticipantFromPDF);

/**
 * 📜 EXTRACTION DU CERTIFICAT INDIVIDUEL
 * Permet au participant de récupérer son titre de présence officiel
 * contenant son Code Client après la validation de sa Séance.
 */
router.get('/certification-pdf/:id', participantController.downloadCertificationPDF);

export default router;