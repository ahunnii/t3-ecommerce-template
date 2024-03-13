import type { Attribute, Category, Prisma } from "@prisma/client";
import type * as z from "zod";
import type { categoryFormSchema } from "./schema";

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export type SingleCategory = Prisma.CategoryGetPayload<{
  include: {
    billboard: true;
    attributes: true;
    collection: true;
  };
}>;

export type CategoryColumn = {
  id: string;
  storeId: string;
  name: string;
  billboard: {
    id: string;
    label: string;
  };
  createdAt: Date;
};
