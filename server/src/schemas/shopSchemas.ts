import { z } from 'zod';

/**
 * 🏺 REGISTRE DES MEMBRES (Inscription)
 * Intègre les champs nécessaires aux profils PRO et Institutionnels.
 */
export const registerSchema = z.object({
    body: z.object({
        email: z.string().email("Format d'email invalide"),
        password: z.string().min(8, "Le mot de passe doit comporter 8 caractères minimum"),
        firstName: z.string().min(2, "Le prénom est trop court"),
        lastName: z.string().min(2, "Le nom est trop court"),
        phone: z.string().regex(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/, "Format de téléphone invalide"),
        // Optionnel : Pour les futurs membres PRO
        companyName: z.string().optional(),
    })
});

/**
 * 🏺 REGISTRE DES COMMANDES (Validation du Panier)
 * Force l'identification par Code Passeport pour les cursus certifiés.
 */
export const orderSchema = z.object({
    body: z.object({
        items: z.array(z.object({
            workshopId: z.string().uuid("Identifiant de séance invalide").optional(),
            volumeId: z.string().uuid("Identifiant de flacon invalide").optional(),
            quantity: z.number().int().positive("La quantité doit être supérieure à 0"),

            // 🏺 Identification des bénéficiaires
            participants: z.array(z.object({
                firstName: z.string().min(2, "Prénom requis"),
                lastName: z.string().min(2, "Nom requis"),
                email: z.string().email("Email requis").optional(),
                phone: z.string().optional(),
                // 🏺 Le Code Passeport devient le pivot de la validation technique
                memberCode: z.string()
                    .length(10, "Le code membre doit comporter exactement 10 caractères")
                    .regex(/^[A-Z0-9-]+$/, "Format de code invalide")
                    .optional()
            })).optional()
        })).min(1, "Le panier technique ne peut pas être vide")
    })
});