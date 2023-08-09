import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const storeRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  getAllSizes: protectedProcedure
    .input(z.object({ storeId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.size.findMany({
        where: {
          storeId: input.storeId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),
  getAllStores: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.store.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
  createStore: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.store.create({
        data: {
          name: input.name,
          userId: ctx.session.user.id,
        },
      });
    }),
});
