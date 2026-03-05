// src/types/cart-item.ts

export interface CartItem {
    cartId: string;
    id?: string; // 🏺 ID technique workshop ou produit
    name: string;
    price: number;
    image?: string;
    quantity: number;

    // 🏺 SCELLAGE DU TITRE DE CURSUS
    type?: string;   // "GIFT_CARD" ou null
    amount?: number; // Valeur faciale du titre

    workshopId?: string;
    volumeId?: string;
    level?: number;

    // 🏺 ATTRIBUTS INSTITUTIONNELS
    isBusiness?: boolean; // 🏺 AJOUT : Pour le scellage des contrats PRO / CE

    // 🏺 Données de tarification pour l'affichage
    originalPrice?: number; // Prix public pour affichage
    isDiscounted?: boolean; // Indicateur d'avantage membre -10%

    // 🏺 Typage complet des participants
    participants?: {
        firstName: string;
        lastName: string;
        phone: string;
        email?: string;
        memberCode?: string; // Indispensable pour le scellage du Cursus
    }[];
}