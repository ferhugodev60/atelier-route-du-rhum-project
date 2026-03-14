import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from "../types/cart-item.ts";

interface CartState {
    items: CartItem[];
    isCartOpen: boolean;
    setCartOpen: (open: boolean) => void;
    addItem: (product: any, detail: any, qty: number) => void;
    removeItem: (cartId: string) => void;
    clearCart: () => void;
}

/**
 * 🏺 REGISTRE DU PANIER (ZUSTAND)
 * Gère le scellage des articles et la vérification stricte des stocks.
 */
export const useCartStore = create<CartState>()(
    persist(
        (set) => ({
            items: [],
            isCartOpen: false,

            setCartOpen: (open) => set({ isCartOpen: open }),

            /**
             * 🏺 AJOUT AU REGISTRE DU PANIER
             * Inclut désormais une vérification de sécurité contre la sur-vente.
             */
            addItem: (product, detail, qty) => set((state) => {
                const uniqueId = detail.cartId || detail.id;
                const existing = state.items.find(i => i.cartId === uniqueId);

                // 🏺 Extraction de la limite du Registre (stock)
                // Pour les produits, detail.stock est utilisé. Pour les ateliers, on peut considérer un stock infini ou spécifique.
                const totalStock = detail.stock !== undefined ? detail.stock : 999;

                if (existing) {
                    // 🏺 Calcul de la nouvelle quantité plafonnée par le stock disponible
                    const newQuantity = Math.min(existing.quantity + qty, totalStock);

                    return {
                        items: state.items.map(i => i.cartId === uniqueId
                            ? { ...i, quantity: newQuantity }
                            : i
                        ),
                        isCartOpen: true
                    };
                }

                // 🏺 Création d'une nouvelle entrée certifiée avec scellage du stock
                const newItem: CartItem = {
                    cartId: uniqueId,
                    stock: totalStock, // 🏺 Archivage de la limite pour contrôles futurs
                    name: product
                        ? `${product.name} (${detail.size}${detail.unit})`
                        : (detail.name || detail.title),

                    price: detail.price,
                    originalPrice: detail.originalPrice || detail.price,
                    isDiscounted: !!detail.isDiscounted,

                    image: product?.image || detail.image,
                    quantity: Math.min(qty, totalStock), // Sécurité dès l'insertion

                    type: detail.type,
                    amount: detail.amount,
                    isBusiness: !!detail.isBusiness,

                    workshopId: !product ? (detail.workshopId || detail.id) : undefined,
                    volumeId: product ? detail.id : undefined,

                    level: detail.level,
                    participants: detail.participants || []
                };

                return { items: [...state.items, newItem], isCartOpen: true };
            }),

            removeItem: (cartId) => set((state) => ({
                items: state.items.filter(i => i.cartId !== cartId)
            })),

            clearCart: () => set({ items: [] }),
        }),
        {
            name: 'rhum-session-cart',
        }
    )
);