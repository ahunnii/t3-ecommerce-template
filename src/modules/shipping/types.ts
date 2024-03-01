import type * as z from "zod";
import type {
  addressFormSchema,
  packageFormSchema,
  rateFormSchema,
} from "./schema";

export type AddressFormValues = z.infer<typeof addressFormSchema>;
export type PackageFormValues = z.infer<typeof packageFormSchema>;
export type RateFormValues = z.infer<typeof rateFormSchema>;

export type Package = {
  length: number;
  width: number;
  height: number;
  distance_unit: "in" | "cm";
  weight: number;
  mass_unit: "lb" | "kg";
};

export type ShippingAddress = {
  name: string;
  street: string;
  additional?: string;
  city: string;
  state: string;
  zip: string;
};

export type ShippingResponse = {
  isValid: boolean;
  message: string;
};

export type RateResponse = {
  isValid: boolean;
  message: string;
  rates?: Shippo.Rate[];
};
