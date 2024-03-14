import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { env } from "~/env.mjs";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const blogPostRouter = createTRPCRouter({
  getBlogPost: publicProcedure
    .input(
      z.object({
        blogPostId: z.string().optional(),
        storeId: z.string().optional(),
        slug: z.string().optional(),
      })
    )
    .query(({ ctx, input }) => {
      if (!input.blogPostId && !input.slug) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Blog Post ID or slug is required",
        });
      }

      return ctx.prisma.blogPost.findUnique({
        where: {
          storeId: input.storeId ?? env.NEXT_PUBLIC_STORE_ID,
          id: input?.blogPostId,
          slug: input?.slug,
        },
        include: {
          tags: true,
        },
      });
    }),
  getAllBlogPosts: publicProcedure
    .input(
      z
        .object({
          published: z.boolean().optional(),
          tags: z.array(z.string()).optional(),
          storeId: z.string().optional(),
          querySearch: z.string().optional(),
        })
        .optional()
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.blogPost.findMany({
        where: {
          storeId: input?.storeId ?? env.NEXT_PUBLIC_STORE_ID,
          published: input?.published,
        },

        orderBy: { createdAt: "desc" },
      });
    }),

  createBlogPost: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        slug: z.string().optional(),
        content: z.string(),
        tags: z.array(z.object({ name: z.string() })),
        featuredImg: z.string().optional(),
        published: z.boolean().optional(),
        storeId: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });

      return ctx.prisma.blogPost.create({
        data: {
          title: input.title,
          featuredImg: input.featuredImg,
          content: input.content,
          slug: input.slug ?? input.title.toLowerCase().replace(/ /g, "-"),
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
    }),

  updateBlogPost: protectedProcedure
    .input(
      z.object({
        blogPostId: z.string(),
        featuredImg: z.string().optional(),
        title: z.string(),
        slug: z.string().optional(),
        content: z.string(),
        tags: z.array(z.object({ name: z.string() })),
        published: z.boolean().optional(),
        storeId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });

      const blogPost = await ctx.prisma.blogPost.update({
        where: { id: input.blogPostId },
        data: {
          title: input.title,
          slug: input?.slug,
          content: input.content,
          tags: { deleteMany: {} },
          published: input.published,
          featuredImg: input.featuredImg,
        },
      });

      return ctx.prisma.blogPost.update({
        where: { id: blogPost.id },
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
    }),
  deleteBlogPost: protectedProcedure
    .input(z.object({ blogPostId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });

      return ctx.prisma.blogPost
        .delete({ where: { id: input.blogPostId } })
        .catch((err) => {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong. Please try again later.",
            cause: err,
          });
        });
    }),
});