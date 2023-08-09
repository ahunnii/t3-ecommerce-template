import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const ordersRouter = createTRPCRouter({
  getAllOrders: protectedProcedure
    .input(z.object({ storeId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.order.findMany({
        where: {
          storeId: input.storeId,
        },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),
  getOrder: protectedProcedure
    .input(z.object({ sizeId: z.string() }))
    .query(({ ctx, input }) => {
      if (!input.sizeId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Size id is required",
        });
      }

      return ctx.prisma.size.findUnique({
        where: {
          id: input.sizeId,
        },
      });
    }),
  createOrder: protectedProcedure
    .input(
      z.object({
        storeId: z.string(),
        name: z.string(),
        value: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      if (!input.name) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Name is required",
        });
      }

      if (!input.value) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Value is required",
        });
      }

      return ctx.prisma.store
        .findFirst({
          where: {
            id: input.storeId,
            userId: ctx.session.user.id,
          },
        })
        .then((storeByUserId) => {
          if (!storeByUserId) {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "Size id does not belong to current user",
            });
          }
        })
        .then(() => {
          return ctx.prisma.size.create({
            data: {
              name: input.name,
              value: input.value,
              storeId: input.storeId,
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
