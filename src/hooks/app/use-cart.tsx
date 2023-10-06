import { toast } from "react-hot-toast";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { CartItem, Product, Variation } from "~/types";

interface CartStore {
  items: Product[];
  cartItems: CartItem[];
  paymentType: string;
  shippingType: string;
  shippingAddress: string;
  shippingAdditional?: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  customerName: string;
  addItem: (data: Product) => void;
  addCartItem: (data: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeAll: () => void;
  getQuantity: () => number;
  setValue: (key: string, value: string) => void;
}

const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      items: [],
      cartItems: [],
      paymentType: "",
      customerName: "",
      shippingType: "",
      shippingAddress: "",
      shippingAdditional: "",
      shippingCity: "",
      shippingState: "",
      shippingZip: "",

      setValue: (key: string, value: string) => {
        set({ [key]: value });
      },
      addItem: (data: Product) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === data.id);

        if (existingItem) {
          return toast("Item already in cart.");
        }

        set({ items: [...get().items, data] });
        toast.success("Item added to cart.");
      },
      addCartItem: (data: CartItem) => {
        const currentItems = get().cartItems;
        const existingItem = currentItems.find(
          (item) => item.product.id === data.product.id
        );

        if (existingItem) {
          return toast("Item already in cart.");
        }

        set({ cartItems: [...get().cartItems, data] });
        toast.success("Item added to cart.");
      },
      updateQuantity: (id: string, quantity: number) => {
        const currentItems = get().cartItems;
        const existingItem = currentItems.find(
          (item) => item.product.id === id
        );
        if (existingItem) {
          existingItem.quantity = quantity;
          set({ cartItems: [...get().cartItems] });
          // toast.success("Item quantity updated.");
        }
      },
      removeItem: (id: string) => {
        set({
          cartItems: [
            ...get().cartItems.filter((item) => item.product.id !== id),
          ],
        });
        toast.success("Item removed from cart.");
      },
      removeAll: () => set({ cartItems: [] }),
      getQuantity: () => {
        let quantity = 0;
        get().cartItems.forEach((item) => {
          quantity += Number(item.quantity);
        });
        return quantity;
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCart;
