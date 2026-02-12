import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
    cartId: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    workshopId?: string;
    volumeId?: string;
    level?: number;
    participants?: any[];
}

interface CartState {
    items: CartItem[];
    isCartOpen: boolean;
    setCartOpen: (open: boolean) => void;
    addItem: (product: any, detail: any, qty: number) => void;
    removeItem: (cartId: string) => void;
    clearCart: () => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set) => ({
            items: [],
            isCartOpen: false,

            setCartOpen: (open) => set({ isCartOpen: open }),

            addItem: (product, detail, qty) => set((state) => {
                const uniqueId = detail.cartId || detail.id;
                const existing = state.items.find(i => i.cartId === uniqueId);

                if (existing) {
                    return {
                        items: state.items.map(i => i.cartId === uniqueId
                            ? { ...i, quantity: i.quantity + qty }
                            : i
                        ),
                        isCartOpen: true
                    };
                }

                const newItem = {
                    cartId: uniqueId,
                    name: product ? `${product.name} (${detail.size}${detail.unit})` : (detail.name || detail.title),
                    price: detail.price,
                    image: product?.image || detail.image,
                    quantity: qty,
                    workshopId: !product ? (detail.workshopId || detail.id) : undefined,
                    volumeId: product ? detail.id : undefined,
                    level: detail.level,
                    participants: detail.participants
                };

                return { items: [...state.items, newItem], isCartOpen: true };
            }),

            removeItem: (cartId) => set((state) => ({
                items: state.items.filter(i => i.cartId !== cartId)
            })),

            clearCart: () => set({ items: [] }),
        }),
        {
            name: 'atelier_cart', // 🏺 Garde la même clé que votre localStorage actuel
        }
    )
);