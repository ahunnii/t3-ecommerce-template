import type { Prisma, Product } from "@prisma/client";

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
