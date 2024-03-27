import type { Prisma } from "@prisma/client";
import type * as z from "zod";
import type { aboutPageSchema, attributeSchema } from "./schema";

export type AboutPageFormValues = z.infer<typeof aboutPageSchema>;
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

export type ContentColumn = {
  id: string;
  title: string;
  slug: string;
  updatedAt: string;
};

export type CategoryProductsColumn = {
  id: string;
  storeId: string;
  name: string;
  featuredImage: string | null | undefined;
};

export type BasicGraphQLPage = {
  page: {
    id: string;
    title: string;
    content: string;
    slug: string;
    updatedAt: string;
  };
};

export type BasicGraphQLPages = {
  pages: {
    id: string;
    title: string;
    content: string;
    slug: string;
    updatedAt: string;
  }[];
};
