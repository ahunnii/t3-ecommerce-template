import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import { v2 as cloudinary } from "cloudinary";
import { NextApiRequest, NextApiResponse } from "next";
import { env } from "~/env.mjs";
// const cloudinary = require('cloudinary').v2;

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  try {
    switch (req.method) {
      case "POST":
        if (!env.CLOUDINARY_API_SECRET) {
          res.status(401).json({ message: "Cloudinary API secret not set" });
        } else {
          const { paramsToSign } = JSON.parse(req.body as string);

          const signature = cloudinary.utils.api_sign_request(
            paramsToSign,
            env.CLOUDINARY_API_SECRET
          );

          res.status(200).json({ signature });
        }
      default:
        res.setHeader("Allow", "POST");
        return res.status(405).end("Method Not Allowed");
    }
  } catch (cause) {
    if (cause instanceof TRPCError) {
      // An error from tRPC occurred
      const httpCode = getHTTPStatusCodeFromError(cause);
      return res.status(httpCode).json(cause);
    }
    // Another error occurred
    console.error(cause);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default handler;
