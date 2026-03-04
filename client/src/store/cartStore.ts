import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {CartItem} from "../types/cart-item.ts";

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
 * Gère le scellage des articles, qu'il s'agisse de Cursus ou de Flacons Boutique.
 */
export const useCartStore = create<CartState>()(
    persist(
        (set) => ({
            items: [],
            isCartOpen: false,

            setCartOpen: (open) => set({ isCartOpen: open }),

            /**
             * 🏺 AJOUT AU REGISTRE DU PANIER
             * Capture automatiquement les tarifs préférentiels et les données de Cursus.
             */
            addItem: (product, detail, qty) => set((state) => {
                const uniqueId = detail.cartId || detail.id;
                const existing = state.items.find(i => i.cartId === uniqueId);

                // 🏺 Mise à jour du volume si la référence est déjà scellée
                if (existing) {
                    return {
                        items: state.items.map(i => i.cartId === uniqueId
                            ? { ...i, quantity: i.quantity + qty }
                            : i
                        ),
                        isCartOpen: true
                    };
                }

                // 🏺 Création d'une nouvelle entrée certifiée
                const newItem: CartItem = {
                    cartId: uniqueId,
                    name: product
                        ? `${product.name} (${detail.size}${detail.unit})`
                        : (detail.name || detail.title),

                    // 🏺 Scellage des prix (Final et Original pour affichage)
                    price: detail.price,
                    originalPrice: detail.originalPrice || detail.price,
                    isDiscounted: !!detail.isDiscounted,

                    image: product?.image || detail.image,
                    quantity: qty,

                    // 🏺 Distinction entre Session de Cursus et Flacon Boutique
                    workshopId: !product ? (detail.workshopId || detail.id) : undefined,
                    volumeId: product ? detail.id : undefined,

                    // 🏺 Nomenclature de Cursus Conception [cite: 2026-02-12]
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
            // 🏺 Clé de session certifiée
            name: 'rhum-session-cart',
        }
    )
);