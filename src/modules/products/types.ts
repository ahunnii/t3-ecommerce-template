import type { Prisma } from "@prisma/client";
import type * as z from "zod";
import { type productFormSchema } from "./schema";

export type SingleProduct = Prisma.ProductGetPayload<{
  include: {
    images: true;
    variants: true;
    materials: true;
    tags: true;
    category: {
      include: {
        attributes: true;
      };
    };
  };
}>;

export type CategoryProduct = Prisma.ProductGetPayload<{
  include: {
    images: true;
    variants: true;
    category: {
      include: {
        attributes: true;
      };
    };
  };
}>;

export type ProductFormValues = z.infer<typeof productFormSchema>;
