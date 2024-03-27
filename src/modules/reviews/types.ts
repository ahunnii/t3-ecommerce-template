import type * as z from "zod";
import type { reviewFormSchema } from "./schema";

import type { Collection as CollectionDB, Prisma } from "@prisma/client";

export type ReviewFormValues = z.infer<typeof reviewFormSchema>;

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
  updatedAt: Date;
};

export type Collection = CollectionDB;

export type DetailedCollection = Prisma.CollectionGetPayload<{
  include: {
    products: true;
    image: true;
  };
}>;

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export type Review = Prisma.ReviewGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        name: true;
        image: true;
      };
    };
    images: true;
  };
}> | null;
