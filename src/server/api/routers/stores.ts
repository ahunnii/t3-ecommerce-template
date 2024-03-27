import { TRPCError } from "@trpc/server";
import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";
import { env } from "~/env.mjs";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { hygraphClient } from "~/server/hygraph/client";

const hygraph = new GraphQLClient(
  "https://us-east-1-shared-usea1-02.cdn.hygraph.com/content/clu7v2u9q0euu07w7ppzikbsr/master"
);

type AboutPageResponse = {
  abouts: {
    id: string;
    content: string;
  }[];
};

export const storeRouter = createTRPCRouter({
  getAllStores: protectedProcedure.query(({ ctx }) => {
    if (ctx.session.user.role !== "ADMIN")
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are not authorized to perform this action.",
      });

    return ctx.prisma.store.findMany({});
  }),

  getStore: publicProcedure
    .input(
      z.object({
        storeId: z.string().optional(),
        includeContent: z.boolean().optional().default(false),
        includeSocials: z.boolean().optional().default(false),
      })
    )
    .query(({ ctx, input }) => {
      if (!input.storeId && !env.NEXT_PUBLIC_STORE_ID)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "NEXT_PUBLIC_STORE_ID is not set.",
        });

      return ctx.prisma.store.findUnique({
        where: { id: input.storeId ?? env.NEXT_PUBLIC_STORE_ID },
        include: {
          gallery: true,
          address: true,
          content: input.includeContent,
          socialMedia: input.includeSocials,
        },
      });
    }),

  getAboutPage: publicProcedure
    .input(
      z.object({
        storeId: z.string().optional(),
      })
    )
    .query(({ ctx, input }) => {
      if (!input.storeId && !env.NEXT_PUBLIC_STORE_ID)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "NEXT_PUBLIC_STORE_ID is not set.",
        });

      return ctx.prisma.store.findUnique({
        where: { id: input.storeId ?? env.NEXT_PUBLIC_STORE_ID },
        include: {
          content: {
            select: {
              aboutPage: true,
            },
          },
        },
      });
    }),

  getHero: publicProcedure
    .input(
      z.object({
        storeId: z.string().optional(),
      })
    )
    .query(({ ctx, input }) => {
      if (!input.storeId && !env.NEXT_PUBLIC_STORE_ID)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "NEXT_PUBLIC_STORE_ID is not set.",
        });

      return ctx.prisma.store.findUnique({
        where: { id: input.storeId ?? env.NEXT_PUBLIC_STORE_ID },
        select: {
          content: {
            select: {
              heroImg: true,
            },
          },
        },
      });
    }),

  getSocials: publicProcedure
    .input(
      z.object({
        storeId: z.string().optional(),
      })
    )
    .query(({ ctx, input }) => {
      if (!input.storeId && !env.NEXT_PUBLIC_STORE_ID)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "NEXT_PUBLIC_STORE_ID is not set.",
        });

      return ctx.prisma.store.findUnique({
        where: { id: input.storeId ?? env.NEXT_PUBLIC_STORE_ID },
        include: {
          socialMedia: true,
        },
      });
    }),
  createStore: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });

      return ctx.prisma.store.create({
        data: {
          name: input.name,
          userId: ctx.session.user.id,
          content: {
            create: {
              aboutPage: null,
            },
          },
          socialMedia: {
            create: {
              instagram: null,
            },
          },
        },
      });
    }),

  updateStore: protectedProcedure
    .input(
      z.object({
        storeId: z.string(),
        name: z.string(),
        address: z.object({
          street: z.string(),
          additional: z.string().optional(),
          city: z.string(),
          state: z.string(),
          postalCode: z.string(),
          country: z.string(),
        }),
        hasFreeShipping: z.boolean(),
        minFreeShipping: z.coerce.number().nonnegative().optional(),
        hasPickup: z.boolean(),
        maxPickupDistance: z.coerce.number().nonnegative().optional(),
        hasFlatRate: z.boolean(),
        flatRateAmount: z.coerce.number().nonnegative().optional(),

        content: z
          .object({
            aboutPage: z.string().optional(),
            heroImg: z.string().optional(),
          })
          .optional(),
        socialMedia: z
          .object({
            facebook: z.string().optional(),
            instagram: z.string().optional(),
            twitter: z.string().optional(),
            tikTok: z.string().optional(),
          })
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });
      }

      return ctx.prisma.store.update({
        where: { id: input.storeId },
        data: {
          name: input.name,
          address: {
            create: {
              street: input.address.street,
              additional: input.address.additional,
              city: input.address.city,
              state: input.address.state,
              postal_code: input.address.postalCode,
              country: input.address.country,
            },
          },
          hasFreeShipping: input.hasFreeShipping,
          minFreeShipping: input.minFreeShipping,
          hasPickup: input.hasPickup,
          maxPickupDistance: input.maxPickupDistance,
          hasFlatRate: input.hasFlatRate,
          flatRateAmount: input.flatRateAmount,
          content: {
            upsert: {
              create: {
                aboutPage: input?.content?.aboutPage,
                heroImg: input?.content?.heroImg,
              },
              update: {
                aboutPage: input?.content?.aboutPage,
                heroImg: input?.content?.heroImg,
              },
            },
          },
          socialMedia: {
            upsert: {
              create: {
                facebook: input?.socialMedia?.facebook,
                instagram: input?.socialMedia?.instagram,
                twitter: input?.socialMedia?.twitter,
                tikTok: input?.socialMedia?.tikTok,
              },
              update: {
                facebook: input?.socialMedia?.facebook,
                instagram: input?.socialMedia?.instagram,
                twitter: input?.socialMedia?.twitter,
                tikTok: input?.socialMedia?.tikTok,
              },
            },
          },
        },
      });
    }),

  deleteStore: protectedProcedure
    .input(z.object({ storeId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });
      }

      return ctx.prisma.store.delete({
        where: { id: input.storeId },
      });
    }),

  getAboutPageData: publicProcedure.query(async ({ ctx }) => {
    const cmsResponse = await hygraph.request(
      `
            {
                abouts {
                        id
                        content
                }
            }
        `
    );

    const aboutContent = (cmsResponse as AboutPageResponse)?.abouts?.[0];
    return aboutContent;
  }),

  updateAboutPageData: protectedProcedure
    .input(z.object({ content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });
      }

      const updateAbout = gql`
        mutation updateAbout($content: String) {
          updateAbout(data: { content: $content }, where: { slug: "about" }) {
            id
            content
          }
          publishAbout(where: { slug: "about" }) {
            content
          }
        }
      `;

      const cmsResponse = await hygraphClient.request(updateAbout, {
        content: input.content,
      });

      console.log(cmsResponse);

      // const aboutContent = (cmsResponse as AboutPageResponse)?.abouts?.[0];
      return cmsResponse;
    }),
});
