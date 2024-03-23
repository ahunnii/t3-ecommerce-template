import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { storeTheme } from "~/data/config.custom";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { emailService } from "~/services/email";
import {
  type CustomerReceiptEmailData,
  CustomerReceiptEmail,
} from "../email-templates/customer.receipt";

export const emailServiceRouter = createTRPCRouter({
  sendReceiptEmail: protectedProcedure
    .input(z.object({ orderId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.session.user.role !== "ADMIN")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });

      const order = await ctx.prisma.order.findUnique({
        where: { id: input.orderId },
        include: {
          shippingAddress: true,
          orderItems: {
            include: {
              product: true,
              variant: true,
              discount: true,
            },
          },
        },
      });

      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found",
        });
      }

      const emailPayload: CustomerReceiptEmailData = {
        name: order?.shippingAddress?.name ?? "Customer",
        storeName: storeTheme.brand.name,
        email: order.email,
        orderId: order.id,
        orderItems: order.orderItems,
        subtotal: order.subtotal,
        tax: order.tax,
        shipping: order.shipping,
        total: order.total,
        purchaseDate: order.createdAt.toDateString(),
        notes: "Thank you for your purchase",
      };

      try {
        const createCustomRequest =
          await emailService.sendEmail<CustomerReceiptEmailData>({
            to: order.email,
            from: "Trend Anomaly <no-reply@trendanomaly.com>",
            subject: "Order Receipt #TA33d3d from Trend Anomaly",
            template: CustomerReceiptEmail,
            data: emailPayload,
          });
        return createCustomRequest;
      } catch (cause) {
        if (cause instanceof TRPCError) {
          throw cause;
        }

        console.error(cause);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal server error",
        });
      }
    }),
});
