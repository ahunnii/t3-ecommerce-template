// import the necessary node libraries
import fs from "fs";
import handlers from "handlebars";
import { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";
import { env } from "~/env.mjs";
import { emailService } from "~/services/email_new";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // extract the customer name from the req.body object
  // and also set a default name with the logical operator

  const {
    customerName,
    customerEmail,
    product,
    productCost,
    businessName,
    businessStreet,
    businessCity,
    businessState,
    businessPostalCode,
    businessLogo,
    productLink,
    invoiceNumber,
    productDescription,
    createdAt,
    productTotal,
    dueAt,
  } = JSON.parse(req.body as string);
  //   const customerName = name || "John Doe";

  const formattedProductCost = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(productCost));

  const formattedProductTotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(productTotal));
  try {
    await emailService
      .sendCustomOrderToCustomer({
        data: {
          productLink,
          product,
          price: formattedProductCost,
          customerName,
          email: customerEmail,
          name: businessName,

          total: formattedProductTotal,
          dueDate: dueAt,
          notes: productDescription,
          invoiceId: invoiceNumber,
        },
      })
      .then(() => {
        res.status(200).json({ message: "Email Sent" });
      })
      .catch((e: unknown) => res.status(500).json({ message: e }));
  } catch (err: unknown) {
    res.status(500).json({ message: err?.message });
  }
};

export default handler;
