import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { env } from "~/env.mjs";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const galleryRouter = createTRPCRouter({
  getGalleryImages: publicProcedure
    .input(z.object({ storeId: z.string().optional() }).optional())
    .query(({ ctx, input }) => {
      if (!input?.storeId && !env.NEXT_PUBLIC_STORE_ID)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "NEXT_PUBLIC_STORE_ID is not set.",
        });

      return ctx.prisma.galleryImage.findMany({
        where: {
          storeId: input?.storeId ?? env.NEXT_PUBLIC_STORE_ID,
          NOT: [{ url: "" || undefined }],
        },
        orderBy: { createdAt: "desc" },
      });
    }),

  getGalleryImage: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.galleryImage.findUnique({
        where: { id: input.id },
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
    .mutation(({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });
      return ctx.prisma.galleryImage.create({
        data: {
          title: input.title,
          caption: input.caption,
          url: input.url,
          storeId: input.storeId,
        },
      });
    }),

  updateGalleryImage: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        caption: z.string().optional(),
        url: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });
      return ctx.prisma.galleryImage.update({
        where: { id: input.id },
        data: {
          title: input.title,
          caption: input.caption,
          url: input.url,
        },
      });
    }),

  deleteGalleryImage: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });

      return ctx.prisma.galleryImage.delete({ where: { id: input.id } });
    }),
});
