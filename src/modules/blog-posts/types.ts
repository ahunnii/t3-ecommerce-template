import type { Prisma } from "@prisma/client";
import type * as z from "zod";
import type { blogPostFormSchema } from "./schema";

export type BlogPost = Prisma.BlogPostGetPayload<{
  include: {
    tags: true;
  };
}>;

export type BlogPostFormValues = z.infer<typeof blogPostFormSchema>;

export type BlogPostColumn = {
  id: string;
  storeId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  published: boolean;
};
