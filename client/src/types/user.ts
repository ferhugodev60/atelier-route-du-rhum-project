/**
 * 🏛️ Interface globale pour le membre
 * Centralisée pour garantir l'intégrité des données au sein du Cursus.
 * Mise à jour : Intégration du volet Professionnel (CE).
 */
export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    /** 🏺 Identifiant unique certifié par l'établissement (ex: RR-26-XXXX) */
    memberCode: string;
    phone?: string | null;

    /** 🏺 Statut au sein de l'Établissement */
    role: 'USER' | 'PRO' | 'ADMIN';

    /** 🏺 Attributs Professionnels (Optionnels pour les particuliers) */
    companyName?: string | null;
    siret?: string | null; // Format certifié de 14 chiffres

    /** 🏺 Palier technique actuel validé par le membre [cite: 2026-02-12] */
    conceptionLevel: number;
    createdAt?: string;
}

/**
 * 🏛️ Interface pour les mises à jour de profil
 * Note : Le memberCode et le SIRET sont exclus car ils sont immuables après certification par le Registre.
 */
export interface UserProfileUpdate {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    companyName?: string;
}