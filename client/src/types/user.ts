/**
 * Interface globale pour l'utilisateur
 * Centralisée pour éviter les erreurs de propriétés manquantes (lastName, phone, etc.)
 */
export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    role: 'USER' | 'ADMIN';
    conceptionLevel: number;
    createdAt?: string;
}

/**
 * Interface pour les mises à jour de profil (utilisée dans ProfileInfo)
 */
export interface UserProfileUpdate {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}