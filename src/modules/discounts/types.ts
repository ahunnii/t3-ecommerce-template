import type { Prisma } from "@prisma/client";
import * as z from "zod";
import { discountFormSchema } from "./schemas";

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
