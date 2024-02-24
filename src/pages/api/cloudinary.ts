import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import { v2 as cloudinary } from "cloudinary";
import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "~/env.mjs";
// const cloudinary = require('cloudinary').v2;

export type SignApiOptions = Record<string, unknown>;

cloudinary.config({
  cloud_name: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (!env.CLOUDINARY_API_SECRET) {
      res.status(401).json({ message: "Cloudinary API secret not set" });
    } else {
      const body = JSON.parse(req.body as string) || {};
      const { paramsToSign } = body;

      const signature = cloudinary.utils.api_sign_request(
        paramsToSign as SignApiOptions,
        env.CLOUDINARY_API_SECRET
      );

      res.status(200).json({ signature });
    }
  } catch (cause: unknown) {
    if (cause instanceof TRPCError) {
      // An error from tRPC occurred
      const httpCode = getHTTPStatusCodeFromError(cause);
      return res.status(httpCode).json(cause);
    }
    // Another error occurred
    console.error(JSON.stringify(cause));
    res.status(500).json({ message: "Internal server error" });
  }
};

export default handler;
