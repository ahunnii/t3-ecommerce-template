import * as z from "zod";

export const collectionFormSchema = z.object({
  name: z.string().min(2),
  imageUrl: z.string().min(1),
  alt: z.string().optional(),
  description: z.string().optional(),
  isFeatured: z.boolean().default(false),
  slug: z.string().optional(),
  products: z.array(
    z.object({
      id: z.string(),
    })
  ),
});
