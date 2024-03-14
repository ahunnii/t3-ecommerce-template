import * as z from "zod";

export const attributeSchema = z.object({
  name: z.string().min(2),
  values: z.string().min(2),
});

export const categorySchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  attributes: z.array(attributeSchema),

  imageUrl: z.string().optional(),
  alt: z.string().optional(),

  createNewCollection: z.boolean().optional(),
});
export const categoryFormSchema = categorySchema.refine(
  (input) => {
    if (input.createNewCollection)
      return !!(input.imageUrl && input.createNewCollection);
    else return true;
  },
  {
    message:
      "If you want to create a new collection, you must first add a pic!",
  }
);
