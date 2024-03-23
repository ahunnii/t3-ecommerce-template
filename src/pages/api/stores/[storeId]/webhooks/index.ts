import type { NextApiRequest, NextApiResponse } from "next";

import paymentService from "~/services/payment";

import type { CheckoutSessionResponse } from "~/services/payment/types";

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
    const session: CheckoutSessionResponse =
      await paymentService.handleCheckout({
        req,
      });

    if (session.status === "success")
      res.status(200).json({ received: true, ...session });

    return res.status(400).json({
      error: {
        code: "not_found",
        message:
          session.messages[0] ??
          "An error has occurred with creating the order after checkout / webhook not found.",
      },
    });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};
export default handleCheckoutProcessing;
