import * as express from 'express';

declare global {
    namespace Express {
        interface Request {
            // 🏺 On ajoute le rôle pour que isAdmin puisse fonctionner sans erreur TS
            user?: {
                userId: string;
                role: string;
                isEmployee?: boolean;
            };
        }
    }
}