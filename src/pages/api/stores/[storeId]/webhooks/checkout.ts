import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "~/server/db";

import paymentService from "~/services/payment";

import type {
  CheckoutSessionResponse,
  UpdateOrderProps,
} from "~/services/payment/types";

// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false,
  },
};

const handleCheckoutProcessing = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === "POST") {
    const updateOrder = async ({
      orderId,
      orderData,
      orderStatus,
      isComplete,
    }: UpdateOrderProps) => {
      try {
        const order = await prisma.order.update({
          where: {
            id: orderId,
          },
          data: {
            ...orderData,
            timeline: {
              createMany: {
                data: [
                  {
                    ...orderStatus,
                    createdAt: new Date(),
                  },
                ],
              },
            },
          },
          include: {
            orderItems: {
              include: {
                variant: true,
                product: {
                  include: {
                    variants: true,
                  },
                },
              },
            },
            timeline: true,
          },
        });

        if (!isComplete) return order;

        order.orderItems.map(async (orderItem) => {
          if (!orderItem.variantId) {
            await prisma.product
              .update({
                where: {
                  id: orderItem.productId,
                },
                data: {
                  quantity:
                    orderItem.product.quantity - orderItem.quantity < 0
                      ? 0
                      : orderItem.product.quantity - orderItem.quantity,
                },
              })
              .then((res) => {
                if (res.quantity <= 0) {
                  return prisma.product.update({
                    where: {
                      id: orderItem.productId,
                    },
                    data: {
                      isArchived: true,
                    },
                  });
                }
              });
          } else if (orderItem.variantId && orderItem.variant) {
            await prisma.variation.update({
              where: {
                id: orderItem.variantId,
              },
              data: {
                quantity:
                  orderItem.variant.quantity - orderItem.quantity < 0
                    ? 0
                    : orderItem.variant.quantity - orderItem.quantity,
              },
            });
            const variants = await prisma.variation.findMany({
              where: {
                id: {
                  in: [...orderItem.product.variants.map((v) => v.id)],
                },
              },
            });

            const hasValidItems = variants.some(
              (variant) => variant.quantity > 0
            );

            if (!hasValidItems) {
              return prisma.product.update({
                where: {
                  id: orderItem.productId,
                },
                data: {
                  isArchived: true,
                },
              });
            }
          }
        });

        return order;
      } catch (e) {
        console.error(
          "Error: Problem with updating order within payment service"
        );
        console.error(e);
        return null;
      }
    };

    const session: CheckoutSessionResponse =
      await paymentService.handleCheckout({
        req,
        updateOrder,
      });

    if (session.status === "success")
      res.status(200).json({ received: true, session });

    return res
      .status(400)
      .send(
        session.messages[0] ??
          "An error has occurred with mutating the order after successful checkout."
      );
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};
export default handleCheckoutProcessing;
