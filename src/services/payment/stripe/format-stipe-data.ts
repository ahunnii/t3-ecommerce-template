import type Stripe from "stripe";
import { CheckoutOrderDetails } from "../types";

export const formatSessionData = (
  session: Stripe.Checkout.Session
): CheckoutOrderDetails => ({
  customerDetails: {
    name: session?.customer_details?.name ?? "",
    email: session?.customer_details?.email ?? "",
    phone: session?.customer_details?.phone ?? "",
  },
  shippingDetails: {
    name: session?.shipping_details?.name ?? "",
    address: session?.shipping_details?.address?.line1 ?? "",
    additional: session?.shipping_details?.address?.line2 ?? "",
    city: session?.shipping_details?.address?.city ?? "",
    state: session?.shipping_details?.address?.state ?? "",
    postalCode: session?.shipping_details?.address?.postal_code ?? "",
    country: session?.shipping_details?.address?.country ?? "",
    complete: Object.values(session?.shipping_details?.address ?? {})
      .filter((c) => c !== null)
      .join(", "),
  },
  billingDetails: {
    name: session?.customer_details?.name ?? "",
    address: session?.customer_details?.address?.line1 ?? "",
    additional: session?.customer_details?.address?.line2 ?? "",
    city: session?.customer_details?.address?.city ?? "",
    state: session?.customer_details?.address?.state ?? "",
    postalCode: session?.customer_details?.address?.postal_code ?? "",
    country: session?.customer_details?.address?.country ?? "",
    complete: Object.values(session?.customer_details?.address ?? {})
      .filter((c) => c !== null)
      .join(", "),
  },
  orderDetails: {
    paymentId: "",
    orderId: session?.id ?? "",
    refundId: "",
    intentId: (session?.payment_intent as string) ?? "",
  },
  totalDetails: {
    total: session?.amount_total ?? 0,
    subtotal: session?.amount_subtotal ?? 0,
    tax: session?.total_details?.amount_tax ?? 0,
    shipping: session?.total_details?.amount_shipping ?? 0,
    misc: 0,

    currency: "USD",
  },
});
