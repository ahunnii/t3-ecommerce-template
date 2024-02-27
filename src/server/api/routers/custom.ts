import {
  CustomOrderStatus,
  CustomOrderType,
  type ShippingType,
} from "@prisma/client";

import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { storeTheme } from "~/data/config.custom";
import { env } from "~/env.mjs";
import { customRequestFormSchema } from "~/modules/custom-orders/types";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { emailService } from "~/services/email_new";

export const customRouter = createTRPCRouter({
  getCustomRequests: protectedProcedure
    .input(z.object({ storeId: z.string().optional() }))
    .query(({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });

      return ctx.prisma.customOrderRequest.findMany({
        where: {
          storeId: input.storeId ?? env.NEXT_PUBLIC_STORE_ID,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          images: true,
          store: {
            include: {
              address: true,
            },
          },
          product: true,
        },
      });
    }),
  getCustomRequest: protectedProcedure
    .input(z.object({ customOrderId: z.string() }))
    .query(({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });

      return ctx.prisma.customOrderRequest.findUnique({
        where: {
          id: input.customOrderId,
        },
        include: {
          images: true,
        },
      });
    }),

  createCustomRequest: publicProcedure
    .input(
      z.object({
        storeId: z.string().optional(),
        email: z.string().email(),
        name: z.string(),
        description: z.string(),
        images: z.object({ url: z.string() }).array(),
        status: z.nativeEnum(CustomOrderStatus),
        type: z.nativeEnum(CustomOrderType),
        price: z.number().min(0).nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const customOrder = await ctx.prisma.customOrderRequest.create({
          data: {
            name: input.name,
            email: input.email,
            description: input.description,
            type: input.type,
            storeId: input.storeId ?? env.NEXT_PUBLIC_STORE_ID,
            status: CustomOrderStatus.PENDING,
            price: null,

            images: {
              createMany: {
                data: [...input.images.map((image: { url: string }) => image)],
              },
            },
          },
        });

        // if (!ctx.session || ctx?.session?.user?.role !== "ADMIN") {
        //   void emailService.sendCustomOrderToAdmin({
        //     data: {
        //       email: storeTheme.brand.email,
        //       name: "Andrew",
        //       url: `${env.NEXT_PUBLIC_URL}/admin/custom-orders/${customOrder.id}`,
        //     },
        //   });
        // }

        return customOrder;
      } catch (e) {
        console.log(e);
      }
    }),

  updateCustomRequest: protectedProcedure
    .input(
      z.object({
        storeId: z.string().optional(),
        customOrderId: z.string(),
        email: z.string().email(),
        name: z.string(),
        description: z.string(),
        notes: z.string().optional(),
        images: z.object({ url: z.string() }).array(),
        status: z.nativeEnum(CustomOrderStatus),
        type: z.nativeEnum(CustomOrderType),
        price: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });

      if (input.customOrderId === undefined) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });
      }

      const orderRequest = await ctx.prisma.customOrderRequest.update({
        where: {
          id: input.customOrderId,
        },
        data: {
          name: input.name,
          email: input.email,
          description: input.description,
          notes: input.notes,
          type: input.type,
          storeId: input.storeId ?? env.NEXT_PUBLIC_STORE_ID,
          status: input.status,
          price: input.price,
          images: {
            deleteMany: {},
          },
        },
      });

      if (input.status === "ACCEPTED") {
        const category = await ctx.prisma.category.findFirst({
          where: {
            storeId: input.storeId ?? env.NEXT_PUBLIC_STORE_ID,
          },
        });

        const product = await ctx.prisma.product.upsert({
          where: {
            id: orderRequest.productId! ?? "",
            // storeId: input.storeId ?? env.NEXT_PUBLIC_STORE_ID,
            // customOrder: {
            // id: input.customOrderId,
            // },
          },
          update: {
            price: input.price,
            description: input.notes,
          },
          create: {
            price: input.price,
            isArchived: true,
            name: `Custom ${input.type}`,
            categoryId: category?.id ?? "",
            storeId: input.storeId ?? env.NEXT_PUBLIC_STORE_ID,
            description: input.notes,
          },
        });

        await ctx.prisma.customOrderRequest.update({
          where: {
            id: input.customOrderId,
          },
          data: {
            productId: product.id,
          },
        });
      }

      if (input.status === "REJECTED") {
        await ctx.prisma.customOrderRequest.update({
          where: {
            id: input.customOrderId,
          },
          data: {
            product: {
              delete: true,
            },
          },
        });
      }

      return ctx.prisma.customOrderRequest.update({
        where: {
          id: input.customOrderId,
        },
        data: {
          images: {
            createMany: {
              data: [...input.images.map((image: { url: string }) => image)],
            },
          },
        },
      });
    }),

  deleteCustomRequest: protectedProcedure
    .input(z.object({ customOrderId: z.string() }))
    .mutation(({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });

      return ctx.prisma.customOrderRequest.delete({
        where: {
          id: input.customOrderId,
        },
      });
    }),
});
