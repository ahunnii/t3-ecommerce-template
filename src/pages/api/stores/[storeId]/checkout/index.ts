import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import type { NextApiRequest, NextApiResponse } from "next";
// import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

import type { Stripe } from "stripe";
import { stripe } from "~/server/stripe/client";

const checkoutHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const ctx = await createTRPCContext({ req, res });

  const { productIds, variantIds, quantity } = req.body;
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

          const products = await ctx.prisma.product.findMany({
            where: {
              id: {
                in: productIds,
              },
            },
            include: {
              variants: true,
              images: true,
            },
          });

          const variants = await ctx.prisma.variation.findMany({
            where: {
              id: {
                in: variantIds,
              },
            },
          });

          const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

          // Map the values key from the fetched variants to the variant IDs
          const mapValuesToIds = () => {
            const variantIdToValueMap: Record<string, string> = {};
            for (const variant of variants) {
              variantIdToValueMap[variant.id] = variant.values;
            }

            return variantIds.map((id: string) =>
              id === "0" ? "Default" : variantIdToValueMap[id]
            );
          };

          const variantValues = mapValuesToIds();

          products.forEach((product, idx) => {
            line_items.push({
              quantity: Number(quantity[idx]) ?? 1,
              price_data: {
                currency: "USD",
                product_data: {
                  name: product.name + variants[0]?.values,
                  description: variantValues[idx] as string,
                  images: product.images.map((image) => image.url),
                },
                unit_amount: Math.floor(product.price.toNumber() * 100),
              },
            });
          });

          const order = await ctx.prisma.order.create({
            data: {
              storeId: storeId as string,
              isPaid: false,
              orderItems: {
                create: productIds.map((productId: string, idx: number) => {
                  if (variantValues[idx] === "Default")
                    return {
                      product: {
                        connect: {
                          id: productId,
                        },
                      },
                      quantity: Number(quantity[idx]) ?? 1,
                    };

                  return {
                    product: {
                      connect: {
                        id: productId,
                      },
                    },
                    variant: {
                      connect: {
                        id: variantIds[idx],
                      },
                    },
                    quantity: Number(quantity[idx]) ?? 1,
                  };
                }),
              },
            },
          });

          const session = await stripe.checkout.sessions.create({
            line_items,
            mode: "payment",
            payment_method_types: ["card"],
            billing_address_collection: "required",
            shipping_address_collection: {
              allowed_countries: ["US", "CA"],
            },
            phone_number_collection: {
              enabled: true,
            },
            success_url: `http://localhost:3000/cart?success=1`,
            cancel_url: `http://localhost:3000/cart?canceled=1`,
            metadata: {
              orderId: order.id,
            },
          });

          return res.json({ url: session.url });
        } catch (err) {
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
