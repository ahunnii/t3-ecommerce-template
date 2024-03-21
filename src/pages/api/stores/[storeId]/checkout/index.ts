import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import type { NextApiRequest, NextApiResponse } from "next";
// import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

import axios from "axios";

import { ShippingType, type CartItem } from "~/types";

import paymentService from "~/services/payment";

const checkoutHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const ctx = await createTRPCContext({ req, res });

  const { productIds, quantity, cartItems, shipping } = req.body;
  const { storeId } = req.query;

  try {
    switch (req.method) {
      case "OPTIONS":
        return res.json({});
      case "POST":
        try {
          if (!productIds || productIds.length === 0) {
            return res.status(400).json({ error: "Product ids are required" });
          }
          const verifiedDBDataResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/cartItems`,
            {
              cartItems,
            }
          );

          if (verifiedDBDataResponse.status !== 200) {
            throw new Error("Error verifying cart items.");
          }

          const verifiedDBData = (await verifiedDBDataResponse.data
            .detailedCartItems) as CartItem[];

          const line_items = paymentService.createLineItems({
            cartItems: verifiedDBData,
            quantities: quantity,
          });

          const shipping_options = paymentService.createShippingOptions([
            (shipping as string) === "FREE"
              ? {
                  type: ShippingType.FREE,
                  label: "Free Shipping",
                  cost: 0,
                }
              : {
                  type: ShippingType.FLAT_RATE,
                  label: "[Fixed] Standard 5-7 days after product processing.",
                  cost: shipping,
                },
          ]);

          const currentUser = ctx?.session?.user;

          const order = await ctx.prisma.order.create({
            data: {
              storeId: storeId as string,
              isPaid: false,
              userId: currentUser?.id ?? null,
              shippingCost: Number(shipping * 100) ?? 0,
              orderItems: {
                create: verifiedDBData.map((product: CartItem) => {
                  if (product.variant === null)
                    return {
                      product: {
                        connect: {
                          id: product.product.id,
                        },
                      },
                      quantity: Number(product.quantity) ?? 1,
                    };

                  return {
                    product: {
                      connect: {
                        id: product.product.id,
                      },
                    },
                    variant: {
                      connect: {
                        id: product.variant.id,
                      },
                    },
                    quantity: Number(product.quantity) ?? 1,
                  };
                }),
              },
            },
          });

          const session = await paymentService.createCheckoutSession({
            items: line_items,
            shippingOptions: shipping_options,
            orderId: order.id,
          });

          return res.json(session);
        } catch (err) {
          console.log(err);
          return res
            .status(500)
            .json({ error: "Error creating checkout session" });
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

export default checkoutHandler;
