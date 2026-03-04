export interface ProductVolume {
    id: string;
    size: number;
    unit: string;
    price: number; // 🏺 Prix final (remisé si isDiscounted est vrai)
    stock: number;
    originalPrice?: number; // Prix public d'origine pour l'affichage barré
    isDiscounted?: boolean; // Indicateur de remise certifiée par le Passeport
}

export interface Category {
    id: string;
    name: string;
    description?: string;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    image: string;
    categoryId: string;
    category: Category;
    volumes: ProductVolume[];
}