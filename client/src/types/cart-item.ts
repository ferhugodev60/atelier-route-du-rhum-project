export interface CartItem {
    cartId: string;
    name: string;
    price: number; // 🏺 Prix final scellé (remisé si éligible)
    image: string;
    quantity: number;
    workshopId?: string;
    volumeId?: string;

    // 🏺 Nomenclature institutionnelle [cite: 2026-02-12]
    level?: number; // Niveau requis pour le Cursus Conception

    // 🏺 Données de tarification pour l'affichage
    originalPrice?: number; // Prix public pour affichage barré dans le panier
    isDiscounted?: boolean; // Indicateur d'avantage membre -10%

    // 🏺 Typage complet des participants
    participants?: {
        firstName: string;
        lastName: string;
        phone: string;
        email?: string;
        memberCode?: string; // Indispensable pour le scellage du Cursus Conception
    }[];
}