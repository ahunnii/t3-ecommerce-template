import * as z from "zod";

export const storeContentFormSchema = z.object({
  aboutPage: z.string().optional(),
  heroImg: z.string().optional(),
});

export const socialMediaFormSchema = z.object({
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  tikTok: z.string().optional(),
});

export const storeFormSchema = z.object({
  name: z.string().min(2),
  street: z.string().min(2),
  additional: z.string().optional(),
  city: z.string().min(2),
  state: z.string(),
  zip: z.string().regex(/^\d{5}(?:[-\s]\d{4})?$/),
  country: z.string().optional().default("US"),
  hasFreeShipping: z.boolean(),
  minFreeShipping: z.coerce.number().nonnegative(),
  hasPickup: z.boolean(),
  maxPickupDistance: z.coerce.number().nonnegative().optional(),
  hasFlatRate: z.boolean(),
  flatRateAmount: z.coerce.number().nonnegative().optional(),
  content: storeContentFormSchema.optional(),
  socialMedia: socialMediaFormSchema.optional(),
});
