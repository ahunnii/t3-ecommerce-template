import { Variation } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const productsRouter = createTRPCRouter({
  getAllProducts: publicProcedure
    .input(z.object({ storeId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.product.findMany({
        where: {
          storeId: input.storeId,
        },
        include: {
          category: true,
          size: true,
          color: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),
  getProduct: publicProcedure
    .input(z.object({ productId: z.string() }))
    .query(({ ctx, input }) => {
      if (!input.productId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Product id is required",
        });
      }

      return ctx.prisma.product.findUnique({
        where: {
          id: input.productId,
        },
        include: {
          images: true,
          variants: true,
          category: {
            include: {
              attributes: true,
            },
          },
        },
      });
    }),
  getDetailedProduct: publicProcedure
    .input(z.object({ productId: z.string() }))
    .query(({ ctx, input }) => {
      if (!input.productId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Product id is required",
        });
      }

      return ctx.prisma.product.findUnique({
        where: {
          id: input.productId,
        },
        include: {
          images: true,
          variants: true,
          category: true,
          size: true,
          color: true,
        },
      });
    }),
  createProduct: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        price: z.number(),
        categoryId: z.string(),
        colorId: z.string().optional(),
        sizeId: z.string().optional(),
        description: z.string().optional(),
        quantity: z.number(),
        storeId: z.string(),
        isFeatured: z.boolean().optional(),
        isArchived: z.boolean().optional(),
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
      if (!input.name) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Name is required",
        });
      }

      if (!input.price) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Price is required",
        });
      }

      if (!input.categoryId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Category id is required",
        });
      }

      // if (!input.colorId) {
      //   throw new TRPCError({
      //     code: "BAD_REQUEST",
      //     message: "Color id is required",
      //   });
      // }

      // if (!input.sizeId) {
      //   throw new TRPCError({
      //     code: "BAD_REQUEST",
      //     message: "Size id is required",
      //   });
      // }

      if (!input.storeId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Store id is required",
        });
      }

      if (!input.images ?? !input.images.length) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Images is required",
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
              message: "Product id does not belong to current user",
            });
          }
        })
        .then(() => {
          return ctx.prisma.product.create({
            data: {
              name: input.name,
              price: input.price,
              isFeatured: input.isFeatured,
              isArchived: input.isArchived,
              categoryId: input.categoryId,
              colorId: input.colorId,
              sizeId: input.sizeId,
              storeId: input.storeId,
              images: {
                createMany: {
                  data: [
                    ...input.images.map((image: { url: string }) => image),
                  ],
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

  updateProduct: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        name: z.string(),
        price: z.number(),
        categoryId: z.string(),
        colorId: z.string().optional(),
        sizeId: z.string().optional(),
        storeId: z.string(),
        isFeatured: z.boolean().optional(),
        isArchived: z.boolean().optional(),
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
          })
        ),
      })
    )
    .mutation(({ ctx, input }) => {
      if (!input.name) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Name is required",
        });
      }

      if (!input.price) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Price is required",
        });
      }

      if (!input.categoryId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Category id is required",
        });
      }

      // if (!input.colorId) {
      //   throw new TRPCError({
      //     code: "BAD_REQUEST",
      //     message: "Color id is required",
      //   });
      // }

      // if (!input.sizeId) {
      //   throw new TRPCError({
      //     code: "BAD_REQUEST",
      //     message: "Size id is required",
      //   });
      // }

      if (!input.storeId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Store id is required",
        });
      }

      if (!input.images?.length) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Images is required",
        });
      }

      // if (!input.variants || !input.variants.length) {
      //   throw new TRPCError({
      //     code: "BAD_REQUEST",
      //     message: "Variants is required",
      //   });
      // }

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
              message: "Product id does not belong to current user",
            });
          }
        })
        .then(() => {
          return ctx.prisma.product
            .update({
              where: {
                id: input.productId,
              },
              data: {
                name: input.name,
                price: input.price,
                isFeatured: input.isFeatured,
                isArchived: input.isArchived,
                categoryId: input.categoryId,
                colorId: input.colorId,
                sizeId: input.sizeId,
                description: input.description,
                quantity: input.quantity,
                images: {
                  deleteMany: {},
                },
                variants: {
                  deleteMany: {},
                },
              },
            })
            .then(() => {
              return ctx.prisma.product.update({
                where: {
                  id: input.productId,
                },
                data: {
                  images: {
                    createMany: {
                      data: [
                        ...input.images.map((image: { url: string }) => image),
                      ],
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
                },
              });
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
  deleteProduct: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        storeId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      if (!input.productId)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Product id is required",
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
              message: "Product id does not belong to current user",
            });
        })
        .then(() => {
          return ctx.prisma.product.delete({
            where: {
              id: input.productId,
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