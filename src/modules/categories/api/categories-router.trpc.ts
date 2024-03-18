import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { env } from "~/env.mjs";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { attributeSchema, categorySchema } from "../schema";

export const categoriesRouter = createTRPCRouter({
  getCategory: publicProcedure
    .input(z.object({ categoryId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.category.findUnique({
        where: { id: input.categoryId },
        include: {
          attributes: true,
          collection: {
            include: { image: true, products: true },
          },
          products: true,
        },
      });
    }),

  getCategories: publicProcedure
    .input(
      z.object({
        storeId: z.string().optional(),
        includeProducts: z.boolean().optional(),
        includeVariants: z.boolean().optional(),
        includeCollection: z.boolean().optional(),
      })
    )
    .query(({ ctx, input }) => {
      if (!input.storeId && !env.NEXT_PUBLIC_STORE_ID)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "NEXT_PUBLIC_STORE_ID is not set.",
        });

      return ctx.prisma.category.findMany({
        where: { storeId: input.storeId ?? env.NEXT_PUBLIC_STORE_ID },
        include: {
          attributes: input.includeVariants,
          products: input.includeProducts,
          collection: input.includeCollection,
        },
        orderBy: { createdAt: "desc" },
      });
    }),

  getAllStoreCategoryAttributes: publicProcedure
    .input(z.object({ storeId: z.string().optional() }))
    .query(async ({ input, ctx }) => {
      if (!input.storeId && !env.NEXT_PUBLIC_STORE_ID)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "NEXT_PUBLIC_STORE_ID is not set.",
        });

      const categories = await ctx.prisma.category.findMany({
        where: { storeId: input.storeId ?? env.NEXT_PUBLIC_STORE_ID },
        include: { attributes: true },
        orderBy: { createdAt: "desc" },
      });

      const attributes = categories
        .map((category) => category.attributes)
        .flat();
      return attributes;
    }),

  createCategory: protectedProcedure
    .input(
      z.object({
        storeId: z.string(),
        ...categorySchema.shape,
        attributes: z.array(
          z.object({
            ...attributeSchema.shape,
            storeId: z.string(),
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

      const attributes = input.attributes.map((att) => ({
        name: att.name,
        values: att.values
          .filter((val) => val.content !== "")
          .flatMap((val) => val.content)
          .join(";"),
        storeId: input.storeId,
      }));
      const category = await ctx.prisma.category.create({
        data: {
          storeId: input.storeId,
          name: input.name,
          description: input.description,
          attributes: {
            createMany: {
              data: [
                ...attributes.map(
                  (attribute: {
                    name: string;
                    values: string;
                    storeId: string;
                  }) => attribute
                ),
              ],
            },
          },
        },
      });

      if (input.createNewCollection && input?.imageUrl) {
        const image = await ctx.prisma.image.create({
          data: { url: input?.imageUrl, alt: input?.alt ?? input.name },
        });

        await ctx.prisma.collection.create({
          data: {
            name: input.name,
            description: input.description,
            storeId: input.storeId,
            categoryId: category.id,
            imageId: image.id,
          },
        });
      }

      return category;
    }),

  updateCategory: protectedProcedure
    .input(
      z.object({
        categoryId: z.string(),
        ...categorySchema.shape,
        attributes: z.array(attributeSchema),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });

      const category = await ctx.prisma.category.update({
        where: { id: input.categoryId },
        data: {
          name: input.name,
          attributes: {
            deleteMany: {},
          },
        },
        include: { collection: true, products: true },
      });

      if (input.createNewCollection && input?.imageUrl) {
        const image = await ctx.prisma.image.upsert({
          where: {
            id: category?.collection?.imageId ?? "",
          },
          create: {
            url: input.imageUrl,
            alt: input?.alt ?? input.name,
          },
          update: {
            url: input.imageUrl,
            alt: input?.alt ?? input.name,
          },
        });

        await ctx.prisma.collection.upsert({
          where: { id: category?.collection?.id ?? "" },
          create: {
            name: input.name,
            storeId: category.storeId,
            categoryId: category.id,
            imageId: image.id,
            products: {
              connect: [
                ...category.products.map((product) => ({ id: product.id })),
              ],
            },
          },
          update: {
            name: input.name,
            imageId: image.id,

            products: {
              connect: [
                ...category.products.map((product) => ({ id: product.id })),
              ],
            },
          },
        });
      }
      const attributes = input.attributes.map((att) => ({
        name: att.name,
        values: att.values
          .filter((val) => val.content !== "")
          .flatMap((val) => val.content)
          .join(";"),
      }));

      return ctx.prisma.category.update({
        where: { id: category.id },
        data: {
          attributes: {
            createMany: {
              data: [
                ...attributes.map(
                  (attribute: { name: string; values: string }) => {
                    return { ...attribute, storeId: category.storeId };
                  }
                ),
              ],
            },
          },
        },
      });
    }),

  deleteCategory: protectedProcedure
    .input(z.object({ categoryId: z.string() }))
    .mutation(({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });

      return ctx.prisma.category.delete({
        where: { id: input.categoryId },
      });
    }),
});
