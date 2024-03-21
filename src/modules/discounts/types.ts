import type { Prisma } from "@prisma/client";
import type * as z from "zod";
import type { discountFormSchema } from "./schemas";

export type SingleDiscount = Prisma.DiscountGetPayload<{
  include: {
    collections: true;
    products: true;
  };
}>;

export type DiscountFormValues = z.infer<typeof discountFormSchema>;
export type DiscountColumn = {
  id: string;
  storeId: string;
  code: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};
