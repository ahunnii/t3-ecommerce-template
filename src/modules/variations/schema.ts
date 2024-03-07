import * as z from "zod";

export const variantFormSchema = z.object({
  selection: z.record(z.string(), z.string()),
  quantity: z.coerce.number().min(1),
});
