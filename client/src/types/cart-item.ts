interface CartItem {
    cartId: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    workshopId?: string;
    volumeId?: string;
    level?: number; // 🏺 Ajout du niveau pour l'Atelier Conception
    participants?: { firstName: string; lastName: string; phone: string }[];
}
