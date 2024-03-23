import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "~/server/db";
import { stripe } from "~/server/stripe/client";

const refundHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { referenceId, orderId } = req.body;

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
                paymentStatus: "REFUNDED",
                refunds: {
                  createMany: {
                    data: [
                      {
                        amount: refund.amount,
                        reason: refund.reason ?? "requested_by_customer",
                      },
                    ],
                  },
                },
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
