import { ProductStatus, ProductType } from "@prisma/client";

import { TRPCError } from "@trpc/server";
import { rest, uniqueId } from "lodash";
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
import { imageSchema, variantSchema } from "../schema";

export const productsRouter = createTRPCRouter({
  // Queries for the frontend
  getAllStoreProducts: publicProcedure
    .input(
      z.object({
        storeId: z.string().optional(),
        queryString: z.string().optional(),
        isFeatured: z.boolean().optional(),
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
          status: "ACTIVE",
          isFeatured: input.isFeatured ?? undefined,
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
    .input(
      z.object({
        storeId: z.string().optional(),
        categoryId: z.string(),
        collectionId: z.string().optional(),
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
          storeId: input?.storeId ?? env.NEXT_PUBLIC_STORE_ID,
          OR: [
            { collections: { some: { id: input.collectionId } } },
            { category: { id: input.categoryId } },
          ],
          status: "ACTIVE",
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
    .input(
      z.object({
        productId: z.string(),
        status: z.nativeEnum(ProductStatus).optional(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.product.findUnique({
        where: { id: input.productId, status: input.status },
        include: {
          store: {
            select: {
              id: true,
              hasFlatRate: true,
              hasFreeShipping: true,
              flatRateAmount: true,
              minFreeShipping: true,
            },
          },
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

        type: z.nativeEnum(ProductType),
        status: z.nativeEnum(ProductStatus),

        weight: z.coerce.number().min(0).optional(),
        length: z.coerce.number().min(0).optional(),
        width: z.coerce.number().min(0).optional(),
        height: z.coerce.number().min(0).optional(),
        estimatedCompletion: z.coerce.number().min(0).optional(),
        shippingCost: z.coerce.number().min(0).optional(),
        tags: z.array(z.object({ name: z.string() })),
        materials: z.array(z.object({ name: z.string() })),

        images: z.array(z.string()),
        variants: z.array(variantSchema),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });

      const slug = input.name.toLowerCase().replace(/ /g, "-");

      const checkForUniqueSlug = await ctx.prisma.product.count({
        where: {
          slug,
        },
      });

      const duplicateSKUs = input.variants
        .filter((variant) => variant.sku !== undefined)
        .map((variant) => variant.sku!);

      const checkForDuplicateSKUs = await ctx.prisma.variation.count({
        where: {
          sku: {
            in: duplicateSKUs,
          },
        },
      });

      if (checkForDuplicateSKUs > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Duplicate SKUs found.",
        });
      }

      return ctx.prisma.product.create({
        data: {
          ...input,
          tags: input.tags.map((tag) => tag.name),
          materials: input.materials.map((materials) => materials.name),

          images: {
            createMany: {
              data: input.images.map((url) => ({ url })),
            },
          },
          variants: {
            createMany: {
              data: [
                ...input.variants.map((variant) => ({
                  ...variant,
                  sku: variant.sku === "" ? null : variant.sku,
                  imageUrl: variant.imageUrl === "" ? null : variant.imageUrl,
                })),
              ],
            },
          },
          slug:
            checkForUniqueSlug > 0 ? `${slug}-${uniqueId().slice(0, 3)}` : slug,
        },
      });
    }),

  updateProduct: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        slug: z.string().optional(),
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
        images: z.array(z.string()),
        variants: z.array(variantSchema),
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
        const slugProduct = await ctx.prisma.product.findUnique({
          where: { id: input.productId },
          select: {
            name: true,
            slug: true,
          },
        });

        if (!slugProduct)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Product not found.",
          });

        let slug = slugProduct.slug;

        if (slugProduct.name !== input.name) {
          slug = input.name.toLowerCase().replace(/ /g, "-");
          // Ensure the slug is unique by appending a number if necessary
          let unique = false;
          let suffix = 1;
          while (!unique) {
            const slugToCheck: string = suffix > 1 ? `${slug}-${suffix}` : slug;
            const existingSlug = await ctx.prisma.product.findUnique({
              where: { slug: slugToCheck },
            });
            if (!existingSlug) {
              unique = true;
              slug = slugToCheck;
            } else {
              suffix++;
            }
          }
        }

        const categoryCollection = await ctx.prisma.product.findUnique({
          where: { id: input.productId },
          select: {
            category: {
              select: {
                collection: true,
              },
            },
          },
        });

        if (categoryCollection?.category?.collection) {
          await ctx.prisma.product.update({
            where: { id: input.productId },
            data: {
              collections: {
                disconnect: {
                  id: categoryCollection.category.collection.id,
                },
              },
            },
            select: {
              category: { select: { collection: true } },
            },
          });
        }

        const existingVariants = await ctx.prisma.variation.count({
          where: {
            sku: {
              in: input.variants
                .filter(
                  (variant) => variant.sku !== undefined || variant.sku !== ""
                )
                .map((variant) => variant.sku!),
            },
          },
        });

        if (existingVariants > 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Duplicate SKUs found.",
          });
        }

        const { productId, ...rest } = input;

        const product = await ctx.prisma.product.update({
          where: {
            id: productId,
          },
          data: {
            ...rest,
            slug,
            images: { deleteMany: {} },
            variants: { deleteMany: {} },
            tags: input.tags.map((tag) => tag.name),
            materials: input.materials.map((materials) => materials.name),
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
                data: input.images.map((url) => ({ url })),
              },
            },

            variants: {
              createMany: {
                data: [
                  ...input.variants.map((variant) => ({
                    ...variant,
                    sku: variant.sku === "" ? null : variant.sku,
                    imageUrl: variant.imageUrl === "" ? null : variant.imageUrl,
                  })),
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
