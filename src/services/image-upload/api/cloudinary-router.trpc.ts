import { TRPCError } from "@trpc/server";

import { z } from "zod";
import { env } from "~/env.mjs";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import axios from "axios";
import { v2 as cloudinary } from "cloudinary";

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

  getImagesByFolder: protectedProcedure
    .input(z.object({ folder: z.string() }))
    .query(async ({ input, ctx }) => {
      if (ctx.session.user.role !== "ADMIN")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });

      const response = await fetch(
        `https:/api.cloudinary.com/v1_1/${env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/resources/image?max_results=500`,
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

      if (data.resources.length > 0) {
        const filteredData = data.resources.filter(
          (resource: { folder: string }) => resource.folder === input.folder
        );
        return {
          resources: filteredData,
        };
      }

      return data;
    }),

  deleteProductImage: protectedProcedure
    .input(z.object({ public_id: z.string() }))
    .mutation(async ({ input }) => {
      // const timestamp: string = new Date().getTime().toString();

      // const string = `public_id=${input.public_id}&timestamp=${timestamp}${env.CLOUDINARY_API_SECRET}`;
      // const signature: string = sha1(string);

      // const formData = new FormData();
      // formData.append("public_id", input.public_id);
      // formData.append("signature", signature);
      // formData.append("api_key", env.CLOUDINARY_API_KEY!);
      // formData.append("timestamp", timestamp);

      // const response = await cloudinary.api.delete_resources([input.public_id]);
      // const response = await fetch(
      //   `https:/api.cloudinary.com/v1_1/${env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/destroy/image`,
      //   {
      //     method: "POST",
      //     body: formData,
      //     credentials: "include",
      //     headers: {
      //       Authorization: `Basic ${btoa(
      //         env.NEXT_PUBLIC_CLOUDINARY_API_KEY +
      //           ":" +
      //           env.CLOUDINARY_API_SECRET
      //       )}`,
      //     },
      //   }
      // // );
      // const data = await response.json();
      return cloudinary.api.delete_resources([input.public_id]);
    }),

  uploadProductImage: protectedProcedure
    .input(z.object({ files: z.instanceof(FormData), signature: z.string() }))
    .mutation(async ({ input }) => {
      input.files.append("api_key", env.CLOUDINARY_API_KEY!);
      input.files.append("signature", input.signature);

      const data = await fetch(
        `https://api.cloudinary.com/v1_1/${env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: input.files,
        }
      ).then((r) => r.json());

      return data;
    }),
});
