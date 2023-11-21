import { Order } from "@prisma/client";
import { create } from "zustand";

interface useShippingModalStore {
  isOpen: boolean;
  data?: Order;
  onOpen: (data: Order) => void;
  onClose: () => void;
}

export const useShippingModal = create<useShippingModalStore>((set) => ({
  isOpen: false,
  data: undefined,
  onOpen: (data: Order) => set({ isOpen: true, data }),
  onClose: () => set({ isOpen: false }),
}));
