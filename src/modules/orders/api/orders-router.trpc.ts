import {
  FulfillmentStatus,
  PaymentStatus,
  ShipmentStatus,
  TimeLineEntryType,
} from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { env } from "~/env.mjs";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const ordersRouter = createTRPCRouter({
  getOrderCount: protectedProcedure
    .input(z.object({ storeId: z.string().optional() }))
    .query(({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });

      return ctx.prisma.order.count({
        where: {
          storeId: input.storeId ?? env.NEXT_PUBLIC_STORE_ID,
          paymentStatus: "PAID",
          NOT: [
            { fulfillmentStatus: "FULFILLED" || "RESTOCKED" || "CANCELED" },
          ],
        },
      });
    }),

  updateOrderNote: protectedProcedure
    .input(
      z.object({
        orderId: z.string(),
        note: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });
      return ctx.prisma.order.update({
        where: { id: input.orderId },
        data: {
          note: input.note,
        },
      });
    }),

  getAllPaidOrders: protectedProcedure
    .input(
      z.object({
        storeId: z.string().optional(),
      })
    )
    .query(({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });

      return ctx.prisma.order.findMany({
        where: {
          storeId: input.storeId ?? env.NEXT_PUBLIC_STORE_ID,
          paymentStatus: "PAID",
        },
        select: {
          storeId: true,
          id: true,
          paymentStatus: true,
          orderItems: {
            select: {
              id: true,
              quantity: true,
            },
          },

          fulfillmentStatus: true,
          shippingAddress: {
            select: {
              name: true,
            },
          },
          total: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),

  updateFulfillmentStatus: protectedProcedure
    .input(
      z.object({
        fulfillmentId: z.string(),
        status: z.nativeEnum(ShipmentStatus),
      })
    )
    .mutation(({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });

      return ctx.prisma.fulfillment.update({
        where: { id: input.fulfillmentId },
        data: {
          status: input.status,
        },
      });
    }),

  updateShippingStatus: protectedProcedure
    .input(
      z.object({
        orderId: z.string(),
        fulfillmentStatus: z.nativeEnum(FulfillmentStatus),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });

      // const order = await ctx.prisma.order.findUnique({
      //   where: { id: input.orderId },
      //   select: {
      //     fulfillments: true,
      //     fulfillmentStatus: true,
      //   },
      // });

      // if (!input.fulfillmentStatus) {
      //   const fulfillments = await ctx.prisma.fulfillment.findMany({
      //     where: {
      //       orderId: input.orderId,
      //       status: "LABEL_PRINTED",
      //     },
      //   });

      // }

      return ctx.prisma.order.update({
        where: { id: input.orderId },
        data: {
          fulfillmentStatus: input.fulfillmentStatus,
        },
      });
    }),

  getCustomerOrderHistory: protectedProcedure
    .input(
      z.object({
        storeId: z.string().optional(),
        customerId: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });

      return ctx.prisma.order.findMany({
        where: {
          storeId: input.storeId ?? env.NEXT_PUBLIC_STORE_ID,
          userId: input.customerId,
        },
        select: {
          storeId: true,
          id: true,
          paymentStatus: true,
          orderItems: {
            select: {
              id: true,
            },
          },

          fulfillmentStatus: true,
          total: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),
  getAllOrders: protectedProcedure
    .input(
      z.object({
        storeId: z.string().optional(),
        searchParams: z
          .object({
            isShipped: z.boolean().optional(),
            isPaid: z.boolean().optional(),
            ignorePending: z.boolean().optional(),
          })
          .optional(),
      })
    )
    .query(({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });

      return ctx.prisma.order.findMany({
        where: {
          storeId: input.storeId ?? env.NEXT_PUBLIC_STORE_ID,
          // ...input.searchParams,
          paymentStatus: input.searchParams?.isPaid ? "PAID" : undefined,
        },
        include: {
          shippingAddress: true,
          billingAddress: true,
          orderItems: {
            include: {
              product: true,
              variant: true,
            },
          },
          fulfillments: true,
          refunds: true,
          timeline: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),

  createTimelineEntry: protectedProcedure
    .input(
      z.object({
        orderId: z.string(),
        type: z.nativeEnum(TimeLineEntryType),
        title: z.string(),
        description: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });

      return ctx.prisma.order.update({
        where: { id: input.orderId },
        data: {
          timeline: {
            create: {
              type: input.type,
              title: input.title,
              description: input.description,
              createdAt: new Date(),
            },
          },
        },
        include: { timeline: true },
      });
    }),

  getOrder: protectedProcedure
    .input(z.object({ orderId: z.string() }))
    .query(({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });

      return ctx.prisma.order.findUnique({
        where: {
          id: input.orderId,
        },
        include: {
          shippingAddress: true,
          billingAddress: true,
          fulfillments: true,
          refunds: true,
          timeline: {
            orderBy: {
              createdAt: "desc",
            },
          },
          orderItems: {
            include: {
              variant: true,
              product: {
                include: {
                  variants: true,
                },
              },
            },
          },
        },
      });
    }),

  getOrderFulfillmentInformation: protectedProcedure
    .input(z.object({ orderId: z.string() }))
    .query(({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });

      return ctx.prisma.order.findUnique({
        where: {
          id: input.orderId,
        },
        select: {
          id: true,
          shippingAddress: true,
          billingAddress: true,
          fulfillments: true,
          orderItems: {
            include: {
              product: true,
              variant: true,
            },
          },
        },
      });
    }),
  createOrder: protectedProcedure
    .input(
      z.object({
        storeId: z.string(),
        paymentStatus: z.nativeEnum(PaymentStatus),
        fulfillmentStatus: z.nativeEnum(FulfillmentStatus),
        phone: z.string().optional(),
        email: z.string().optional(),
        billingAddress: z.object({
          name: z.string(),
          street: z.string(),
          additional: z.string().optional(),
          city: z.string(),
          state: z.string(),
          postal_code: z.string(),
          country: z.string(),
        }),
        shippingAddress: z.object({
          name: z.string(),
          street: z.string(),
          additional: z.string().optional(),
          city: z.string(),
          state: z.string(),
          postal_code: z.string(),
          country: z.string(),
        }),
        orderItems: z.array(
          z.object({
            variantId: z.string().nullish(),
            productId: z.string(),
            quantity: z.number(),
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

      return ctx.prisma.order.create({
        data: {
          ...input,
          billingAddress: {
            create: input.billingAddress,
          },
          shippingAddress: {
            create: input.shippingAddress,
          },
          orderItems: {
            createMany: {
              data: [
                ...input.orderItems.map((orderItem) => {
                  return {
                    variantId: orderItem.variantId,
                    productId: orderItem.productId,
                    quantity: orderItem.quantity,
                  };
                }),
              ],
            },
          },
        },
      });
    }),

  updateOrder: protectedProcedure
    .input(
      z.object({
        storeId: z.string(),
        orderId: z.string(),
        paymentStatus: z.nativeEnum(PaymentStatus),
        fulfillmentStatus: z.nativeEnum(FulfillmentStatus),
        phone: z.string(),
        email: z.string(),
        billingAddress: z.object({
          name: z.string(),
          street: z.string(),
          additional: z.string().optional(),
          city: z.string(),
          state: z.string(),
          postal_code: z.string(),
          country: z.string(),
        }),
        shippingAddress: z.object({
          name: z.string(),
          street: z.string(),
          additional: z.string().optional(),
          city: z.string(),
          state: z.string(),
          postal_code: z.string(),
          country: z.string(),
        }),
        orderItems: z.array(
          z.object({
            id: z.string(),
            variantId: z.string().nullish(),
            productId: z.string(),
            quantity: z.number(),
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

      return ctx.prisma.order.update({
        where: {
          id: input.orderId,
        },
        data: {
          ...input,
          billingAddress: {
            upsert: {
              create: input.billingAddress,
              update: input.billingAddress,
            },
          },
          shippingAddress: {
            upsert: {
              create: input.shippingAddress,
              update: input.shippingAddress,
            },
          },
          orderItems: {
            upsert: input.orderItems.map((orderItem) => {
              return {
                where: {
                  id: orderItem.id,
                },
                create: {
                  variantId: orderItem.variantId,
                  productId: orderItem.productId,
                  quantity: orderItem.quantity,
                },
                update: {
                  variantId: orderItem.variantId,
                  productId: orderItem.productId,
                  quantity: orderItem.quantity,
                },
              };
            }),
          },
        },
      });
    }),

  updateOrderShipStatus: protectedProcedure
    .input(
      z.object({
        orderId: z.string(),
        isShipped: z.boolean(),
      })
    )
    .mutation(({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });

      return ctx.prisma.order.update({
        where: { id: input.orderId },
        data: { fulfillmentStatus: input.isShipped ? "FULFILLED" : undefined },
      });
    }),
  deleteOrder: protectedProcedure
    .input(z.object({ orderId: z.string() }))
    .mutation(({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });

      return ctx.prisma.order.delete({
        where: {
          id: input.orderId,
        },
      });
    }),
});
