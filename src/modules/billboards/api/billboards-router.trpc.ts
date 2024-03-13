import { TRPCError } from "@trpc/server";

import { z } from "zod";
import { env } from "~/env.mjs";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const billboardsRouter = createTRPCRouter({
  getAllBillboards: publicProcedure
    .input(z.object({ storeId: z.string().optional() }))
    .query(({ ctx, input }) => {
      if (!input.storeId && !env.NEXT_PUBLIC_STORE_ID)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "NEXT_PUBLIC_STORE_ID is not set.",
        });

      return ctx.prisma.billboard.findMany({
        where: { storeId: input.storeId ?? env.NEXT_PUBLIC_STORE_ID },
        orderBy: { createdAt: "desc" },
      });
    }),

  getBillboard: publicProcedure
    .input(z.object({ billboardId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.billboard.findUnique({
        where: { id: input.billboardId },
      });
    }),

  createBillboard: protectedProcedure
    .input(
      z.object({
        label: z.string(),
        imageUrl: z.string(),
        storeId: z.string(),
        description: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });

      return ctx.prisma.billboard.create({
        data: {
          label: input.label,
          imageUrl: input.imageUrl,
          storeId: input.storeId,
        },
      });
    }),

  updateBillboard: protectedProcedure
    .input(
      z.object({
        billboardId: z.string(),
        label: z.string(),
        imageUrl: z.string(),
        description: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });

      return ctx.prisma.billboard.update({
        where: { id: input.billboardId },
        data: {
          label: input.label,
          imageUrl: input.imageUrl,
        },
      });
    }),

  deleteBillboard: protectedProcedure
    .input(z.object({ billboardId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });

      return ctx.prisma.billboard.delete({
        where: { id: input.billboardId },
      });
    }),
});
