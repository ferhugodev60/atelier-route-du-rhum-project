// server/src/middleware/validator.ts
import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';

/**
 * Middleware de validation universel
 * Scelle et réinjecte les données certifiées dans le flux Express.
 */
export const validate = (schema: ZodSchema) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            // 🏺 SCELLAGE : On force le type en sortie pour autoriser l'accès aux propriétés
            const parsedData = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            }) as { body: any; query: any; params: any }; // Certification explicite

            // 🏺 RÉINJECTION : On écrase les objets par les versions nettoyées
            req.body = parsedData.body;
            req.query = parsedData.query;
            req.params = parsedData.params;

            return next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    error: "Données invalides au Registre",
                    details: error.issues.map((issue: z.ZodIssue) => ({
                        path: issue.path[1] || issue.path[0],
                        message: issue.message
                    }))
                });
            }
            return res.status(500).json({ error: "Erreur interne de contrôle." });
        }
    };