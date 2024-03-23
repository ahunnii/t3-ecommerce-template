import { FulfillmentStatus, PaymentStatus } from "@prisma/client";
import * as z from "zod";
export const orderFormSchema = z.object({
  paymentStatus: z.nativeEnum(PaymentStatus),
  fulfillmentStatus: z.nativeEnum(FulfillmentStatus),
  phone: z.string().min(9).max(12),
  street: z.string(),
  additional: z.string().optional(),
  city: z.string(),
  state: z.string(),
  zip: z.string().regex(/^\d{5}(?:[-\s]\d{4})?$/),
  country: z.string(),
  name: z.string().min(2),
  email: z.string().email(),
  orderItems: z.array(
    z.object({
      // productId: z.string(),
      id: z.string(),
      productId: z.string(),
      variantId: z.string().nullish(),
      // variant: z.any(),
      quantity: z.coerce.number().min(0),
      // product: z.object({
      //   name: z.string(),
      //   variants: z.array(
      //     z.object({
      //       id: z.string(),
      //       names: z.string().min(1),
      //       values: z.string().min(1),
      //       price: z.instanceof(Prisma.Decimal),
      //       quantity: z.number().min(1),
      //     })
      //   ),
      // }),
    })
  ),
});
