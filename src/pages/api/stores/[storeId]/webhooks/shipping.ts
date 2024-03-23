import type { NextApiRequest, NextApiResponse } from "next";

import paymentService from "~/services/payment";

import type { CheckoutSessionResponse } from "~/services/payment/types";

// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false,
  },
};

const handleCheckoutProcessing = (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === "POST") {
    try {
      // Assuming the request body will have the tracking information
      const { trackingNumber, status, carrier, timestamp } = req.body;

      console.log(req.body);
      // Perform actions based on the tracking update, such as:
      // - Updating the order status in your database
      // - Sending a notification to the customer via email or SMS

      // Send a response back to acknowledge receipt of the tracking update
      res
        .status(200)
        .json({ message: "Tracking update received successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error processing tracking update" });
    }
  } else {
    // Handle any other HTTP methods
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
export default handleCheckoutProcessing;
