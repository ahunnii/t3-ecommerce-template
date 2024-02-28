import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import { type NextApiRequest, type NextApiResponse } from "next";

import type { CustomRequestFormValues } from "~/modules/custom-orders/types";
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

const createCustomOrderHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  // Create context and caller
  const ctx = await createTRPCContext({ req, res });
  const caller = appRouter.createCaller(ctx);

  try {
    switch (req.method) {
      case "POST":
        const payload: CustomRequestFormValues = req.body;

        try {
          const createCustomRequest =
            await caller.customOrder.createCustomRequest({
              ...payload,
              status: "PENDING",
            });

          return res.status(200).json(createCustomRequest);
        } catch (cause) {
          if (cause instanceof TRPCError) {
            const httpCode = getHTTPStatusCodeFromError(cause);
            return res.status(httpCode).json(cause);
          }

          console.error(cause);
          res.status(500).json({ message: "Internal server error" });
        }

      default:
        res.setHeader("Allow", "POST");
        return res.status(405).end("Method Not Allowed");
    }
  } catch (cause) {
    if (cause instanceof TRPCError) {
      const httpCode = getHTTPStatusCodeFromError(cause);
      return res.status(httpCode).json(cause);
    }

    console.error(cause);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default createCustomOrderHandler;
