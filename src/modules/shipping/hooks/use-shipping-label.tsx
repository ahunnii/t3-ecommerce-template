import type Shippo from "shippo";
import { create } from "zustand";

import type { AddressFormValues, PackageFormValues } from "../types";

interface useShippingLabelStore {
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
  clearAll: () => void;
}

const useShippingLabelValues = create<useShippingLabelStore>((set) => ({
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

const useShippingLabel = () => {
  const {
    rates,
    setRates,
    customerAddress,
    setCustomerAddress,
    businessAddress,
    setBusinessAddress,
    parcel,
    setParcel,
    selectedRate,
    setSelectedRate,
    clearAll,
  } = useShippingLabelValues();

  return {
    setRates,
    rates,
    setCustomerAddress,
    customerAddress,
    businessAddress,
    parcel,
    setBusinessAddress,
    setParcel,
    selectedRate,
    setSelectedRate,
    clearAll,
  };
};

export default useShippingLabel;
