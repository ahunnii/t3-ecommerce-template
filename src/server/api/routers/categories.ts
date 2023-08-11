import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const categoriesRouter = createTRPCRouter({
  getAllCategories: publicProcedure
    .input(z.object({ storeId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.category.findMany({
        where: {
          storeId: input.storeId,
        },
        include: {
          billboard: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),

  getCategory: publicProcedure
    .input(z.object({ categoryId: z.string() }))
    .query(({ ctx, input }) => {
      if (!input.categoryId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Category id is required",
        });
      }

      return ctx.prisma.category.findUnique({
        where: {
          id: input.categoryId,
        },
        include: {
          billboard: true,
        },
      });
    }),

  createCategory: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        billboardId: z.string(),
        storeId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      if (!input.name) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Name is required",
        });
      }

      if (!input.billboardId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Billboard Id is required",
        });
      }

      return ctx.prisma.store
        .findFirst({
          where: {
            id: input.storeId,
            userId: ctx.session.user.id,
          },
        })
        .then((storeByUserId) => {
          if (!storeByUserId) {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "Category id does not belong to current user",
            });
          }
        })
        .then(() => {
          return ctx.prisma.category.create({
            data: {
              name: input.name,
              billboardId: input.billboardId,
              storeId: input.storeId,
            },
          });
        })
        .catch((err) => {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong. Please try again later.",
            cause: err,
          });
        });
    }),

  updateCategory: protectedProcedure
    .input(
      z.object({
        categoryId: z.string(),
        storeId: z.string(),
        name: z.string(),
        billboardId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      if (!input.name)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Name is required",
        });

      if (!input.billboardId)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Billboard Id is required",
        });

      if (!input.categoryId)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Category id is required",
        });

      return ctx.prisma.store
        .findFirst({
          where: {
            id: input.storeId,
            userId: ctx.session.user.id,
          },
        })
        .then((storeByUserId) => {
          if (!storeByUserId)
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "Category id does not belong to current user",
            });
        })
        .then(() => {
          return ctx.prisma.category.update({
            where: {
              id: input.categoryId,
            },
            data: {
              name: input.name,
              billboardId: input.billboardId,
            },
          });
        })
        .catch((err) => {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong. Please try again later.",
            cause: err,
          });
        });
    }),

  deleteCategory: protectedProcedure
    .input(
      z.object({
        categoryId: z.string(),
        storeId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      if (!input.categoryId)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Category id is required",
        });

      return ctx.prisma.store
        .findFirst({
          where: {
            id: input.storeId,
            userId: ctx.session.user.id,
          },
        })
        .then((storeByUserId) => {
          if (!storeByUserId)
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "Category id does not belong to current user",
            });
        })
        .then(() => {
          return ctx.prisma.category.delete({
            where: {
              id: input.categoryId,
            },
          });
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
