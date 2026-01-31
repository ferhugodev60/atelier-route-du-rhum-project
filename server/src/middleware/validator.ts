import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';

/**
 * Middleware de validation universel
 */
export const validate = (schema: ZodSchema) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            return next();
        } catch (error) {
            // Utilisation du type guard de Zod
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    error: "Données invalides",
                    // 🏺 Correction TS2339 : On utilise .issues
                    // 🏺 Correction TS7006 : On type l'itérateur (issue)
                    details: error.issues.map((issue: z.ZodIssue) => ({
                        path: issue.path[1] || issue.path[0],
                        message: issue.message
                    }))
                });
            }
            return res.status(500).json({ error: "Erreur interne lors de la validation." });
        }
    };