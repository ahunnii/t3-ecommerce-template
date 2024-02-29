import {
  DiscountMethodType,
  DiscountType,
  DiscountValueType,
} from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { env } from "~/env.mjs";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const discountRouter = createTRPCRouter({
  getAllDiscounts: publicProcedure
    .input(z.object({ storeId: z.string().optional() }))
    .query(({ ctx, input }) => {
      if (!input.storeId && !env.NEXT_PUBLIC_STORE_ID)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "NEXT_PUBLIC_STORE_ID is not set.",
        });

      return ctx.prisma.discount.findMany({
        where: { storeId: input.storeId ?? env.NEXT_PUBLIC_STORE_ID },
        orderBy: { createdAt: "desc" },
      });
    }),

  getActiveSiteSales: publicProcedure
    .input(z.object({ storeId: z.string().optional() }))
    .query(({ ctx, input }) => {
      if (!input.storeId && !env.NEXT_PUBLIC_STORE_ID)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "NEXT_PUBLIC_STORE_ID is not set.",
        });

      return ctx.prisma.discount.findMany({
        where: {
          storeId: input.storeId ?? env.NEXT_PUBLIC_STORE_ID,
          active: true,
          methodType: "SALE",
          type: "GLOBAL",
          // startDate: {
          //   lte: new Date(),
          // },
          // endDate: {
          //   gte: new Date(),
          // },
        },
        orderBy: { createdAt: "desc" },
      });
    }),

  getActiveCheckoutSales: publicProcedure
    .input(z.object({ storeId: z.string().optional() }))
    .query(({ ctx, input }) => {
      if (!input.storeId && !env.NEXT_PUBLIC_STORE_ID)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "NEXT_PUBLIC_STORE_ID is not set.",
        });

      return ctx.prisma.discount.findMany({
        where: {
          storeId: input.storeId ?? env.NEXT_PUBLIC_STORE_ID,
          active: true,
          methodType: "COUPON",

          // startDate: {
          //   lte: new Date(),
          // },
          // endDate: {
          //   gte: new Date(),
          // },
        },
        orderBy: { createdAt: "desc" },
      });
    }),

  getCoupon: publicProcedure
    .input(
      z.object({
        storeId: z.string().optional(),
        code: z.string(),
        orderTotal: z.number().optional(),
        shippingTotal: z.number().optional(),
      })
    )
    .query(({ ctx, input }) => {
      if (!input.storeId && !env.NEXT_PUBLIC_STORE_ID)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "NEXT_PUBLIC_STORE_ID is not set.",
        });

      return ctx.prisma.discount.findUnique({
        where: {
          storeId: input.storeId ?? env.NEXT_PUBLIC_STORE_ID,
          active: true,
          methodType: "COUPON",
          code: input.code,

          AND: [
            { OR: [{ endDate: { gte: new Date() } }, { endDate: null }] },
            {
              OR: [
                {
                  AND: [
                    {
                      OR: [
                        { minValue: { lte: input?.orderTotal } },
                        { minValue: null },
                      ],
                    },
                    {
                      OR: [
                        { maxValue: null },
                        { maxValue: { gte: input?.orderTotal } },
                      ],
                    },
                    {
                      type: "ORDER",
                    },
                  ],
                },
                {
                  AND: [
                    {
                      OR: [
                        { minValue: { lte: input?.shippingTotal } },
                        { minValue: null },
                      ],
                    },
                    {
                      OR: [
                        { maxValue: null },
                        { maxValue: { gte: input?.shippingTotal } },
                      ],
                    },
                    {
                      type: "SHIPPING",
                    },
                  ],
                },
              ],
            },
          ],

          startDate: {
            lte: new Date(),
          },
        },
      });
    }),
  getDiscount: publicProcedure
    .input(z.object({ discountId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.discount.findUnique({
        where: { id: input.discountId },
        include: {
          products: true,
          collections: true,
        },
      });
    }),

  createDiscount: protectedProcedure
    .input(
      z.object({
        storeId: z.string(),

        startDate: z.date(),
        endDate: z.date().optional(),

        code: z.string(),
        description: z.string().optional(),
        value: z.number().min(0),
        active: z.boolean(),
        stackable: z.boolean(),

        type: z.nativeEnum(DiscountType),
        valueType: z.nativeEnum(DiscountValueType),
        methodType: z.nativeEnum(DiscountMethodType),

        minValue: z.number().optional(),
        maxValue: z.number().optional(),

        products: z.array(
          z.object({
            id: z.string(),
          })
        ),
        collections: z.array(
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
      return ctx.prisma.discount.create({
        data: {
          ...input,
          products: {
            connect: input.products,
          },
          collections: {
            connect: input.collections,
          },
          maxValue:
            input.maxValue === 0 || input.maxValue === undefined
              ? null
              : input.maxValue,
        },
      });
    }),

  updateDiscount: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        startDate: z.date(),
        endDate: z.date().optional(),

        code: z.string(),
        description: z.string().optional(),
        value: z.number().min(0),
        active: z.boolean(),
        stackable: z.boolean(),

        type: z.nativeEnum(DiscountType),
        valueType: z.nativeEnum(DiscountValueType),
        methodType: z.nativeEnum(DiscountMethodType),

        minValue: z.number().optional(),
        maxValue: z.number().optional(),

        products: z.array(
          z.object({
            id: z.string(),
          })
        ),
        collections: z.array(
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

      await ctx.prisma.discount.update({
        where: { id: input.id },
        data: {
          products: {
            set: [],
          },
          collections: {
            set: [],
          },
        },
      });

      return ctx.prisma.discount.update({
        where: { id: input.id },
        data: {
          ...input,
          products: {
            connect: input.products,
          },
          collections: {
            connect: input.collections,
          },
          maxValue:
            input.maxValue === 0 || input.maxValue === undefined
              ? null
              : input.maxValue,
        },
      });
    }),

  deleteDiscount: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });

      return ctx.prisma.discount.delete({ where: { id: input.id } });
    }),
});
