import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { env } from "~/env.mjs";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const collectionsRouter = createTRPCRouter({
  getAllCollections: publicProcedure
    .input(
      z.object({
        storeId: z.string().optional(),
        isFeatured: z.boolean().optional(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.collection.findMany({
        where: {
          storeId: input.storeId ?? env.NEXT_PUBLIC_STORE_ID,
          isFeatured: input.isFeatured,
        },
        include: {
          products: {
            include: {
              images: true,
              variants: true,
              materials: true,
              tags: true,
              category: {
                include: {
                  attributes: true,
                },
              },
            },
          },
          billboard: true,
        },
        orderBy: { createdAt: "desc" },
      });
    }),

  getCollection: publicProcedure
    .input(z.object({ collectionId: z.string() }))
    .query(({ ctx, input }) => {
      if (!input.collectionId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Collection id is required",
        });
      }

      return ctx.prisma.collection.findUnique({
        where: {
          id: input.collectionId,
        },
        include: {
          products: {
            include: {
              images: true,
              variants: true,
              materials: true,
              tags: true,
              category: {
                include: {
                  attributes: true,
                },
              },
            },
          },
          billboard: true,
        },
      });
    }),

  createCollection: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        storeId: z.string(),
        billboardId: z.string(),
        isFeatured: z.boolean(),
        products: z.array(
          z.object({
            id: z.string(),
          })
        ),
      })
    )
    .mutation(({ ctx, input }) => {
      if (!input.name) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Name is required",
        });
      }
      if (!input.billboardId)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Billboard Id is required",
        });

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
              message: "Collection id does not belong to current user",
            });
          }
        })
        .then(() => {
          return ctx.prisma.collection.create({
            data: {
              name: input.name,
              billboardId: input.billboardId,
              isFeatured: input.isFeatured,
              storeId: input.storeId,
              products: {
                connect: input.products,
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

  updateCollection: protectedProcedure
    .input(
      z.object({
        collectionId: z.string(),
        storeId: z.string(),
        name: z.string(),
        billboardId: z.string(),
        isFeatured: z.boolean(),

        products: z.array(
          z.object({
            id: z.string(),
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

      if (!input.collectionId)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Collection id is required",
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
              message: "Collection id does not belong to current user",
            });
        })
        .then(() => {
          return ctx.prisma.collection
            .update({
              where: {
                id: input.collectionId,
              },
              data: {
                name: input.name,
                billboardId: input.billboardId,
                isFeatured: input.isFeatured,
                products: {
                  set: [],
                },
              },
            })
            .then(() => {
              return ctx.prisma.collection.update({
                where: {
                  id: input.collectionId,
                },
                data: {
                  products: {
                    connect: input.products,
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

  deleteCollection: protectedProcedure
    .input(
      z.object({
        collectionId: z.string(),
        storeId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      if (!input.collectionId)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Collection id is required",
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
              message: "Collection id does not belong to current user",
            });
        })
        .then(() => {
          return ctx.prisma.collection.delete({
            where: {
              id: input.collectionId,
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
