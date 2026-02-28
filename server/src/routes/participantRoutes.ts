import { Router } from 'express';
import * as participantController from '../controllers/participantController';

const router = Router();

// 🏺 Route publique de scellage (appelée par le PDF)
router.post('/validate/:id', participantController.validateParticipantFromPDF);

export default router;