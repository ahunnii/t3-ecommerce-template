import {
  DiscountMethodType,
  DiscountType,
  DiscountValueType,
} from "@prisma/client";

import * as z from "zod";

export const discountFormSchema = z.object({
  startDate: z.date(),
  endDate: z.date().optional(),

  code: z.string(),
  description: z.string().optional(),
  value: z.coerce.number().min(0),
  active: z.boolean(),
  stackable: z.boolean(),

  type: z.nativeEnum(DiscountType),
  valueType: z.nativeEnum(DiscountValueType),
  methodType: z.nativeEnum(DiscountMethodType),

  minValue: z.coerce.number().optional(),
  maxValue: z.coerce.number().optional(),

  products: z.array(
    z.object({
      id: z.string(),
    })
  ),
  collections: z.array(
    z.object({
      id: z.string(),
    })
  ),
});
