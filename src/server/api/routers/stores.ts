import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { env } from "~/env.mjs";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const storeRouter = createTRPCRouter({
  getAllStores: protectedProcedure.query(({ ctx }) => {
    if (ctx.session.user.role === "ADMIN") {
      return ctx.prisma.store.findMany({});
    }
    return ctx.prisma.store.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),

  getStore: publicProcedure
    .input(z.object({ storeId: z.string().optional() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.store.findUnique({
        where: { id: input.storeId ?? env.NEXT_PUBLIC_STORE_ID },
        include: {
          gallery: true,
          address: true,
        },
      });
    }),

  createStore: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.store.create({
        data: {
          name: input.name,
          userId: ctx.session.user.id,
        },
      });
    }),

  updateStore: protectedProcedure
    .input(
      z.object({
        storeId: z.string(),
        name: z.string(),
        address: z.object({
          street: z.string(),
          additional: z.string().optional(),
          city: z.string(),
          state: z.string(),
          postalCode: z.string(),
          country: z.string(),
        }),
        hasFreeShipping: z.boolean(),
        minFreeShipping: z.coerce.number().nonnegative().optional(),
        hasPickup: z.boolean(),
        maxPickupDistance: z.coerce.number().nonnegative().optional(),
        hasFlatRate: z.boolean(),
        flatRateAmount: z.coerce.number().nonnegative().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });
      }

      try {
        const store = await ctx.prisma.store.findUnique({
          where: { id: input.storeId },
        });

        if (!store) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Store not found",
          });
        }

        return ctx.prisma.store.update({
          where: {
            id: input.storeId,
          },
          data: {
            name: input.name,
            address: {
              create: {
                street: input.address.street,
                additional: input.address.additional,
                city: input.address.city,
                state: input.address.state,
                postal_code: input.address.postalCode,
                country: input.address.country,
              },
            },
            hasFreeShipping: input.hasFreeShipping,
            minFreeShipping: input.minFreeShipping,
            hasPickup: input.hasPickup,
            maxPickupDistance: input.maxPickupDistance,
            hasFlatRate: input.hasFlatRate,
            flatRateAmount: input.flatRateAmount,
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong. Please try again later.",
          cause: error,
        });
      }
    }),

  deleteStore: protectedProcedure
    .input(z.object({ storeId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });
      }

      try {
        return ctx.prisma.store.delete({
          where: { id: input.storeId },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong. Please try again later.",
          cause: error,
        });
      }
    }),
});
