/**
 * 🏺 REGISTRE DES CURSUS ET ATELIERS
 * Définition technique des modules de formation de l'Établissement.
 */
export interface Workshop {
    id: string;
    level: number;
    type: 'PARTICULIER' | 'ENTREPRISE';
    title: string;
    description: string;      // Description courte (liste)
    fullDescription?: string; // 🏺 Nouveau : Narration détaillée pour la page "Savoir plus"
    image: string;
    price: number;
    priceInstitutional: number;
    format: string;           // Contenu technique de la séance
    duration?: string;        // 🏺 Nouveau : Durée scellée (ex: "2h30")
    availability?: string;    // Validité du titre (ex: "6 mois")
    quote?: string;
    color?: string;
}