import { z } from 'zod';

/**
 * Schéma pour l'inscription d'un nouvel utilisateur
 */
export const registerSchema = z.object({
    body: z.object({
        email: z.string().email("Format d'email invalide"),
        password: z.string().min(8, "Le mot de passe doit faire 8 caractères minimum"),
        firstName: z.string().min(2, "Le prénom est trop court"),
        lastName: z.string().min(2, "Le nom est trop court"),
        phone: z.string().optional()
    })
});

/**
 * Schéma pour la création d'une commande
 */
export const orderSchema = z.object({
    body: z.object({
        items: z.array(z.object({
            workshopId: z.string().uuid().optional(),
            volumeId: z.string().uuid().optional(),
            quantity: z.number().int().positive("La quantité doit être supérieure à 0"),
            participants: z.array(z.object({
                firstName: z.string().min(2, "Prénom trop court"),
                lastName: z.string().min(2, "Nom trop court"),
                phone: z.string().min(10, "Numéro de téléphone invalide")
            })).optional()
        })).min(1, "Le panier ne peut pas être vide")
    })
});