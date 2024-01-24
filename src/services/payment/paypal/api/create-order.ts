import paypal from "@paypal/checkout-server-sdk";
import type { NextApiRequest, NextApiResponse } from "next";
import { paypalClient } from "~/server/paypal/client";

export default async function Handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != "POST")
    return res.status(404).json({ success: false, message: "Not Found" });

  if (!req.body.order_price || !req.body.user_id)
    return res.status(400).json({
      success: false,
      message: "Please Provide order_price And User ID",
    });

  try {
    // const PaypalClient = paypalClient()
    //This code is lifted from https://github.com/paypal/Checkout-NodeJS-SDK
    const request = new paypal.orders.OrdersCreateRequest();
    request.headers.Prefer = "return=representation";
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: req.body.order_price + "",
          },
        },
      ],
    });
    const response = await paypalClient.execute(request);
    if (response.statusCode !== 201) {
      console.log("RES: ", response);
      return res
        .status(500)
        .json({ success: false, message: "Some Error Occured at backend" });
    }

    // Your Custom Code for doing something with order
    // Usually Store an order in the database like MongoDB

    console.log(response);

    res.status(200).json({ success: true, data: { response } });
  } catch (err) {
    console.log("Err at Create Order: ", err);
    return res
      .status(500)
      .json({ success: false, message: "Could Not Found the user" });
  }
}
