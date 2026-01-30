import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Accès refusé. Token manquant." });
    }

    try {
        // On assigne directement le résultat du verify (casté avec l'ID) à req.user
        // Cela supprime la variable intermédiaire "decoded"
        req.user = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

        next();
    } catch (error) {
        res.status(403).json({ error: "Token invalide ou expiré." });
    }
};