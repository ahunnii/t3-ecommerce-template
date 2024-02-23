import type { Prisma } from "@prisma/client";

export type BlogPost = Prisma.BlogPostGetPayload<{
  include: {
    tags: true;
  };
}>;
