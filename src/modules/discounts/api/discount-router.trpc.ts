import {
  DiscountAllocation,
  DiscountCondition,
  DiscountConditionOperator,
  DiscountRule,
  DiscountType,
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

  getDiscount: publicProcedure
    .input(z.object({ discountId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.discount.findUnique({
        where: { id: input.discountId },
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
        active: z.boolean(),
        isCodeRequired: z.boolean(),

        type: z.nativeEnum(DiscountType),
        allocation: z.nativeEnum(DiscountAllocation),
        condition: z.nativeEnum(DiscountCondition),
        conditionExclusion: z.nativeEnum(DiscountConditionOperator),
        conditionThreshold: z.number().optional().default(0),

        value: z.number().min(0),
        // valueType: z.nativeEnum(DiscountValueType),

        rule: z.nativeEnum(DiscountRule),

        productIds: z.array(z.string()).optional(),
        collectionIds: z.array(z.string()).optional(),
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
            connect: input.productIds?.map((id) => ({ id })),
          },
          collections: {
            connect: input.collectionIds?.map((id) => ({ id })),
          },
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
        active: z.boolean(),
        isCodeRequired: z.boolean(),

        type: z.nativeEnum(DiscountType),
        allocation: z.nativeEnum(DiscountAllocation),
        condition: z.nativeEnum(DiscountCondition),
        conditionExclusion: z.nativeEnum(DiscountConditionOperator),
        conditionThreshold: z.number().optional().default(0),

        value: z.number().min(0),
        // valueType: z.nativeEnum(DiscountValueType),

        rule: z.nativeEnum(DiscountRule),

        productIds: z.array(z.string()).optional(),
        collectionIds: z.array(z.string()).optional(),
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
