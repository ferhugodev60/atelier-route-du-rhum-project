/**
 * 🏛️ Interface globale pour le membre
 * Centralisée pour garantir l'intégrité des données au sein du Cursus.
 */
export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    /** 🏺 Identifiant unique certifié par l'établissement (ex: RR-26-XXXX) */
    memberCode: string;
    phone?: string | null;
    role: 'USER' | 'ADMIN';
    /** 🏺 Palier technique actuel validé par le membre [cite: 2026-02-12] */
    conceptionLevel: number;
    createdAt?: string;
}

/**
 * 🏛️ Interface pour les mises à jour de profil
 * Note : Le memberCode est exclu car il est immuable et géré par le Registre.
 */
export interface UserProfileUpdate {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}