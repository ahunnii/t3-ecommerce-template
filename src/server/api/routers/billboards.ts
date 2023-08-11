import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const billboardsRouter = createTRPCRouter({
  getAllBillboards: publicProcedure
    .input(z.object({ storeId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.billboard.findMany({
        where: {
          storeId: input.storeId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),

  getBillboard: publicProcedure
    .input(z.object({ billboardId: z.string() }))
    .query(({ ctx, input }) => {
      if (!input.billboardId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Billboard id is required",
        });
      }

      return ctx.prisma.billboard.findUnique({
        where: {
          id: input.billboardId,
        },
      });
    }),

  createBillboard: protectedProcedure
    .input(
      z.object({
        label: z.string(),
        imageUrl: z.string(),
        storeId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      if (!input.label) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Label is required",
        });
      }

      if (!input.imageUrl) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Image Url is required",
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
              message: "Billboard id does not belong to current user",
            });
          }
        })
        .then(() => {
          return ctx.prisma.billboard.create({
            data: {
              label: input.label,
              imageUrl: input.imageUrl,
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

  updateBillboard: protectedProcedure
    .input(
      z.object({
        billboardId: z.string(),
        storeId: z.string(),
        label: z.string(),
        imageUrl: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
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
              message: "Billboard id does not belong to current user",
            });
        })
        .then(() => {
          return ctx.prisma.billboard.update({
            where: {
              id: input.billboardId,
            },
            data: {
              label: input.label,
              imageUrl: input.imageUrl,
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

  deleteBillboard: protectedProcedure
    .input(
      z.object({
        billboardId: z.string(),
        storeId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      if (!input.billboardId)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Billboard id is required",
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
              message: "Billboard id does not belong to current user",
            });
        })
        .then(() => {
          return ctx.prisma.billboard.delete({
            where: {
              id: input.billboardId,
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
