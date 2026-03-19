/**
 * 🏛️ REGISTRE DE L'IDENTITÉ NUMÉRIQUE
 * Interface centrale garantissant l'intégrité des données au sein de l'Établissement.
 * Version : 2.0 - Intégration du Scellage Google et de la Qualification de Profil.
 */
export interface User {
    id: string;
    email: string;

    /** 🏺 Sceau Google : Identifiant unique si le membre utilise la connexion sociale */
    googleId?: string | null;

    firstName: string;
    lastName: string;

    /** 🏺 Matricule certifié par l'Établissement (Format : RR-26-XXXX) */
    memberCode: string | null;
    phone?: string | null;

    /** 🏺 Rang Institutionnel */
    role: 'USER' | 'PRO' | 'ADMIN';

    /** 🛡️ État de Qualification : Définit si le membre a validé son rang (Lambda/Pro) */
    isProfileComplete: boolean;

    /** 🏺 Statut CSE : Identifie le particulier rattaché à une entité partenaire */
    isEmployee: boolean;

    /** 🏺 Attributs Professionnels (Certifiés pour les PRO ou les bénéficiaires CSE) */
    companyName?: string | null;
    siret?: string | null; // Registre de 14 chiffres

    /** 🏺 Niveau de l'Espace de conception actuellement validé */
    conceptionLevel: number;

    createdAt?: string;
}

/**
 * 🏛️ PROTOCOLE DE MISE À JOUR DU PROFIL
 * Permet au membre de rectifier ses informations au Registre.
 * Note : Le Matricule (memberCode) et l'ID Google restent immuables.
 */
export interface UserProfileUpdate {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;

    /** 🏺 Champs de qualification (Accessibles si le membre souhaite certifier son rang PRO) */
    companyName?: string | null;
    siret?: string | null;
}