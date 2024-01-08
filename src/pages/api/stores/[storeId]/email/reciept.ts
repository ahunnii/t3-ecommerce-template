// import type { NextApiRequest, NextApiResponse } from "next";

// import type { CreateEmailOptions } from "resend/build/src/emails/interfaces";
// import { InquiryTemplate } from "~/components/core/email/inquiry-template";
// import { env } from "~/env.mjs";

// import { resend } from "~/server/resend/client";

// const recieptHandler = async (req: NextApiRequest, res: NextApiResponse) => {
//   if (req.method !== "POST") {
//     res.status(405).send("Method Not Allowed");
//   }

//   try {
//     const { orderId, email, body } = req.body;
//     const data = await resend.emails.send({
//       from: `DreamWalker Studios <no_reply@dreamwalkerstudios.co>`,
//       to: env.SHOP_EMAIL,
//       subject: "Your receipt from DreamWalker Studios #" + orderId,
//       react: InquiryTemplate({ fullName: name, message: body, email }),
//     } as CreateEmailOptions);

//     res.status(200).json(data);
//   } catch (error) {
//     res.status(400).json(error);
//   }
// };
// export default recieptHandler;

// // "line_item_group": {
// //     "currency": "usd",
// //     "discount_amounts": [
// //     ],
// //     "line_items": [
// //       {
// //         "id": "li_1OWMv9K0mkiDQmKFHZMw1rTZ",
// //         "object": "item",
// //         "adjustable_quantity": null,
// //         "cross_sell_from": null,
// //         "description": "12in, Unpainted, Resin",
// //         "discount_amounts": [
// //         ],
// //         "images": [
// //           "https://stripe-camo.global.ssl.fastly.net/b5b2e22b7c6e3ffeb14b9c797ae06c0b8edc009d981fe30ebca7b525a0e50ace/68747470733a2f2f7265732e636c6f7564696e6172792e636f6d2f646c706b6f6b3332362f696d6167652f75706c6f61642f76313730313839383536392f6e616a3966316e69733966656e696379737462682e6a7067"
// //         ],
// //         "name": "HellBat Helmet",
// //         "price": {
// //           "id": "price_1OWMv9K0mkiDQmKFgyV0LQOb",
// //           "object": "price",
// //           "active": false,
// //           "billing_scheme": "per_unit",
// //           "currency": "usd",
// //           "custom_unit_amount": null,
// //           "livemode": false,
// //           "product": {
// //             "id": "prod_PL31rCL5n8aNBR",
// //             "object": "product",
// //             "active": false,
// //             "addons": null,
// //             "attributes": [
// //             ],
// //             "description": "12in, Unpainted, Resin",
// //             "images": [
// //               "https://res.cloudinary.com/dlpkok326/image/upload/v1701898569/naj9f1nis9fenicystbh.jpg"
// //             ],
// //             "livemode": false,
// //             "name": "HellBat Helmet",
// //             "unit_label": null,
// //             "url": null
// //           },
// //           "recurring": null,
// //           "tax_behavior": "unspecified",
// //           "tiers_mode": null,
// //           "transform_quantity": null,
// //           "type": "one_time",
// //           "unit_amount": 25000,
// //           "unit_amount_decimal": "25000"
// //         },
// //         "quantity": 1,
// //         "subtotal": 25000,
// //         "tax_amounts": [
// //         ],
// //         "total": 25000,
// //         "unit_amount_override": null
// //       }
// //     ],

// // }
