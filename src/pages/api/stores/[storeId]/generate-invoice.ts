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
    // read our invoice-template.html file using node fs module
    const file = fs.readFileSync(
      "./src/modules/custom-orders/invoice-template.html",
      "utf8"
    );

    // compile the file with handlebars and inject the customerName variable
    const template = handlers.compile(`${file}`);
    const html = template({
      customerName,
      customerEmail,
      product,
      productCost: formattedProductCost,
      businessName,
      businessStreet,
      businessCity,
      businessState,
      businessPostalCode,
      productDescription,
      invoiceNumber,
      createdAt,
      businessLogo,
      productLink,
      dueAt,
      productTotal: formattedProductTotal,
    });

    // simulate a chrome browser with puppeteer and navigate to a new page
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // set our compiled html template as the pages content
    // then waitUntil the network is idle to make sure the content has been loaded
    await page.setContent(html, { waitUntil: "networkidle0" });

    // convert the page to pdf with the .pdf() method
    const pdf = await page.pdf({ format: "A4" });
    await browser.close();

    // send the result to the client
    res.statusCode = 200;

    emailService
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
        toastService.success("Email sent");
      })
      .catch((e: unknown) => toastService.error("Error", e));

    res.send(pdf);
  } catch (err: unknown) {
    console.log(err);
    res.status(500).json({ message: err?.message });
  }
};

export default handler;
