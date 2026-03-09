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
 * 🏺 SÉCURISATION DU SECRET (Fail-Safe)
 * On s'assure que le serveur ne tourne pas "à l'aveugle" sans secret valide.
 */
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.error("❌ [ERREUR CRITIQUE] JWT_SECRET est manquant dans le Registre (.env).");
}

/**
 * Authentification par jeton sécurisé (JWT)
 * Vérifie la validité du Passeport numérique présenté dans les en-têtes de la requête.
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];

    // 🏺 Vérification stricte du format : "Bearer <token>"
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            error: "Accès refusé. Certificat d'identité manquant ou mal formé."
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        // On utilise l'assertion seulement après avoir vérifié la présence du secret au démarrage
        const decoded = jwt.verify(token, JWT_SECRET!) as UserPayload;

        if (!decoded.userId || !decoded.role) {
            return res.status(403).json({ error: "Certificat incomplet. Accès révoqué." });
        }

        // On scelle l'identité dans la requête pour les fichiers suivants
        req.user = decoded;
        next();
    } catch (error: any) {
        // 🏺 Distinction entre expiration et falsification pour les logs
        const message = error.name === 'TokenExpiredError'
            ? "Session expirée."
            : "Certificat invalide ou corrompu.";

        return res.status(403).json({ error: message });
    }
};

/**
 * Validation des privilèges de direction
 * Doit être impérativement invoqué après authenticateToken.
 */
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    // On s'appuie sur l'identité scellée par authenticateToken
    if (req.user && req.user.role === 'ADMIN') {
        next();
    } else {
        res.status(403).json({
            error: "Privilèges insuffisants. Accès réservé à la direction de l'établissement."
        });
    }
};