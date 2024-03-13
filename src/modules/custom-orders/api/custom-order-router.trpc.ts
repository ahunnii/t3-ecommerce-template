import { CustomOrderStatus, CustomOrderType } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { addWeeks } from "date-fns";
import fs from "fs";
import handlers from "handlebars";
import puppeteer from "puppeteer";
import { z } from "zod";
import { storeTheme } from "~/data/config.custom";
import { env } from "~/env.mjs";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { emailService } from "~/services/email";
import NewCustomOrderEmail from "~/services/email/email-templates/admin.custom-order";
import NewCustomOrderCustomer from "~/services/email/email-templates/customer.custom-order";
import { customOrderAdminFormSchema } from "../schema";

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
          product: true,
        },
      });
    }),

  createCustomRequest: publicProcedure
    .input(
      z.object({
        emailClient: z.boolean().optional(),
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

        const emailData = {
          firstName: input.name,
          orderLink: `${env.NEXT_PUBLIC_URL}/admin/${env.NEXT_PUBLIC_STORE_ID}/custom-orders/${customOrder.id}`,
        };

        await emailService.sendEmail<typeof emailData>({
          to: storeTheme.brand.email,
          from: "Trend Anomaly <no-reply@trendanomaly.com>",
          subject: "New Custom Order Request",
          data: emailData,
          template: NewCustomOrderEmail,
        });

        return customOrder;
      } catch (e) {
        console.log(e);
      }
    }),

  createAdminCustomRequest: protectedProcedure
    .input(
      customOrderAdminFormSchema.extend({
        storeId: z.string().optional(),
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
            status: input.status,
            price: null,

            images: {
              createMany: {
                data: [...input.images.map((image: { url: string }) => image)],
              },
            },
          },
        });

        // if (input.status !== "ACCEPTED") {
        //   const emailData = {
        //     firstName: input.name,
        //     orderLink: `${env.NEXT_PUBLIC_URL}/admin/${env.NEXT_PUBLIC_STORE_ID}/custom-orders/${customOrder.id}`,
        //   };

        //   await emailService.sendEmail<typeof emailData>({
        //     to: storeTheme.brand.email,
        //     from: "Trend Anomaly <no-reply@trendanomaly.com>",
        //     subject: "New Custom Order Request",
        //     data: emailData,
        //     template: NewCustomOrderEmail,
        //   });
        // }

        if (input.status === "ACCEPTED") {
          const category = await ctx.prisma.category.findFirst({
            where: {
              storeId: input.storeId ?? env.NEXT_PUBLIC_STORE_ID,
            },
          });

          const product = await ctx.prisma.product.upsert({
            where: {
              id: customOrder.productId! ?? "",
            },
            update: {
              price: input.price ?? 0.0,
              description: input.productDescription,
            },
            create: {
              price: input.price ?? 0.0,
              isArchived: true,
              name: `Custom ${input.type}`,
              categoryId: category?.id ?? "",
              storeId: input.storeId ?? env.NEXT_PUBLIC_STORE_ID,
              description: input.notes ?? input.description,
            },
          });

          await ctx.prisma.customOrderRequest.update({
            where: {
              id: customOrder?.id,
            },
            data: {
              productId: product.id,
            },
          });
        }

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
        productDescription: z.string().optional(),
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
            description: input.productDescription,
          },
          create: {
            price: input.price,
            isArchived: true,
            name: `Custom ${input.type}`,
            categoryId: category?.id ?? "",
            storeId: input.storeId ?? env.NEXT_PUBLIC_STORE_ID,
            description: input.notes ?? input.description,
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

  emailCustomerInvoice: protectedProcedure
    .input(z.object({ customOrderId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });

      try {
        const customOrder = await ctx.prisma.customOrderRequest.findUnique({
          where: {
            id: input.customOrderId,
          },
          include: {
            store: {
              include: {
                address: true,
              },
            },
            product: true,
          },
        });

        const data = {
          productLink: `${env.NEXT_PUBLIC_URL}/product/${customOrder?.product?.id}`,
          product: customOrder?.product?.name ?? "",
          price: new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(Number(customOrder?.product?.price ?? 0.0)),
          customerName: customOrder?.name ?? "",
          email: customOrder?.email ?? "",
          name: customOrder?.store?.name ?? "",

          total: new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(Number(customOrder?.product?.price ?? 0.0)),
          dueDate: addWeeks(new Date(), 1).toDateString(),
          notes: customOrder?.product?.description ?? "",
          invoiceId: customOrder?.id,
        };
        await emailService.sendEmail<typeof data>({
          to: customOrder!.email,
          from: "Trend Anomaly <no-reply@trendanomaly.com>",
          subject: "New Invoice from Trend Anomaly",
          data: data,
          template: NewCustomOrderCustomer,
        });

        return {
          status: 200,
          message: "Email Sent",
        };
      } catch (e) {
        console.error("Email error: ", e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while sending the email.",
        });
      }
    }),

  generateCustomOrderInvoice: protectedProcedure
    .input(z.object({ customOrderId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });

      try {
        const customOrder = await ctx.prisma.customOrderRequest.findUnique({
          where: {
            id: input.customOrderId,
          },
          include: {
            store: {
              include: {
                address: true,
              },
            },
            product: true,
          },
        });

        const file = fs.readFileSync(
          "./src/modules/custom-orders/invoice-template.html",
          "utf8"
        );

        // compile the file with handlebars and inject the customerName variable
        const template = handlers.compile(`${file}`);
        const html = template({
          customerName: customOrder?.name ?? "",
          customerEmail: customOrder?.email ?? "",
          product: customOrder?.product?.name ?? "",
          productCost: new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(Number(customOrder?.product?.price ?? 0.0)),
          businessName: customOrder?.store?.name ?? "",
          businessStreet: customOrder?.store?.address?.street ?? "",
          businessCity: customOrder?.store?.address?.city ?? "",
          businessState: customOrder?.store?.address?.state ?? "",
          businessPostalCode: customOrder?.store?.address?.postal_code ?? "",
          productDescription: customOrder?.product?.description ?? "",
          invoiceNumber: customOrder?.id,
          createdAt: new Date().toDateString(),
          businessLogo: `${env.NEXT_PUBLIC_URL}/custom/logo.png`,
          productLink: `${env.NEXT_PUBLIC_URL}/product/${customOrder?.product?.id}`,
          dueAt: addWeeks(new Date(), 1).toDateString(),
          productTotal: new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(Number(customOrder?.product?.price ?? 0.0)),
        });

        // simulate a chrome browser with puppeteer and navigate to a new page
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // set our compiled html template as the pages content
        // then waitUntil the network is idle to make sure the content has been loaded
        await page.setContent(html, { waitUntil: "networkidle0" });

        // convert the page to pdf with the .pdf() method
        const pdf = await page.pdf({ format: "A4" });
        await browser.close();

        //Convert results to base64
        const base64 = Buffer.from(pdf).toString("base64");

        return base64;
      } catch (e) {
        console.error("Email error: ", e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while sending the email.",
        });
      }
    }),

  searchForCustomOrders: protectedProcedure
    .input(z.object({ queryString: z.string() }))
    .query(async ({ ctx, input }) => {
      if (input.queryString === "") return [];

      const orders = await ctx.prisma.customOrderRequest.findMany({
        where: {
          storeId: env.NEXT_PUBLIC_STORE_ID,
          OR: [
            { name: { contains: input.queryString } },

            { email: { contains: input.queryString } },

            { description: { contains: input.queryString } },

            { notes: { contains: input.queryString } },

            {
              product: {
                name: { contains: input.queryString },
              },
            },
          ],
        },
        include: { product: true },
        orderBy: { createdAt: "desc" },
      });

      return orders;
    }),
});
