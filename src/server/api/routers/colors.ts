import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const colorsRouter = createTRPCRouter({
  getAllColors: publicProcedure

    .input(z.object({ storeId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.color.findMany({
        where: {
          storeId: input.storeId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),
  getColor: publicProcedure
    .input(z.object({ colorId: z.string() }))
    .query(({ ctx, input }) => {
      if (!input.colorId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Color id is required",
        });
      }

      return ctx.prisma.color.findUnique({
        where: {
          id: input.colorId,
        },
      });
    }),
  createColor: protectedProcedure
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
              message: "Color id does not belong to current user",
            });
          }
        })
        .then(() => {
          return ctx.prisma.color.create({
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

  updateColor: protectedProcedure
    .input(
      z.object({
        colorId: z.string(),
        storeId: z.string(),
        name: z.string(),
        value: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      if (!input.name) {
        // return new NextResponse("Name is required", { status: 400 });
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
        // return new NextResponse("Value is required", { status: 400 });
      }

      if (!input.colorId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Color id is required",
        });

        // return new NextResponse("Color id is required", { status: 400 });
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
              message: "Color id does not belong to current user",
            });
          }
        })
        .then(() => {
          return ctx.prisma.color.update({
            where: {
              id: input.colorId,
            },
            data: {
              name: input.name,
              value: input.value,
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

  deleteColor: protectedProcedure
    .input(
      z.object({
        colorId: z.string(),
        storeId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      if (!input.colorId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Color id is required",
        });

        // return new NextResponse("Color id is required", { status: 400 });
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
              message: "Color id does not belong to current user",
            });
          }
        })
        .then(() => {
          return ctx.prisma.color.delete({
            where: {
              id: input.colorId,
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
