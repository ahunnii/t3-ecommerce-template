import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { shippoClient } from "~/server/shippo/client";

export const shippingRouter = createTRPCRouter({
  validateAddress: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        street1: z.string(),
        street2: z.string(),
        city: z.string(),
        state: z.string(),
        zip: z.string(),
        country: z.string(),
        phone: z.string(),
      })
    )
    .query(async ({ input }) => {
      const address = await shippoClient.address.create({
        street1: input.street1,
        street2: input.street2,
        city: input.city,
        state: input.state,
        zip: input.zip,
        country: input.country,
        validate: true,
        name: input.name,
      });

      return {
        data: address,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
