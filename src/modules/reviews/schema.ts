import * as z from "zod";

export const reviewFormSchema = z.object({
  title: z.string(),
  content: z.string(),
  rating: z.coerce.number().min(1).max(5),
  images: z.array(z.string()),
});
