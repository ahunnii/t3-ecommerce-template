import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import { type NextApiRequest, type NextApiResponse } from "next";

import { createTRPCContext } from "~/server/api/trpc";

import { shippoClient } from "~/server/shippo/client";

const addressHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Create context and caller
  const ctx = await createTRPCContext({ req, res });

  const userId = ctx.session?.user.id;
  const { storeId } = req.query;

  const storeByUserId = await ctx.prisma.store.findFirst({
    where: {
      id: storeId as string,
      userId,
    },
  });

  try {
    switch (req.method) {
      case "POST":
        if (!userId)
          return res.status(403).json({ message: "Unauthenticated" });

        if (!storeByUserId)
          return res.status(405).json({ message: "Unauthorized" });

        try {
          const { street1, street2, city, state, zip, country, name } =
            req.body;

          const address = await shippoClient.address.create({
            street1: street1,
            street2: street2,
            city: city,
            state: state,
            zip: zip,
            country: country,
            validate: true,
            name: name,
          });

          return res.status(200).json(address);
        } catch (error) {
          console.log(error);
        }
      default:
        res.setHeader("Allow", "GET, POST");
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

export default addressHandler;
