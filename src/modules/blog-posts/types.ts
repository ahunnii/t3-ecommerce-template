import type { Prisma } from "@prisma/client";
import type * as z from "zod";
import type { blogPostFormSchema } from "./schema";

export type BlogPost = Prisma.BlogPostGetPayload<{
  include: {
    images: true;
  };
}>;

export type BlogPostFormValues = z.infer<typeof blogPostFormSchema>;

export type BlogPostColumn = {
  id: string;
  storeId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  slug: string;
  published: boolean;
};
