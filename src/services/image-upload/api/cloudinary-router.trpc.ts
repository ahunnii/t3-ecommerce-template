import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { env } from "~/env.mjs";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const cloudinaryRouter = createTRPCRouter({
  getUsage: protectedProcedure
    .input(z.object({ format: z.boolean().optional() }))
    .query(async ({ ctx }) => {
      if (ctx.session.user.role !== "ADMIN")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });
      const response = await fetch(
        `https:/api.cloudinary.com/v1_1/${env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/usage`,
        {
          credentials: "include",
          headers: {
            Authorization: `Basic ${btoa(
              env.NEXT_PUBLIC_CLOUDINARY_API_KEY +
                ":" +
                env.CLOUDINARY_API_SECRET
            )}`,
          },
        }
      );
      const data = await response.json();
      return data;
    }),
});
