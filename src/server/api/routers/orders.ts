import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { env } from "~/env.mjs";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const ordersRouter = createTRPCRouter({
  getOrdersByUserId: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.order.findMany({
        where: {
          storeId: env.NEXT_PUBLIC_STORE_ID,
          id: input.userId,
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
          })
          .optional(),
      })
    )
    .query(({ ctx, input }) => {
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

  getOrder: protectedProcedure
    .input(z.object({ orderId: z.string() }))
    .query(({ ctx, input }) => {
      if (!input.orderId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "orderId is required",
        });
      }

      return ctx.prisma.order.findUnique({
        where: {
          id: input.orderId,
        },
        include: {
          shippingLabel: true,
          address: true,
          timeline: true,
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
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (!input.phone) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Name is required",
          });
        }

        if (!input.address) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Value is required",
          });
        }

        const store = await ctx.prisma.store.findFirst({
          where: {
            id: input.storeId,
            userId: ctx.session.user.id,
          },
        });

        if (!store) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Size id does not belong to current user",
          });
        }

        const order = await ctx.prisma.order.create({
          data: {
            storeId: input.storeId,
            isPaid: input.isPaid,

            phone: input.phone,
            name: input.name,
          },
        });

        if (!input.address) return order;

        return ctx.prisma.order.update({
          where: {
            id: order.id,
          },
          data: {
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
          },
        });
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong. Please try again later.",
          cause: err,
        });
      }
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
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (!input.orderId)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "order Id is required",
          });

        if (!input.phone)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "phone is required",
          });

        if (!input.address)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Address is required",
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
            message: "Size id does not belong to current user",
          });
        }

        const order = await ctx.prisma.order.update({
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
            phone: input.phone,
            name: input.name,
          },
        });

        return order;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong. Please try again later.",
          cause: err,
        });
      }
    }),

  deleteOrder: protectedProcedure
    .input(
      z.object({
        orderId: z.string(),
        storeId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      if (!input.orderId)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "orderId is required",
        });

      return ctx.prisma.store
        .findFirst({
          where: {
            id: input.storeId,
            userId: ctx.session.user.id,
          },
        })
        .then((storeByUserId) => {
          if (!storeByUserId)
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "Order id does not belong to current user",
            });
        })
        .then(() => {
          return ctx.prisma.order.delete({
            where: {
              id: input.orderId,
            },
          });
        })
        .catch((err) => {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong. Please try again later.",
            cause: err,
          });
        });
    }),
});
