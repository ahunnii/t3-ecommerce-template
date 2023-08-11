import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const sizesRouter = createTRPCRouter({
  getAllSizes: publicProcedure

    .input(z.object({ storeId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.size.findMany({
        where: {
          storeId: input.storeId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),
  getSize: publicProcedure
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
  createSize: protectedProcedure
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

  updateSize: protectedProcedure
    .input(
      z.object({
        sizeId: z.string(),
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

      if (!input.sizeId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Size id is required",
        });

        // return new NextResponse("Size id is required", { status: 400 });
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
          return ctx.prisma.size.update({
            where: {
              id: input.sizeId,
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

  deleteSize: protectedProcedure
    .input(
      z.object({
        sizeId: z.string(),
        storeId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      if (!input.sizeId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Size id is required",
        });

        // return new NextResponse("Size id is required", { status: 400 });
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
          return ctx.prisma.size.delete({
            where: {
              id: input.sizeId,
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
