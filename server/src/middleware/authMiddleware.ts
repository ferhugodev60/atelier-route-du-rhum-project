import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// 🏺 Extension de l'interface Request pour TypeScript
interface UserPayload {
    userId: string;
    role: string; // On ajoute le rôle ici
}

// On étend le type Request d'Express pour inclure notre utilisateur
declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}

/**
 * Middleware de vérification du Token
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Accès refusé. Token manquant." });
    }

    try {
        // On décode le token et on l'assigne à req.user
        req.user = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;
        next();
    } catch (error) {
        res.status(403).json({ error: "Token invalide ou expiré." });
    }
};

/**
 * Middleware de vérification du Rôle Admin
 * À utiliser APRÈS authenticateToken dans vos routes
 */
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    // On vérifie si l'utilisateur injecté par le premier middleware est un ADMIN
    if (req.user && req.user.role === 'ADMIN') {
        next();
    } else {
        res.status(403).json({ error: "Accès interdit. Droits administrateur requis." });
    }
};