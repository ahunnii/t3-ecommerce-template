import { TRPCError } from "@trpc/server";

import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const reviewRouter = createTRPCRouter({
  // Queries for the frontend
  getProductReviews: publicProcedure
    .input(
      z.object({ productId: z.string(), sortBy: z.enum(["NEWEST", "OLDEST"]) })
    )
    .query(async ({ ctx, input }) => {
      const reviews = await ctx.prisma.review.findMany({
        where: {
          productId: input.productId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          images: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

      return reviews;
    }),

  createReview: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        userId: z.string(),
        rating: z.number().min(1).max(5),
        title: z.string(),
        content: z.string(),
        images: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const review = await ctx.prisma.review.create({
        data: {
          rating: input.rating,
          title: input.title,
          content: input.content,

          user: {
            connect: {
              id: input.userId,
            },
          },
          product: {
            connect: {
              id: input.productId,
            },
          },
          images: {
            createMany: {
              data: input.images.map((url) => ({ url })),
            },
          },
        },
      });

      return review;
    }),

  updateReview: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        reviewId: z.string(),
        rating: z.number().min(1).max(5).int(),
        title: z.string(),
        content: z.string(),
        images: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (
        ctx.session.user.id !== input.userId ||
        ctx.session.user.role !== "ADMIN"
      )
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });

      const updatedReview = await ctx.prisma.review.update({
        where: {
          id: input.reviewId,
          userId: input.userId,
        },
        data: {
          rating: input.rating,
          title: input.title,
          content: input.content,
          images: {
            createMany: {
              data: input.images.map((url) => ({ url })),
            },
          },
        },
      });

      return updatedReview;
    }),
  deleteReview: protectedProcedure
    .input(z.object({ reviewId: z.string(), userId: z.string() }))
    .mutation(({ ctx, input }) => {
      if (
        ctx.session.user.id !== input.userId ||
        ctx.session.user.role !== "ADMIN"
      )
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });

      return ctx.prisma.review.delete({
        where: { id: input.reviewId, userId: input.userId },
      });
    }),
});
