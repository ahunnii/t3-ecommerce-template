import { TRPCError } from "@trpc/server";

import { z } from "zod";
import { env } from "~/env.mjs";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const collectionsRouter = createTRPCRouter({
  getAllCollections: publicProcedure
    .input(
      z.object({
        storeId: z.string().optional(),
        isFeatured: z.boolean().optional(),
      })
    )
    .query(({ ctx, input }) => {
      if (!input.storeId && !env.NEXT_PUBLIC_STORE_ID)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "NEXT_PUBLIC_STORE_ID is not set.",
        });

      return ctx.prisma.collection.findMany({
        where: {
          storeId: input.storeId ?? env.NEXT_PUBLIC_STORE_ID,
          isFeatured: input.isFeatured,
        },
        include: {
          products: {
            include: {
              images: true,
              variants: true,
              category: {
                include: {
                  attributes: true,
                },
              },
            },
          },
          image: true,
        },
        orderBy: { createdAt: "desc" },
      });
    }),

  getCollection: publicProcedure
    .input(z.object({ collectionId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.collection.findUnique({
        where: { id: input.collectionId },
        include: {
          products: {
            include: {
              discounts: true,
              images: true,
              variants: true,

              category: {
                include: {
                  attributes: true,
                },
              },
            },
          },
          image: true,
        },
      });
    }),

  createCollection: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        storeId: z.string().optional(),
        imageUrl: z.string(),
        slug: z.string().optional(),
        alt: z.string().optional(),
        description: z.string().optional(),
        isFeatured: z.boolean(),
        products: z.array(
          z.object({
            id: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });

      if (!input.storeId && !env.NEXT_PUBLIC_STORE_ID)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "NEXT_PUBLIC_STORE_ID is not set.",
        });

      const image = await ctx.prisma.image.create({
        data: { url: input.imageUrl, alt: input.alt ?? input.name },
      });
      const initSlug =
        input?.slug !== ""
          ? input?.slug?.toLowerCase().replace(/ /g, "-")
          : input.name.toLowerCase().replace(/ /g, "-");
      const collection = await ctx.prisma.collection.create({
        data: {
          storeId: input.storeId ?? env.NEXT_PUBLIC_STORE_ID,
          name: input.name,
          description: input.description,
          slug: initSlug,
          imageId: image.id,
          isFeatured: input.isFeatured,
          products: {
            connect: input.products,
          },
        },
      });

      return collection;
    }),

  updateCollection: protectedProcedure
    .input(
      z.object({
        collectionId: z.string(),
        name: z.string(),
        imageUrl: z.string(),
        alt: z.string().optional(),
        isFeatured: z.boolean(),
        description: z.string().optional(),
        slug: z.string().optional(),

        products: z.array(
          z.object({
            id: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });

      const initSlug =
        input?.slug !== ""
          ? input?.slug?.toLowerCase().replace(/ /g, "-")
          : input.name.toLowerCase().replace(/ /g, "-");

      try {
        const collection = await ctx.prisma.collection.update({
          where: {
            id: input.collectionId,
          },
          data: {
            name: input.name,
            isFeatured: input.isFeatured,
            slug: initSlug,
            image: {
              upsert: {
                create: {
                  url: input.imageUrl,
                  alt: input.alt ?? input.name,
                },
                update: {
                  url: input.imageUrl,
                  alt: input.alt ?? input.name,
                },
              },
            },
            products: {
              set: [],
            },
          },
        });

        return ctx.prisma.collection.update({
          where: { id: collection.id },
          data: {
            products: {
              connect: input.products,
            },
          },
        });
      } catch (error) {
        if (
          (error as TRPCError).code === "INTERNAL_SERVER_ERROR" &&
          (error as TRPCError).message.includes("Collection_slug_key")
        ) {
          // Prisma's error code for unique constraint
          throw new TRPCError({
            code: "CONFLICT",
            message: "A product collection with this slug already exists.",
          });
        } else {
          // Handle other errors or re-throw
          throw error;
        }
      }
    }),

  deleteCollection: protectedProcedure
    .input(z.object({ collectionId: z.string() }))
    .mutation(({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });

      return ctx.prisma.collection.delete({
        where: {
          id: input.collectionId,
        },
      });
    }),
});
