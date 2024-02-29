import * as z from "zod";

export const collectionFormSchema = z.object({
  name: z.string().min(2),
  billboardId: z.string().min(1),
  isFeatured: z.boolean().default(false),
  products: z.array(
    z.object({
      id: z.string(),
    })
  ),
});
