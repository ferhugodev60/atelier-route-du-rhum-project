import { Request, Response, NextFunction } from 'express';

/**
 * Middleware isAdmin
 * Ce middleware part du principe que authenticateToken a déjà été exécuté
 * et a injecté le rôle dans req.user.
 */
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    // 1. On vérifie si l'utilisateur est présent et s'il a le rôle ADMIN
    if (req.user && req.user.role === 'ADMIN') {
        return next(); // Tout est bon, on passe à la suite
    }

    // 2. Sinon, on bloque l'accès immédiatement
    console.warn(`🚫 [SECURITY] Tentative d'accès Admin refusée pour l'ID : ${req.user?.userId}`);
    return res.status(403).json({
        error: "Accès interdit. Droits administrateur requis pour cette opération."
    });
};