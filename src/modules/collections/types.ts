import type * as z from "zod";
import type { collectionFormSchema } from "./schema";
export type CollectionFormValues = z.infer<typeof collectionFormSchema>;

export type CollectionColumn = {
  id: string;
  storeId: string;
  name: string;
  products: {
    id: string;
    name: string;
  }[];
  createdAt: Date;
};
