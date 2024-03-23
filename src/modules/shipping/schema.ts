import * as z from "zod";

export const addressFormSchema = z.object({
  name: z.string().min(2),
  street: z.string(),
  additional: z.string().optional(),
  city: z.string(),
  state: z.string(),
  zip: z.string().regex(/^([0-9]{5})(?:[-\s]*([0-9]{4}))?$/),
  country: z.enum(["US", "CA"]).optional(),
});

export const packageFormSchema = z.object({
  package_length: z.coerce.number().min(1),
  package_width: z.coerce.number().min(1),
  package_height: z.coerce.number().min(1),
  package_weight_lbs: z.coerce.number(),
  package_weight_oz: z.coerce.number(),
  distance_unit: z.enum(["in", "cm"]).optional(),
  mass_unit: z.enum(["lb", "kg"]).optional(),
});

export const rateFormSchema = z.object({
  rate_selection_id: z.string(),
});

export const itemsFormSchema = z.object({
  orderItems: z.array(
    z.object({
      id: z.string(),
    })
  ),
});
