import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { env } from "~/env.mjs";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const galleryRouter = createTRPCRouter({
  getAllGalleryImages: publicProcedure
    .input(
      z.object({
        storeId: z.string().optional(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.galleryImage.findMany({
        where: {
          storeId: input.storeId ?? env.NEXT_PUBLIC_STORE_ID,
        },

        orderBy: { createdAt: "desc" },
      });
    }),

  getGalleryImage: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      if (!input.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Gallery image id is required",
        });
      }

      return ctx.prisma.galleryImage.findUnique({
        where: {
          id: input.id,
        },
      });
    }),

  createGalleryImage: protectedProcedure
    .input(
      z.object({
        title: z.string().optional(),
        caption: z.string().optional(),
        url: z.string(),
        storeId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const store = await ctx.prisma.store.findFirst({
        where: {
          id: input.storeId,
          userId: ctx.session.user.id,
        },
      });

      if (!store) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Collection id does not belong to current user",
        });
      }

      return ctx.prisma.galleryImage
        .create({
          data: {
            title: input.title,
            caption: input.caption,
            url: input.url,
            storeId: input.storeId,
          },
        })
        .catch((err) => {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong. Please try again later.",
            cause: err,
          });
        });
    }),

  updateGalleryImage: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        storeId: z.string(),
        title: z.string().optional(),
        caption: z.string().optional(),
        url: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!input.id)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Gallery image id is required",
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
          message: "Collection id does not belong to current user",
        });
      }

      return ctx.prisma.galleryImage
        .update({
          where: {
            id: input.id,
          },
          data: {
            title: input.title,
            caption: input.caption,
            url: input.url,
          },
        })
        .catch((err) => {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong. Please try again later.",
            cause: err,
          });
        });
    }),

  deleteGalleryImage: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        storeId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!input.id)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Gallery image id is required",
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
          message: "Collection id does not belong to current user",
        });
      }

      return ctx.prisma.galleryImage
        .delete({
          where: {
            id: input.id,
          },
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
