import * as z from "zod";
export const categoryFormSchema = z.object({
  name: z.string().min(2),
  billboardId: z.string(),
  attributes: z.array(
    z.object({
      name: z.string().min(2),
      values: z.string().min(2),
    })
  ),
});
