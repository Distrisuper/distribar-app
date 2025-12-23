import { create } from "zustand";

import { CartItem } from "@/types/cart/cartItem";
import { Product } from "@/types/products/product";

type CartState = {
  items: CartItem[];

  addProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  clearCart: () => void;

  getTotalItems: () => number;
  getTotalPrice: () => number;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addProduct: (product) =>
    set((state) => {
      const existing = state.items.find(
        (item) => item.product.COD_ARTICU === product.COD_ARTICU
      );

      if (existing) {
        return {
          items: state.items.map((item) =>
            item.product.COD_ARTICU === product.COD_ARTICU
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }

      return {
        items: [...state.items, { product, quantity: 1 }],
      };
    }),

  removeProduct: (productId) =>
    set((state) => ({
      items: state.items.filter(
        (item) => item.product.COD_ARTICU !== productId
      ),
    })),

  increaseQuantity: (productId) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.product.COD_ARTICU === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ),
    })),

  decreaseQuantity: (productId) =>
    set((state) => ({
      items: state.items
        .map((item) =>
          item.product.COD_ARTICU === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0),
    })),

  clearCart: () => set({ items: [] }),

  getTotalItems: () =>
    get().items.reduce((acc, item) => acc + item.quantity, 0),

  getTotalPrice: () =>
    get().items.reduce(
      (acc, item) => acc + Number(item.product.PRECIO_MOSTRADOR) * item.quantity,
      0
    ),
}));
