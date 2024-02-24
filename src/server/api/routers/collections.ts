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
      if (!input.storeId && !env.NEXT_PUBLIC_STORE_ID)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "NEXT_PUBLIC_STORE_ID is not set.",
        });

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
      return ctx.prisma.collection.findUnique({
        where: { id: input.collectionId },
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
      if (ctx.session.user.role !== "ADMIN")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });

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
    }),

  updateCollection: protectedProcedure
    .input(
      z.object({
        collectionId: z.string(),
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
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });

      const collection = await ctx.prisma.collection.update({
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
      });

      return ctx.prisma.collection.update({
        where: { id: collection.id },
        data: {
          products: {
            connect: input.products,
          },
        },
      });
    }),

  deleteCollection: protectedProcedure
    .input(z.object({ collectionId: z.string() }))
    .mutation(({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });

      return ctx.prisma.collection.delete({
        where: {
          id: input.collectionId,
        },
      });
    }),
});
