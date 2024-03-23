import {
  Address,
  PaymentStatus as DBPaymentStatus,
  type Prisma,
} from "@prisma/client";
import type * as z from "zod";
import type { orderFormSchema } from "./schemas";

export type OrderItem = Prisma.OrderItemGetPayload<{
  include: {
    variant: true;
    product: true;
  };
}>;

export type DetailedOrder = Prisma.OrderGetPayload<{
  include: {
    orderItems: {
      include: {
        variant: true;
        product: true;
      };
    };
    shippingLabel: true;
    timeline: true;
    address: true;
  };
}>;

export type PaymentOrder = Prisma.OrderGetPayload<{
  include: {
    orderItems: {
      include: {
        variant: true;
        product: true;
      };
    };

    timeline: true;
  };
}>;

export type Order = Prisma.OrderGetPayload<{
  include: {
    shippingAddress: true;
    billingAddress: true;
    fulfillments: true;
    timeline: true;
    refunds: true;
    orderItems: {
      include: {
        variant: true;
        product: {
          include: {
            variants: true;
          };
        };
      };
    };
  };
}>;

export type OrderAddress = Address;

export type OrderFormValues = z.infer<typeof orderFormSchema>;

export const PaymentStatus = DBPaymentStatus;
export type PaymentStatus = DBPaymentStatus;
