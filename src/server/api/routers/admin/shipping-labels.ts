import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const shippingLabelRouter = createTRPCRouter({
  getLabel: protectedProcedure
    .input(z.object({ labelId: z.string() }))
    .query(async ({ input, ctx }) => {
      if (ctx.session.user.role !== "ADMIN")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });

      const label = await ctx.prisma.shippingLabel.findUnique({
        where: { id: input.labelId },
      });

      if (!label)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Shipping label not found.",
        });

      return label;
    }),
  createLabel: protectedProcedure
    .input(
      z.object({
        labelUrl: z.string(),
        trackingNumber: z.string(),
        cost: z.string(),
        carrier: z.string(),
        timeEstimate: z.string(),
        expireAt: z.date().optional(),
        orderId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.session.user.role !== "ADMIN")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });

      const label = await ctx.prisma.shippingLabel.create({
        data: {
          labelUrl: input.labelUrl,
          trackingNumber: input.trackingNumber,
          cost: input.cost,
          carrier: input.carrier,
          timeEstimate: input.timeEstimate,
          expireAt: input.expireAt,
          order: {
            connect: {
              id: input.orderId,
            },
          },
        },
      });

      return label;
    }),
});
