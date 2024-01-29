// import { OrderItem } from "~/modules/orders/types";
import { OrderItem } from "@prisma/client";
import { stripe } from "~/server/stripe/client";
import { PaymentProcessor } from "../payment-service";
import { retrievePaymentResult } from "../types";

export const stripePaymentProcessor: PaymentProcessor = {
  processPayment: async (order) => {
    // TODO: Process payment
  },
  retrievePayment: async (order) => {
    const paymentIntentId = order.paymentId ?? null;

    if (!paymentIntentId) {
      return null;
    }

    const paymentMethod = await stripe.paymentMethods.retrieve(
      paymentIntentId as string
    );

    console.log(paymentMethod);
    if (!paymentMethod) {
      return null;
    }

    const results: retrievePaymentResult = {
      items: order.orderItems,
      billingAddress: `${paymentMethod?.billing_details?.address?.line1},  ${paymentMethod?.billing_details?.address?.line2}, ${paymentMethod?.billing_details?.address?.city} ${paymentMethod?.billing_details?.address?.state} ${paymentMethod?.billing_details?.address?.postal_code},  `,
      shippingAddress: order.address,
      orderPlaced: `Placed: ${new Date(paymentMethod?.created).toDateString()}`,
      paymentDetails: `${paymentMethod?.card?.brand} ending in ${paymentMethod?.card?.last4}`,
    };

    console.log(results);
    return results;
  },
};
