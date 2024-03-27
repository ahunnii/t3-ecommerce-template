import type { Prisma, Variation } from "@prisma/client";
import type { MouseEventHandler } from "react";
import type * as z from "zod";
import { type productFormSchema } from "./schema";

export type SingleProduct = Prisma.ProductGetPayload<{
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

export type DetailedProductFull = Prisma.ProductGetPayload<{
  include: {
    images: true;
    variants: true;
    category: {
      include: {
        attributes: true;
      };
    };
    discounts: true;
    reviews: {
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
    };
    store: {
      select: {
        id: true;
        hasFlatRate: true;
        flatRateAmount: true;
        hasFreeShipping: true;
        minFreeShipping: true;
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

export type QuickAction = {
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  icon: React.ReactElement;
  className?: string;
  renderIf: boolean;
};

export type ProductFormValues = z.infer<typeof productFormSchema>;

export type ProductVariants = Variation[];

export type ProductVariant = Variation;
