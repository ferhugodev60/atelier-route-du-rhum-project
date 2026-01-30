import * as express from 'express';

declare global {
    namespace Express {
        interface Request {
            // On définit ici ce qu'on ajoute à l'objet Request
            user?: { userId: string };
        }
    }
}