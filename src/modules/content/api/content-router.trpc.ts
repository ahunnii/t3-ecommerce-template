import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { hygraphClient, hygraphClientPublic } from "~/server/hygraph/client";
import {
  getPage,
  getPages,
  updatePage as updateSinglePage,
} from "../graphql/pages";
import type { BasicGraphQLPage, BasicGraphQLPages } from "../types";

export const contentRouter = createTRPCRouter({
  getPage: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const cmsResponse = await hygraphClientPublic.request(getPage, {
        slug: input.slug,
      });

      return cmsResponse as BasicGraphQLPage;
    }),

  getPages: publicProcedure.query(async () => {
    const cmsResponse = await hygraphClientPublic.request(getPages);

    return (cmsResponse as BasicGraphQLPages).pages;
  }),

  updatePage: protectedProcedure
    .input(
      z.object({ content: z.string(), slug: z.string(), title: z.string() })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });
      }

      const cmsResponse = await hygraphClient.request(updateSinglePage, {
        content: input.content,
        slug: input.slug,
        title: input.title,
      });

      return cmsResponse as BasicGraphQLPage;
    }),
});
