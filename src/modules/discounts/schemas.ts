import {
  DiscountAllocation,
  DiscountCondition,
  DiscountConditionOperator,
  DiscountRule,
  DiscountType,
} from "@prisma/client";
import * as z from "zod";

export const discountFormSchema = z.object({
  startDate: z.date(),
  endDate: z.date().optional(),
  code: z.string(),
  description: z.string().optional(),
  active: z.boolean(),
  isCodeRequired: z.boolean(),

  type: z.nativeEnum(DiscountType),
  allocation: z.nativeEnum(DiscountAllocation),
  condition: z.nativeEnum(DiscountCondition),
  conditionExclusion: z.nativeEnum(DiscountConditionOperator),
  conditionThreshold: z.number().optional().default(0),

  value: z.coerce.number().min(0),
  // valueType: z.nativeEnum(DiscountValueType),

  rule: z.nativeEnum(DiscountRule),

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
