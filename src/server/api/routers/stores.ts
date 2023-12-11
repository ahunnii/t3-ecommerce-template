import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const storeRouter = createTRPCRouter({
  getAllStores: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.store.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),

  getStore: protectedProcedure
    .input(z.object({ storeId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.store.findUnique({
        where: {
          id: input.storeId,
          userId: ctx.session.user.id,
        },
        include: {
          gallery: true,
        },
      });
    }),

  createStore: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.store.create({
        data: {
          name: input.name,
          userId: ctx.session.user.id,
        },
      });
    }),

  updateStore: protectedProcedure
    .input(
      z.object({
        storeId: z.string(),
        name: z.string(),
        businessAddress: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      if (!input.name)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Name is required",
        });

      if (!input.storeId)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Store id is required",
        });

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
              message: "Store id does not belong to current user",
            });
          }
        })
        .then(() => {
          return ctx.prisma.store.update({
            where: {
              id: input.storeId,
            },
            data: {
              name: input.name,
              businessAddress: input.businessAddress,
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

  deleteStore: protectedProcedure
    .input(
      z.object({
        storeId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      if (!input.storeId)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Color id is required",
        });

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
              message: "Store id does not belong to current user",
            });
          }
        })
        .then(() => {
          return ctx.prisma.store.delete({
            where: {
              id: input.storeId,
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
