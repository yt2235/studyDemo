import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartProduct {
    id: number;
    name: string;
    specification: string;
}

interface InquiryState {
    cart: CartProduct[];
    addToCart: (product: CartProduct) => void;
    removeFromCart: (productId: number) => void;
    clearCart: () => void;
    isInCart: (productId: number) => boolean;
}

export const useInquiryStore = create<InquiryState>()(
    persist(
        (set, get) => ({
            cart: [],
            addToCart: (product) => {
                if (!get().isInCart(product.id)) {
                    set((state) => ({ cart: [...state.cart, product] }));
                }
            },
            removeFromCart: (productId) =>
                set((state) => ({ cart: state.cart.filter((p) => p.id !== productId) })),
            clearCart: () => set({ cart: [] }),
            isInCart: (productId) => get().cart.some((p) => p.id === productId),
        }),
        {
            name: 'inquiry-cart-storage',
        }
    )
);
