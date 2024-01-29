// import { OrderItem } from "~/modules/orders/types";

import { OrderItem } from "@prisma/client";

export type retrievePaymentResult = {
  items: OrderItem[];
  billingAddress: string;
  shippingAddress: string;
  orderPlaced: string;
  paymentDetails: string;
};
