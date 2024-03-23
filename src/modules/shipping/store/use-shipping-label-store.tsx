import type Shippo from "shippo";
import { create } from "zustand";

import type {
  AddressFormValues,
  ItemFormValues,
  PackageFormValues,
} from "../types";

interface ShippingLabelValueStore {
  rates: Shippo.Rate[];
  setRates: (rates: Shippo.Rate[]) => void;
  selectedRate: Shippo.Rate | null;
  setSelectedRate: (rate: Shippo.Rate) => void;
  customerAddress: AddressFormValues | null;
  setCustomerAddress: (address: AddressFormValues) => void;
  businessAddress: AddressFormValues | null;
  setBusinessAddress: (address: AddressFormValues) => void;
  parcel: PackageFormValues | null;
  setParcel: (parcel: PackageFormValues) => void;
  items: ItemFormValues | null;
  setItems: (items: ItemFormValues) => void;
  clearAll: () => void;
}

export const useShippingLabelStore = create<ShippingLabelValueStore>((set) => ({
  items: null,
  setItems: (items: ItemFormValues) => set({ items }),
  rates: [],
  setRates: (rates: Shippo.Rate[]) => set({ rates }),
  selectedRate: null,
  setSelectedRate: (selectedRate: Shippo.Rate) => set({ selectedRate }),
  customerAddress: null,
  setCustomerAddress: (customerAddress: AddressFormValues) =>
    set({ customerAddress }),
  businessAddress: null,
  setBusinessAddress: (businessAddress: AddressFormValues) =>
    set({ businessAddress }),
  parcel: null,
  setParcel: (parcel: PackageFormValues) => set({ parcel }),
  clearAll: () =>
    set({
      rates: [],
      selectedRate: null,
      customerAddress: null,
      businessAddress: null,
      parcel: null,
    }),
}));
