import type {
  FulfillmentStatus,
  OrderItem,
  PaymentStatus,
  TimeLineEntryType,
} from "@prisma/client";
import type { NextApiRequest } from "next";
export type retrievePaymentResult = {
  items: OrderItem[];
  billingAddress: string;
  shippingAddress: string;
  orderPlaced: string;
  paymentDetails: string;
};

export type TimelineUpdate = {
  type: TimeLineEntryType;
  title: string;
  description: string;
};

export type CheckoutSessionResponse = {
  messages: string[];
  status: "success" | "failed";
};

type Address = {
  name: string;
  address: string;
  additional?: string;
  country?: string;
  city: string;
  state: string;
  postalCode: string;
  complete: string;
};

export type Amount = {
  subtotal: number;
  tax: number;
  shipping: number;
  misc?: number;
  total: number;
  currency: "USD" | "CA";
};

type Customer = {
  name: string;
  email: string;
  phone?: string;
  // address: Address;
};

type OrderDetails = {
  paymentId?: string;
  orderId?: string;
  refundId?: string;
  intentId?: string;
};

export type CheckoutOrderDetails = {
  customerDetails: Customer;
  shippingDetails: Address;
  billingDetails: Address;
  totalDetails: Amount;
  orderDetails: OrderDetails;
};

export type PaymentOrderData = {
  paymentStatus?: PaymentStatus;
  fulfillmentStatus?: FulfillmentStatus;
  name?: string;
  phone?: string;
  email?: string;

  total?: number;
  subtotal?: number;
  taxes?: number;
  referenceId?: string;
  paymentId?: string;

  shippingAddress?: {
    name?: string;
    street: string;
    additional?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
};

export type UpdateOrderProps = {
  orderId: string;
  orderStatus: TimelineUpdate;
  orderData: PaymentOrderData;
  isComplete: boolean;
};

export type THandleCheckoutProps = {
  req: NextApiRequest;
  // updateOrder: (props: UpdateOrderProps) => Promise<Order | null>;
};
