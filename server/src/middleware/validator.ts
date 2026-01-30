import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, z } from 'zod';

// Middleware générique pour valider n'importe quel schéma Zod
export const validate = (schema: AnyZodObject) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            return next();
        } catch (error) {
            return res.status(400).json(error);
        }
    };

// --- TES SCHÉMAS DE SÉCURITÉ ---

export const registerSchema = z.object({
    body: z.object({
        email: z.string().email("Format d'email invalide"),
        password: z.string().min(8, "Le mot de passe doit faire 8 caractères minimum"),
        firstName: z.string().min(2),
        lastName: z.string().min(2),
        phone: z.string().optional()
    })
});

export const orderSchema = z.object({
    body: z.object({
        items: z.array(z.object({
            productId: z.string(),
            quantity: z.number().int().positive("La quantité doit être supérieure à 0")
        })).min(1, "Le panier ne peut pas être vide")
    })
});