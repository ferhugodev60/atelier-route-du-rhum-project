/**
 * 🏛️ Interface globale pour le membre
 * Centralisée pour garantir l'intégrité des données au sein du Cursus.
 * Mise à jour : Intégration du statut Bénéficiaire CE et du volet Professionnel.
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

    /** 🏺 Nouveau : Identifie le particulier rattaché à un Comité d'Entreprise */
    isEmployee: boolean;

    /** 🏺 Attributs Professionnels (Remplis pour les PRO ou les salariés bénéficiaires) */
    companyName?: string | null;
    siret?: string | null; // Format certifié de 14 chiffres

    /** 🏺 Palier technique actuel validé par le membre */
    conceptionLevel: number;
    createdAt?: string;
}

/**
 * 🏛️ Interface pour les mises à jour de profil
 * Note : Le memberCode reste immuable.
 * Le SIRET et la Raison Sociale sont inclus pour permettre au salarié de corriger son rattachement.
 */
export interface UserProfileUpdate {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    companyName?: string | null;
    siret?: string | null;
}