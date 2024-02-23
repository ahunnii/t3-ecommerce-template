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
      return ctx.prisma.billboard.findMany({
        where: { storeId: input.storeId ?? env.NEXT_PUBLIC_STORE_ID },
        orderBy: { createdAt: "desc" },
      });
    }),

  getBillboard: publicProcedure
    .input(z.object({ billboardId: z.string() }))
    .query(({ ctx, input }) => {
      if (!input.billboardId)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Billboard id is required",
        });

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
    .mutation(async ({ ctx, input }) => {
      if (!input.label)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Label is required",
        });

      if (!input.imageUrl)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Image Url is required",
        });

      const store = await ctx.prisma.store.findFirst({
        where: {
          id: input.storeId,
          userId: ctx.session.user.id,
        },
      });

      if (!store) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Billboard id does not belong to current user",
        });
      }

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
        storeId: z.string(),
        label: z.string(),
        imageUrl: z.string(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!input.label)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Label is required",
        });

      if (!input.imageUrl)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Image Url is required",
        });

      if (!input.billboardId)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Billboard id is required",
        });

      const store = await ctx.prisma.store.findFirst({
        where: {
          id: input.storeId,
          userId: ctx.session.user.id,
        },
      });

      if (!store) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Billboard id does not belong to current user",
        });
      }

      return ctx.prisma.billboard.update({
        where: {
          id: input.billboardId,
        },
        data: {
          label: input.label,
          imageUrl: input.imageUrl,
        },
      });
    }),

  deleteBillboard: protectedProcedure
    .input(
      z.object({
        billboardId: z.string(),
        storeId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!input.billboardId)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Billboard id is required",
        });

      const store = await ctx.prisma.store.findFirst({
        where: {
          id: input.storeId,
          userId: ctx.session.user.id,
        },
      });

      if (!store) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Billboard id does not belong to current user",
        });
      }

      return ctx.prisma.billboard.delete({
        where: {
          id: input.billboardId,
        },
      });
    }),
});
