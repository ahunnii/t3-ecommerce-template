import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import type { NextApiRequest, NextApiResponse } from "next";
// import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

import axios from "axios";
import type { Stripe } from "stripe";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";
import { stripe } from "~/server/stripe/client";
import { type CartItem } from "~/types";

const refundHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const ctx = await createTRPCContext({ req, res });

  const { referenceId, orderId } = req.body;
  const { storeId } = req.query;

  try {
    switch (req.method) {
      case "OPTIONS":
        return res.json({});
      case "POST":
        try {
          const refund = await stripe.refunds.create({
            payment_intent: referenceId as string,
          });

          if (refund.status === "succeeded") {
            const order = await prisma.order.update({
              where: {
                id: orderId,
              },
              data: {
                isPaid: false,
                isRefunded: true,
                refundId: refund.id,
              },
            });

            return res.json({ received: true, data: { refund, order } });
          } else {
            return res.status(500).json({ error: "Refund failed" });
          }
        } catch (err) {
          return res.status(500).json({ error: "Error creating refund" });
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

export default refundHandler;
