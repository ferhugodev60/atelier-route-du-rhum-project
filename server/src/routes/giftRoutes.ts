import { Router } from 'express';
import {
    createGiftCard,
    validateGiftCode,
    searchGiftCards,
    debitGiftCardManually
} from '../controllers/giftController';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware';

const router = Router();

/**
 * 🏺 GÉNÉRATION DE TITRE (ADMIN)
 * Création manuelle d'un titre au porteur ou rattaché à un client.
 */
router.post('/', authenticateToken, isAdmin, createGiftCard);

/**
 * 🏺 RECHERCHE PAR SUFFIXE (ADMIN)
 * Permet de localiser un titre via les derniers caractères (ex: /api/gift-cards/search?suffix=A2B3)
 */
router.get('/search', authenticateToken, isAdmin, searchGiftCards);

/**
 * 🏺 DÉBIT PHYSIQUE (ADMIN)
 * Régularisation manuelle d'une dépense effectuée à l'Établissement.
 */
router.post('/:code/debit', authenticateToken, isAdmin, debitGiftCardManually);

/**
 * 🏺 CONTRÔLE DE VALIDITÉ (PUBLIC / CLIENT)
 * Vérification du solde avant application dans le tunnel d'achat.
 */
router.post('/validate', validateGiftCode);

export default router;