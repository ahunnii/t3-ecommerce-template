import { ProductStatus, ProductType } from "@prisma/client";

import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { env } from "~/env.mjs";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import type { CartItem } from "~/types";

import {
  extractQueryString,
  filterProductsByVariants,
} from "~/utils/filtering";

export const productsRouter = createTRPCRouter({
  // Queries for the frontend
  getAllStoreProducts: publicProcedure
    .input(
      z.object({
        storeId: z.string().optional(),
        isFeatured: z.boolean().optional(),
        isArchived: z.boolean().optional(),
        queryString: z.string().optional(),
        categoryId: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!input.storeId && !env.NEXT_PUBLIC_STORE_ID)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "NEXT_PUBLIC_STORE_ID is not set.",
        });

      const results = extractQueryString(input.queryString ?? "");

      const products = await ctx.prisma.product.findMany({
        where: {
          storeId: input.storeId ?? env.NEXT_PUBLIC_STORE_ID,
          isFeatured: input.isFeatured,
          categoryId: input.categoryId,
          status: input.isArchived ? "ARCHIVED" : undefined,
        },
        include: {
          collections: {
            include: {
              discounts: {
                where: {
                  active: true,
                },
                take: 1,
              },
            },
          },
          category: {
            include: {
              attributes: true,
            },
          },
          discounts: {
            where: {
              active: true,
            },
            take: 1,
          },
          variants: true,
          images: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const filteredProducts = filterProductsByVariants(
        products,
        results.names,
        results.values
      );

      return input.queryString ? filteredProducts : products;
    }),

  getAllSuggestedProducts: publicProcedure
    .input(z.object({ storeId: z.string().optional(), categoryId: z.string() }))
    .query(({ ctx, input }) => {
      if (!input.storeId && !env.NEXT_PUBLIC_STORE_ID)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "NEXT_PUBLIC_STORE_ID is not set.",
        });

      return ctx.prisma.product.findMany({
        where: {
          storeId: input?.storeId ?? env.NEXT_PUBLIC_STORE_ID,
          categoryId: input.categoryId,
          NOT: {
            status: "ARCHIVED",
          },
        },
        include: {
          category: true,
          images: true,
          discounts: {
            where: {
              active: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),

  // Queries for the admin
  getAllProducts: publicProcedure
    .input(
      z.object({
        storeId: z.string().optional(),
        isFeatured: z.boolean().optional(),
        collectionId: z.string().optional(),
        isArchived: z.boolean().optional(),
        includeCustom: z.boolean().optional(),
      })
    )
    .query(({ ctx, input }) => {
      if (!input.storeId && !env.NEXT_PUBLIC_STORE_ID)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "NEXT_PUBLIC_STORE_ID is not set.",
        });

      return ctx.prisma.product.findMany({
        where: {
          storeId: input.storeId ?? env.NEXT_PUBLIC_STORE_ID,
          isFeatured: input.isFeatured ?? undefined,
          status: input.includeCustom
            ? undefined
            : input.isArchived
            ? "ARCHIVED"
            : undefined,

          collections: input.collectionId
            ? {
                some: {
                  id: input.collectionId ?? undefined,
                },
              }
            : {},
        },
        include: {
          customOrder: input.includeCustom,
          collections: {
            include: {
              discounts: true,
            },
          },
          images: true,
          variants: true,
          discounts: true,

          category: {
            include: {
              attributes: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),

  getProduct: publicProcedure
    .input(z.object({ productId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.product.findUnique({
        where: { id: input.productId },
        include: {
          collections: {
            include: {
              discounts: {
                where: {
                  active: true,
                },
              },
            },
          },
          images: true,
          discounts: {
            where: {
              active: true,
            },
          },
          variants: true,
          category: {
            include: {
              attributes: true,
            },
          },
        },
      });
    }),

  getCartProducts: publicProcedure
    .input(
      z.object({
        products: z.array(
          z.object({
            productId: z.string(),
            variantId: z.string().nullish(),
            quantity: z.number(),
          })
        ),
      })
    )
    .query(async ({ ctx, input }) => {
      // Fetch all unique product IDs and variant IDs from the cart items
      const productIds = [
        ...new Set(input.products.map((item) => item.productId)),
      ];
      const variantIds = [
        ...new Set(
          input.products
            .filter((item) => item.variantId !== null)
            .map((item) => item.variantId!)
        ),
      ];

      // Fetch all products and variants in one go
      const [products, variants] = await Promise.all([
        ctx.prisma.product.findMany({
          where: { id: { in: productIds } },
          include: {
            images: true,
            variants: true,
            category: {
              include: {
                attributes: true,
              },
            },
          },
        }),
        ctx.prisma.variation.findMany({
          where: { id: { in: variantIds } },
        }),
      ]);

      const detailedCartItems = input.products.map((cartItem) => ({
        product: products.find((p) => p.id === cartItem.productId),
        variant: cartItem.variantId
          ? variants.find((v) => v.id === cartItem.variantId)
          : null,
        quantity: cartItem.quantity,
      })) as CartItem[];

      return detailedCartItems;
    }),

  getDetailedProduct: publicProcedure
    .input(z.object({ productId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.product.findUnique({
        where: {
          id: input.productId,
        },
        include: {
          images: true,
          variants: true,
          category: true,
        },
      });
    }),

  createProduct: protectedProcedure
    .input(
      z.object({
        storeId: z.string(),
        categoryId: z.string(),

        name: z.string(),
        price: z.number(),
        quantity: z.number(),
        description: z.string(),

        featuredImage: z.string(),

        isFeatured: z.boolean().optional(),

        shippingCost: z.coerce.number().min(0).optional(),

        type: z.nativeEnum(ProductType),
        status: z.nativeEnum(ProductStatus),

        weight: z.coerce.number().min(0).optional(),
        length: z.coerce.number().min(0).optional(),
        width: z.coerce.number().min(0).optional(),
        height: z.coerce.number().min(0).optional(),
        estimatedCompletion: z.coerce.number().min(0).optional(),
        tags: z.array(z.object({ name: z.string() })),
        materials: z.array(z.object({ name: z.string() })),

        images: z.array(
          z.object({
            url: z.string(),
          })
        ),

        variants: z.array(
          z.object({
            names: z.string(),
            values: z.string(),
            price: z.number(),
            quantity: z.number(),
          })
        ),
      })
    )
    .mutation(({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });

      return ctx.prisma.product.create({
        data: {
          name: input.name,
          price: input.price,
          isFeatured: input.isFeatured,
          status: input.status,
          type: input.type,
          categoryId: input.categoryId,
          description: input.description,
          estimatedCompletion: input.estimatedCompletion ?? 0,
          storeId: input.storeId,
          quantity: input.quantity,
          featuredImage: input.featuredImage,
          images: {
            createMany: {
              data: [...input.images.map((image: { url: string }) => image)],
            },
          },
          variants: {
            createMany: {
              data: [
                ...input.variants.map(
                  (variant: {
                    names: string;
                    values: string;
                    price: number;
                    quantity: number;
                  }) => variant
                ),
              ],
            },
          },

          tags: input.tags.map((tag) => tag.name),
          materials: input.materials.map((materials) => materials.name),
          shippingCost: input.shippingCost,

          weight: input.weight,
          length: input.length,
          width: input.width,
          height: input.height,
        },
      });
    }),

  updateProduct: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        name: z.string(),
        price: z.number(),
        categoryId: z.string(),
        estimatedCompletion: z.coerce.number().min(0).optional(),
        storeId: z.string(),
        isFeatured: z.boolean().optional(),

        type: z.nativeEnum(ProductType),
        status: z.nativeEnum(ProductStatus),

        description: z.string().optional(),

        quantity: z.number(),
        images: z.array(
          z.object({
            url: z.string(),
          })
        ),
        variants: z.array(
          z.object({
            names: z.string(),
            values: z.string(),
            price: z.number(),
            quantity: z.number(),
            sku: z.string().optional(),
            imageUrl: z.string().optional(),
          })
        ),
        tags: z.array(z.object({ name: z.string() })),
        materials: z.array(z.object({ name: z.string() })),
        featuredImage: z.string(),
        shippingCost: z.coerce.number().min(0).optional(),

        weight: z.coerce.number().min(0).optional(),
        length: z.coerce.number().min(0).optional(),
        width: z.coerce.number().min(0).optional(),
        height: z.coerce.number().min(0).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });

      try {
        const categoryCollection = await ctx.prisma.product.findUnique({
          where: {
            id: input.productId,
          },
          include: {
            category: {
              include: {
                collection: true,
              },
            },
          },
        });

        if (categoryCollection?.category?.collection) {
          await ctx.prisma.product.update({
            where: {
              id: input.productId,
            },
            data: {
              collections: {
                disconnect: {
                  id: categoryCollection.category.collection.id,
                },
              },
            },
            include: {
              category: {
                include: {
                  collection: true,
                },
              },
            },
          });
        }

        const existingVariants = await ctx.prisma.variation.findMany({
          where: {
            productId: input.productId,
          },
          select: {
            sku: true,
          },
        });

        const duplicateSkus = input.variants.filter((variant) =>
          existingVariants.some(
            (existingVariant) => existingVariant.sku === variant.sku
          )
        );

        if (duplicateSkus.length > 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Duplicate SKUs found.",
          });
        }

        const product = await ctx.prisma.product.update({
          where: {
            id: input.productId,
          },
          data: {
            name: input.name,
            price: input.price,
            isFeatured: input.isFeatured,
            status: input.status,
            type: input.type,
            categoryId: input.categoryId,
            estimatedCompletion: input.estimatedCompletion ?? 0,
            description: input.description,
            quantity: input.quantity,
            featuredImage: input.featuredImage,
            images: {
              deleteMany: {},
            },
            variants: {
              deleteMany: {},
            },
            tags: input.tags.map((tag) => tag.name),
            materials: input.materials.map((materials) => materials.name),

            shippingCost: input.shippingCost,

            weight: input.weight,
            length: input.length,
            width: input.width,
            height: input.height,
          },
          include: {
            category: {
              include: {
                collection: true,
              },
            },
          },
        });

        if (product.category.collection) {
          await ctx.prisma.collection.update({
            where: { id: product.category.collection.id },
            data: {
              products: {
                connect: {
                  id: product.id,
                },
              },
            },
          });
        }

        return ctx.prisma.product.update({
          where: {
            id: input.productId,
          },
          data: {
            images: {
              createMany: {
                data: [...input.images.map((image: { url: string }) => image)],
              },
            },

            variants: {
              createMany: {
                data: [
                  ...input.variants.map(
                    (variant: {
                      names: string;
                      values: string;
                      price: number;
                      quantity: number;
                      sku?: string;
                      imageUrl?: string;
                    }) => ({
                      ...variant,
                      sku: variant.sku === "" ? null : variant.sku,
                      imageUrl:
                        variant.imageUrl === "" ? null : variant.imageUrl,
                    })
                  ),
                ],
              },
            },
          },
        });
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong. Please try again later.",
          cause: err,
        });
      }
    }),
  deleteProduct: protectedProcedure
    .input(z.object({ productId: z.string() }))
    .mutation(({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });

      return ctx.prisma.product.delete({
        where: { id: input.productId },
      });
    }),

  searchForProducts: publicProcedure
    .input(z.object({ queryString: z.string() }))
    .query(async ({ ctx, input }) => {
      if (input.queryString === "") return [];

      const products = await ctx.prisma.product.findMany({
        where: {
          storeId: env.NEXT_PUBLIC_STORE_ID,
          OR: [
            { name: { contains: input.queryString } },

            { description: { contains: input.queryString } },

            {
              tags: { has: input.queryString },
            },
            {
              materials: { has: input.queryString },
            },
            {
              collections: {
                some: {
                  name: { contains: input.queryString },
                },
              },
            },
            {
              category: {
                name: { contains: input.queryString },
              },
            },
          ],
        },
        include: {
          collections: true,
          category: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return products;
    }),
});
