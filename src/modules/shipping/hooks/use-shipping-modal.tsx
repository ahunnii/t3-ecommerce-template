import { create } from "zustand";
import type { OrderColumn } from "~/modules/orders/components/admin/columns";

interface useShippingModalStore {
  isOpen: boolean;
  data?: string;
  onOpen: (data: string) => void;
  onClose: () => void;
}

export const useShippingModal = create<useShippingModalStore>((set) => ({
  isOpen: false,
  data: undefined,
  onOpen: (data: string) => set({ isOpen: true, data }),
  onClose: () => set({ isOpen: false, data: undefined }),
}));