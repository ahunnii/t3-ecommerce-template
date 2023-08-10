import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import type { NextApiRequest, NextApiResponse } from "next";
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";
import { prisma } from "~/server/db";

import type { Stripe } from "stripe";
import { stripe } from "~/server/stripe/client";
const checkoutHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const { productIds } = req.body;
      const { storeId } = req.query;
      if (!productIds || productIds.length === 0) {
        return res.status(400).json({ error: "Product ids are required" });
      }

      const products = await prisma.product.findMany({
        where: {
          id: {
            in: productIds,
          },
        },
      });
      const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

      products.forEach((product) => {
        line_items.push({
          quantity: 1,
          price_data: {
            currency: "USD",
            product_data: {
              name: product.name,
            },
            unit_amount: product.price.toNumber() * 100,
          },
        });
      });

      const order = await prisma.order.create({
        data: {
          storeId: storeId as string,
          isPaid: false,
          orderItems: {
            create: productIds.map((productId: string) => ({
              product: {
                connect: {
                  id: productId,
                },
              },
            })),
          },
        },
      });

      const session = await stripe.checkout.sessions.create({
        line_items,
        mode: "payment",
        payment_method_types: ["card"],
        billing_address_collection: "required",
        phone_number_collection: {
          enabled: true,
        },
        success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
        cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
        metadata: {
          orderId: order.id,
        },
      });

      //   const session = await stripe.checkout.sessions.create({
      //     payment_method_types: ["card"],
      //     line_items: [
      //       {
      //         price_data: {
      //           currency: "usd",
      //           product_data: {
      //             name: "Sample Product",
      //           },
      //           unit_amount: 1000,
      //         },
      //         quantity: 1,
      //       },
      //     ],
      //     mode: "payment",
      //     success_url: `${req.headers.origin}/success`,
      //     cancel_url: `${req.headers.origin}/`,
      //   });
      res.status(200).json({ sessionId: session.id });
    } catch (err) {
      res.status(500).json({ error: "Error creating checkout session" });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export default checkoutHandler;
