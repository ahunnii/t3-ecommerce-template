import type * as z from "zod";
import type { collectionFormSchema } from "./schema";

import type { Collection as CollectionDB, Prisma } from "@prisma/client";

export type CollectionFormValues = z.infer<typeof collectionFormSchema>;

export type CollectionColumn = {
  id: string;
  storeId: string;
  name: string;
  image:
    | {
        url: string;
      }
    | undefined
    | null;
  products: {
    id: string;
    name: string;
  }[];
  createdAt: Date;
};

export type Collection = CollectionDB;

export type DetailedCollection = Prisma.CollectionGetPayload<{
  include: {
    products: true;
    image: true;
  };
}>;
