import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { env } from "~/env.mjs";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const categoriesRouter = createTRPCRouter({
  getAllCategories: publicProcedure
    .input(z.object({ storeId: z.string().optional() }))
    .query(({ ctx, input }) => {
      if (!input.storeId && !env.NEXT_PUBLIC_STORE_ID)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "NEXT_PUBLIC_STORE_ID is not set.",
        });

      return ctx.prisma.category.findMany({
        where: { storeId: input.storeId ?? env.NEXT_PUBLIC_STORE_ID },
        include: {
          billboard: true,
          attributes: true,
        },
        orderBy: {
          createdAt: "desc",
        },
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

  getCategory: publicProcedure
    .input(z.object({ categoryId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.category.findUnique({
        where: { id: input.categoryId },
        include: {
          billboard: true,
          attributes: true,
          collection: true,
        },
      });
    }),

  createCategory: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        billboardId: z.string(),
        storeId: z.string(),
        attributes: z.array(
          z.object({
            name: z.string(),
            values: z.string(),
            storeId: z.string(),
          })
        ),
        createNewCollection: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });

      const category = await ctx.prisma.category.create({
        data: {
          name: input.name,
          billboardId: input.billboardId,
          storeId: input.storeId,
          attributes: {
            createMany: {
              data: [
                ...input.attributes.map(
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

      if (input.createNewCollection) {
        await ctx.prisma.collection.create({
          data: {
            name: input.name,
            storeId: input.storeId,
            categoryId: category.id,
            billboardId: input.billboardId,
          },
        });
      }

      return category;
    }),

  updateCategory: protectedProcedure
    .input(
      z.object({
        categoryId: z.string(),
        storeId: z.string(),
        name: z.string(),
        billboardId: z.string(),
        createNewCollection: z.boolean().optional(),
        attributes: z.array(
          z.object({
            name: z.string(),
            values: z.string(),
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

      const category = await ctx.prisma.category.update({
        where: { id: input.categoryId },
        data: {
          name: input.name,
          billboardId: input.billboardId,
          attributes: {
            deleteMany: {},
          },
        },
        include: { collection: true, products: true },
      });

      console.log(category.collection?.id, input.createNewCollection);

      if (input.createNewCollection) {
        await ctx.prisma.collection.upsert({
          where: { id: category?.collection?.id ?? "" },
          create: {
            name: input.name,
            storeId: input.storeId,
            categoryId: category.id,
            billboardId: input.billboardId,
            products: {
              connect: [
                ...category.products.map((product) => ({ id: product.id })),
              ],
            },
          },
          update: {
            name: input.name,
            billboardId: input.billboardId,
            products: {
              connect: [
                ...category.products.map((product) => ({ id: product.id })),
              ],
            },
          },
        });
      }

      // if (input.createNewCollection && category.collection?.id) {
      //   await ctx.prisma.collection.update({
      //     where: { id: input.categoryId },
      //     data: {
      //       name: input.name,
      //       billboardId: input.billboardId,
      //       products: {
      //         connect: [
      //           ...category.products.map((product) => ({ id: product.id })),
      //         ],
      //       },
      //     },
      //   });
      // }

      // if (input.createNewCollection && !category.collection) {
      //   await ctx.prisma.collection.create({
      //     data: {
      //       name: input.name,
      //       storeId: input.storeId,
      //       categoryId: category.id,
      //       billboardId: input.billboardId,
      //       products: {
      //         connect: [
      //           ...category.products.map((product) => ({ id: product.id })),
      //         ],
      //       },
      //     },
      //   });
      // }

      return ctx.prisma.category.update({
        where: { id: category.id },
        data: {
          attributes: {
            createMany: {
              data: [
                ...input.attributes.map(
                  (attribute: { name: string; values: string }) => {
                    return { ...attribute, storeId: input.storeId };
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
