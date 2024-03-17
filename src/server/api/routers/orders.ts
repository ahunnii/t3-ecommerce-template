import { TimeLineEntryType } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { env } from "~/env.mjs";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import paymentService from "~/services/payment";
import { DetailedOrder } from "~/types";

export const ordersRouter = createTRPCRouter({
  getOrdersByUserId: protectedProcedure
    .input(z.object({ storeId: z.string().optional(), userId: z.string() }))
    .query(({ ctx, input }) => {
      if (
        ctx.session.user.role !== "ADMIN" ||
        ctx.session.user.id !== input.userId
      )
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });

      return ctx.prisma.order.findMany({
        where: {
          storeId: input.storeId ?? env.NEXT_PUBLIC_STORE_ID,
          userId: input.userId,
        },
        include: {
          orderItems: {
            include: {
              product: true,
              variant: true,
            },
          },
          shippingLabel: true,
        },
        orderBy: { createdAt: "desc" },
      });
    }),

  getOrderByUserId: protectedProcedure
    .input(z.object({ orderId: z.string().optional(), userId: z.string() }))
    .query(({ ctx, input }) => {
      if (
        ctx.session.user.role !== "ADMIN" ||
        ctx.session.user.id !== input.userId
      )
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });

      return ctx.prisma.order.findUnique({
        where: {
          userId: input.userId,
          id: input.orderId,
        },
        include: {
          orderItems: {
            include: {
              product: true,
              variant: true,
            },
          },
          shippingLabel: true,
        },
      });
    }),

  getPublicOrder: publicProcedure
    .input(z.object({ orderId: z.string() }))
    .query(async ({ ctx, input }) => {
      // if (
      //   ctx.session.user.role !== "ADMIN" ||
      //   ctx.session.user.id !== input.userId
      // )
      //   throw new TRPCError({
      //     code: "UNAUTHORIZED",
      //     message: "You are not authorized to perform this action.",
      //   });

      const order = await ctx.prisma.order.findUnique({
        where: {
          id: input.orderId,
        },
        include: {
          orderItems: {
            include: {
              product: {
                include: {
                  images: true,
                },
              },
              variant: true,
              discount: true,
            },
          },
          shippingLabel: true,
        },
      });

      const allowSensitiveData =
        ctx.session!.user &&
        (ctx.session!.user.role === "ADMIN" ||
          ctx.session!.user.id === order?.userId);

      if (allowSensitiveData) {
        return order;
      }

      return {
        orderItems: order?.orderItems,
        whenPaid: order?.whenPaid,
        subtotal: (order?.subtotal ?? 0) + (order?.total ?? 0),
        shippingCost: order?.shippingCost,
        whenShipped: order?.whenShipped,
        total: order?.total,
        shippingLabel: {
          trackingUrl: order?.shippingLabel?.trackingUrl,
        },
      };
    }),

  getPayment: protectedProcedure
    .input(z.object({ orderId: z.string() }))
    .query(async ({ ctx, input }) => {
      // if (
      //   ctx.session.user.role !== "ADMIN" ||
      //   ctx.session.user.id !== input.userId
      // )
      //   throw new TRPCError({
      //     code: "UNAUTHORIZED",
      //     message: "You are not authorized to perform this action.",
      //   });

      const order = await ctx.prisma.order.findUnique({
        where: {
          id: input.orderId,
        },
        include: {
          orderItems: {
            include: {
              variant: true,
              product: true,
            },
          },
          shippingLabel: true,
        },
      });

      try {
        const paymentDetails = await paymentService.retrievePayment(
          order as DetailedOrder
        );
        return paymentDetails;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching payment details",
        });
      }
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
          ...input.searchParams,
        },
        include: {
          address: true,
          orderItems: {
            include: {
              product: true,
              variant: true,
            },
          },
          shippingLabel: true,
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
          shippingLabel: true,
          address: true,
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
                  images: true,
                },
              },
            },
          },
        },
      });
    }),

  createOrder: protectedProcedure
    .input(
      z.object({
        storeId: z.string(),
        isPaid: z.boolean().optional(),
        phone: z.string(),
        address: z.object({
          street: z.string(),
          additional: z.string().optional(),
          city: z.string(),
          state: z.string(),
          postalCode: z.string(),
          country: z.string(),
        }),
        orderItems: z.array(
          z.object({
            variantId: z.string().nullish(),
            productId: z.string(),
            quantity: z.number(),
          })
        ),
        name: z.string(),
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
          storeId: input.storeId,
          isPaid: input.isPaid,

          phone: input.phone,
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
        isPaid: z.boolean().optional(),
        phone: z.string(),
        address: z.object({
          street: z.string(),
          additional: z.string().optional(),
          city: z.string(),
          state: z.string(),
          postalCode: z.string(),
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
        name: z.string(),
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
          isPaid: input.isPaid,
          address: {
            upsert: {
              create: {
                street: input.address.street,
                additional: input.address.additional,
                city: input.address.city,
                state: input.address.state,
                postal_code: input.address.postalCode,
                country: input.address.country,
              },
              update: {
                street: input.address.street,
                additional: input.address.additional,
                city: input.address.city,
                state: input.address.state,
                postal_code: input.address.postalCode,
                country: input.address.country,
              },
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
          phone: input.phone,
          name: input.name,
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
        data: { isShipped: input.isShipped },
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
