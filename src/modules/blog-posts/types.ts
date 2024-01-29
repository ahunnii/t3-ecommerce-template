import type { Prisma, Product } from "@prisma/client";

export type BlogPost = Prisma.BlogPostGetPayload<{
  include: {
    tags: true;
  };
}>;
