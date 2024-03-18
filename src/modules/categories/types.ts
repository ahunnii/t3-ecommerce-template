import type { Prisma } from "@prisma/client";
import type * as z from "zod";
import type { attributeSchema, categoryFormSchema } from "./schema";

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
export type AttributeFormValues = z.infer<typeof attributeSchema>;
export type Category = Prisma.CategoryGetPayload<{
  include: {
    attributes: true;
    collection: {
      include: {
        image: true;
        products: true;
      };
    };
  };
}>;

export type CategoryColumn = {
  id: string;
  storeId: string;
  name: string;
  products: {
    id: string;
  }[];
  attributes: {
    id: string;
  }[];
  collection:
    | {
        id: string;
      }
    | null
    | undefined;
  createdAt: Date;
  updatedAt: Date;
};

export type CategoryProductsColumn = {
  id: string;
  storeId: string;
  name: string;
  featuredImage: string | null | undefined;
};
