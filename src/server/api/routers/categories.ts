import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { env } from "~/env.mjs";
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
          attributes: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),

  getAllStoreCategoryAttributes: publicProcedure.query(async ({ ctx }) => {
    const categories = await ctx.prisma.category.findMany({
      where: {
        storeId: env.NEXT_PUBLIC_STORE_ID,
      },
      include: {
        attributes: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const attributes = categories.map((category) => category.attributes).flat();
    return attributes;
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
          attributes: true,
        },
      });
    }),

  createCategory: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        billboardId: z.string(),
        storeId: z.string(),
        attributes: z.array(
          z.object({
            name: z.string(),
            values: z.string(),
            storeId: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!input.name) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Name is required",
        });
      }

      // if (!input.billboardId) {
      //   throw new TRPCError({
      //     code: "BAD_REQUEST",
      //     message: "Billboard Id is required",
      //   });
      // }

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
              attributes: {
                createMany: {
                  data: [
                    ...input.attributes.map(
                      (attribute: {
                        name: string;
                        values: string;
                        storeId: string;
                      }) => attribute
                    ),
                  ],
                },
              },
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
        attributes: z.array(
          z.object({
            name: z.string(),
            values: z.string(),
          })
        ),
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
          return ctx.prisma.category
            .update({
              where: {
                id: input.categoryId,
              },
              data: {
                name: input.name,
                billboardId: input.billboardId,
                attributes: {
                  deleteMany: {},
                },
              },
            })
            .then(() => {
              return ctx.prisma.category.update({
                where: {
                  id: input.categoryId,
                },
                data: {
                  attributes: {
                    createMany: {
                      data: [
                        ...input.attributes.map(
                          (attribute: { name: string; values: string }) => {
                            return { ...attribute, storeId: input.storeId };
                          }
                        ),
                      ],
                    },
                  },
                },
              });
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
