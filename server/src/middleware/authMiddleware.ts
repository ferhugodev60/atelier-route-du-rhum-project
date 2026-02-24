import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

/**
 * Structure de l'identité numérique au sein du Registre
 */
interface UserPayload {
    userId: string;
    role: string;
}

/**
 * Extension des propriétés de la requête Express
 * Permet de transporter l'identité du membre à travers les différentes strates logicielles.
 */
declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}

/**
 * Authentification par jeton sécurisé (JWT)
 * Vérifie la validité du Passeport numérique présenté dans les en-têtes de la requête.
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Authentification requise. Accès au Registre refusé." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;

        // Sécurité supplémentaire : On s'assure que le jeton contient bien les informations vitales
        if (!decoded.userId) {
            throw new Error("Identifiant manquant dans le jeton.");
        }

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ error: "Session expirée ou certificat invalide." });
    }
};

/**
 * Validation des privilèges de direction
 * Doit être impérativement invoqué après authenticateToken.
 */
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === 'ADMIN') {
        next();
    } else {
        res.status(403).json({ error: "Privilèges insuffisants. Accès réservé à la direction." });
    }
};