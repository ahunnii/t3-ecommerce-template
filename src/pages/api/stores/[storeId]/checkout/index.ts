import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import type { NextApiRequest, NextApiResponse } from "next";
// import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

import axios from "axios";

import { ShippingType, type CartItem } from "~/types";

import { env } from "~/env.mjs";
import paymentService from "~/services/payment";

const checkoutHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const ctx = await createTRPCContext({ req, res });

  const { productIds, quantity, cartItems, shipping, shippingObject } =
    req.body;
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
            `${env.NEXT_PUBLIC_API_URL}/cartItems`,
            { cartItems }
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
            shippingObject as {
              type: ShippingType;
              cost: number;
              label: string;
            },
          ]);

          const currentUser = ctx?.session?.user;

          // const order = null;

          // Create order if user is logged in. Helps to handle 'abandoned carts'
          // if (currentUser) {
          //   order = await ctx.prisma.order.create({
          //     data: {
          //       storeId: storeId as string,
          //       paymentStatus: "PENDING",
          //       userId: currentUser?.id ?? null,
          //       shipping: Number(shipping * 100) ?? 0,
          //       orderItems: {
          //         create: verifiedDBData.map((product: CartItem) => {
          //           if (product.variant === null)
          //             return {
          //               product: { connect: { id: product.product.id } },
          //               quantity: Number(product.quantity) ?? 1,
          //             };

          //           return {
          //             product: { connect: { id: product.product.id } },
          //             variant: { connect: { id: product.variant.id } },
          //             quantity: Number(product.quantity) ?? 1,
          //           };
          //         }),
          //       },
          //     },
          //   });
          // }

          const session = await paymentService.createCheckoutSession({
            items: line_items,
            shippingOptions: shipping_options,
            order_id: "",
            user_id: currentUser?.id ?? "",
            store_id: storeId as string,
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
