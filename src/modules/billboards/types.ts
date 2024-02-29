import type * as z from "zod";
import type { billboardFormSchema } from "./schema";

export type BillboardFormValues = z.infer<typeof billboardFormSchema>;

export type BillboardColumn = {
  id: string;
  storeId: string;
  label: string;
  createdAt: Date;
};
