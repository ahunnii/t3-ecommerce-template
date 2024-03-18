import { join } from "path";
import * as z from "zod";

export const attributeSchema = z.object({
  name: z.string().min(2),
  values: z
    .array(
      z.object({
        content: z.string(),
      })
    )
    .refine(
      (input) => {
        return !!(input.flatMap((val) => val.content).join("").length > 0);
      },
      {
        message: "You need at least one value for your attribute.",
        path: ["0.content"],
      }
    ),
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

    if (input.attributes)
      return input.attributes.filter((attribute) => {
        return (
          attribute.name !== "" &&
          attribute.values.filter((val) => val.content !== "").length > 0
        );
      });
    else return true;
  },
  {
    message:
      "If you want to create a new collection, you must first add a pic!",
  }
);
