import { type ShippingType } from "@prisma/client";

import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { env } from "~/env.mjs";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import type { CartItem } from "~/types";

import {
  extractQueryString,
  filterProductsByVariants,
} from "~/utils/filtering";

export const blogPostRouter = createTRPCRouter({
  getBlogPost: publicProcedure
    .input(
      z.object({
        blogPostId: z.string(),
        storeId: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      // const results = extractQueryString(input.queryString ?? "");

      const blogPost = await ctx.prisma.blogPost.findUnique({
        where: {
          storeId: input.storeId ?? env.NEXT_PUBLIC_STORE_ID,
          id: input?.blogPostId,
        },
        include: {
          tags: true,
        },
      });

      return blogPost;
    }),
  getAllBlogPosts: publicProcedure
    .input(
      z.object({
        published: z.boolean().optional(),
        tags: z.array(z.string()).optional(),
        storeId: z.string().optional(),
        querySearch: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      // const results = extractQueryString(input.queryString ?? "");

      const blogPosts = await ctx.prisma.blogPost.findMany({
        where: {
          storeId: input.storeId ?? env.NEXT_PUBLIC_STORE_ID,
          published: input?.published,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

      return blogPosts;
    }),

  createBlogPost: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        // description: z.string(),
        content: z.string(),
        tags: z.array(z.object({ name: z.string() })),
        published: z.boolean().optional(),
        storeId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const store = await ctx.prisma.store.findFirst({
        where: {
          id: input.storeId ?? env.NEXT_PUBLIC_STORE_ID,
          userId: ctx.session.user.id,
        },
      });

      if (!store) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unable to create posts to unowned store.",
        });
      }
      const blogPost = await ctx.prisma.blogPost.create({
        data: {
          title: input.title,
          // description: input.description,
          content: input.content,
          tags: {
            createMany: {
              data: [
                ...input.tags.map((tag: { name: string }) => ({
                  name: tag.name,
                })),
              ],
            },
          },
          published: input.published,
          storeId: input.storeId ?? env.NEXT_PUBLIC_STORE_ID,
        },
      });

      return blogPost;
    }),

  updateBlogPost: protectedProcedure
    .input(
      z.object({
        blogPostId: z.string(),

        title: z.string(),
        // description: z.string(),
        content: z.string(),
        tags: z.array(z.object({ name: z.string() })),
        published: z.boolean().optional(),
        storeId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const store = await ctx.prisma.store.findFirst({
        where: {
          id: input.storeId,
          userId: ctx.session.user.id,
        },
      });
      if (!input.blogPostId)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Blog post id is required",
        });

      if (!store) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Blog post id does not belong to current user",
        });
      }

      try {
        await ctx.prisma.blogPost.update({
          where: {
            id: input.blogPostId,
          },
          data: {
            title: input.title,
            // description: input.description,
            content: input.content,
            tags: {
              deleteMany: {},
            },
            published: input.published,
          },
        });

        return ctx.prisma.blogPost.update({
          where: {
            id: input.blogPostId,
          },
          data: {
            tags: {
              createMany: {
                data: [
                  ...input.tags.map((tag: { name: string }) => ({
                    name: tag.name,
                  })),
                ],
              },
            },
          },
        });
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong. Please try again later.",
          cause: err,
        });
      }
    }),
  deleteBlogPost: protectedProcedure
    .input(
      z.object({
        blogPostId: z.string(),
        storeId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const store = await ctx.prisma.store.findFirst({
        where: {
          id: input.storeId,
          userId: ctx.session.user.id,
        },
      });
      if (!input.blogPostId)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Blog post id is required",
        });

      if (!store) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Blog post id does not belong to current user",
        });
      }

      if (!input.blogPostId)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Blog post id is required",
        });

      return ctx.prisma.product
        .delete({
          where: {
            id: input.blogPostId,
          },
        })
        .catch((err) => {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong. Please try again later.",
            cause: err,
          });
        });
    }),
});
