import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import { type NextApiRequest, type NextApiResponse } from "next";
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";
import paymentService from "~/services/payment";

const paymentDetailsHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  // Create context and caller
  const ctx = await createTRPCContext({ req, res });
  const caller = appRouter.createCaller(ctx);

  const userId = ctx.session?.user.id;

  const { orderId } = req.body;
  console.log(orderId);
  //   const { storeId } = req.query;

  const order = await ctx.prisma.order.findFirst({
    where: {
      id: orderId as string,
      userId,
    },
    include: {
      orderItems: {
        include: {
          variant: true,
          product: true,
        },
      },
      shippingLabel: true,
    },
  });

  if (!order) {
    return res.status(403).json({ message: "Unauthenticated" });
  }

  try {
    switch (req.method) {
      case "POST":
        const paymentDetails = await paymentService.retrievePayment(order);
        console.log(paymentDetails);

        if (paymentDetails === null) {
          return res.status(404).json({ message: "Payment not found" });
        }

        console.log(paymentDetails);
        return res.status(200).json(paymentDetails);

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

export default paymentDetailsHandler;
