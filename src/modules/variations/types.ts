import type { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import type * as z from "zod";
import type { Variation } from "~/types";
import type { variantFormSchema } from "./schema";

export type VariantSelector = {
  form: UseFormReturn<VariantFormValues>;
  formField: ControllerRenderProps<VariantFormValues, `selection.${string}`>;
  attributes: string[];
  variantOption: {
    name: string;
    values: string[];
  };
  productVariants: Variation[];
};

export type VariantFormValues = z.infer<typeof variantFormSchema>;
