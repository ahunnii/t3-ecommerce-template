import { buffer } from "micro";
import type { Stripe } from "stripe";
import { env } from "~/env.mjs";
import { stripe } from "~/server/stripe/client";
import type { CustomerShippingRate } from "~/types";
import type { PaymentProcessor } from "../payment-service";
import type { CheckoutSessionResponse, retrievePaymentResult } from "../types";
import { getOrderInfo } from "../utils/get-order-info";
import { formatSessionData } from "./format-stipe-data";

const webhookSecret = env.STRIPE_WEBHOOK_SECRET;

export const stripePaymentProcessor: PaymentProcessor<
  Stripe.Checkout.SessionCreateParams.LineItem[],
  Stripe.Checkout.SessionCreateParams.ShippingOption[]
> = {
  createLineItems: ({ cartItems, quantities }) => {
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    cartItems.forEach((product, idx) => {
      console.log(product);
      line_items.push({
        quantity: Number(quantities[idx]) ?? 1,
        price_data: {
          currency: "USD",
          product_data: {
            name: product.product.name,
            description: product.variant?.values,
            images: product.product.images.map((image) => image.url),
          },

          unit_amount: product?.discountBundle
            ? product.discountBundle?.price * 100
            : Math.floor(
                (product?.variant?.price ?? product.product.price) * 100
              ),
        },
      });
    });

    return line_items;
  },

  createShippingOptions: (shippingOptions: CustomerShippingRate[]) => {
    const options: Stripe.Checkout.SessionCreateParams.ShippingOption[] =
      shippingOptions.map((option) => ({
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: option.cost * 100,
            currency: "usd",
          },
          display_name: option.label,
        },
      }));

    return options;
  },

  createCheckoutSession: async ({ items, shippingOptions, orderId }) => {
    const session = await stripe.checkout.sessions.create({
      line_items: items,
      mode: "payment",
      payment_method_types: ["card"],
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["US", "CA"],
      },
      shipping_options: shippingOptions,
      phone_number_collection: {
        enabled: true,
      },
      automatic_tax: {
        enabled: true,
      },
      custom_text: {
        shipping_address: {
          message: `Please note that things made to order takes additional processing time before shipping. Check estimated delivery dates of products to see when to expect your item(s).`,
        },
      },
      success_url: `${env.NEXT_PUBLIC_URL}/cart/success?orderId=${orderId}`,
      cancel_url: `${env.NEXT_PUBLIC_URL}/cart?canceled=1`,

      metadata: {
        orderId: orderId,
      },

      payment_intent_data: {
        metadata: {
          orderId: orderId,
        },
      },
    });

    return { url: session.url };
  },

  handleCheckout: async ({ req, updateOrder }) => {
    let data: CheckoutSessionResponse;
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"];

    const event: Stripe.Event = stripe.webhooks.constructEvent(
      buf.toString(),
      sig as string,
      webhookSecret
    );

    switch (event.type) {
      case "checkout.session.completed":
        const eventSession = event.data.object as Stripe.Checkout.Session;

        const orderDataFromSession = getOrderInfo({
          orderData: {
            address: {
              street: eventSession?.shipping_details?.address?.line1 ?? "",
              additional: eventSession?.shipping_details?.address?.line2 ?? "",
              city: eventSession?.shipping_details?.address?.city ?? "",
              state: eventSession?.shipping_details?.address?.state ?? "",
              postal_code:
                eventSession?.shipping_details?.address?.postal_code ?? "",
              country: eventSession?.shipping_details?.address?.country ?? "",
            },
          },
          formattedData: formatSessionData(eventSession),
        });

        const checkoutSessionOrder = await updateOrder({
          orderId: eventSession?.metadata?.orderId ?? "",
          orderData: orderDataFromSession,
          orderStatus: {
            type: "ORDER_PLACED",
            title: "Order placed",
            description: `Total amount to be paid: $ ${(
              formatSessionData(eventSession).totalDetails.total / 100
            ).toFixed(2)}`,
          },
          isComplete: true,
        });

        if (!checkoutSessionOrder) {
          data = {
            status: "failed",
            messages: [
              "There was an issue with updating the order. Please try again later.",
            ],
          };
          break;
        }

        console.log(`Order #${checkoutSessionOrder?.id} has been updated.`);
        console.log(`Payment successful for session ID: ${eventSession.id}`);
        data = {
          status: "success",
          messages: [
            `Order #${checkoutSessionOrder.id} has been updated.`,
            `Payment successful for session ID: ${eventSession.id}`,
          ],
        };
        break;

      case "payment_intent.created":
        const eventCreated = event.data.object as Stripe.PaymentIntent;

        await updateOrder({
          orderId: eventCreated?.metadata?.orderId ?? "",
          orderData: {},
          orderStatus: {
            type: "PAYMENT_INITIATED",
            title: "Payment initiated",
            description: `Payment has been initiated for ${eventCreated.id}`,
          },
          isComplete: false,
        });

        console.log(`Payment created for ${eventCreated.id}`);
        data = {
          status: "success",
          messages: [`Payment created for ${eventCreated.id}`],
        };
        break;

      case "payment_intent.processing":
        const eventProcessing = event.data.object as Stripe.PaymentIntent;

        await updateOrder({
          orderId: eventProcessing?.metadata?.orderId ?? "",
          orderData: {},
          orderStatus: {
            type: "PAYMENT_PENDING",
            title: "Payment processing",
            description: `Payment processing for ${eventProcessing.id}`,
          },
          isComplete: false,
        });

        console.log(`Payment processing for ${eventProcessing.id}`);
        data = {
          status: "success",
          messages: [`Payment processing for ${eventProcessing.id}`],
        };
        break;

      case "charge.succeeded":
        const eventCharge = event.data.object as Stripe.Charge;

        await updateOrder({
          orderId: eventCharge?.metadata?.orderId ?? "",
          orderData: { isPaid: true, status: "PAID" },
          orderStatus: {
            type: "PAYMENT_SUCCESSFUL",
            title: "Order payment was successful",
            description: `Customer successfully paid $ ${(
              eventCharge.amount / 100
            ).toFixed(2)} for order #${eventCharge.metadata?.orderId}`,
          },
          isComplete: false,
        });

        console.log(`Charge was successful for ${eventCharge.id}`);
        data = {
          status: "success",
          messages: [`Charge was successful for ${eventCharge.id}`],
        };
        break;

      case "payment_intent.succeeded":
        const eventIntent = event.data.object as Stripe.PaymentIntent;

        await updateOrder({
          orderId: eventIntent?.metadata?.orderId ?? "",
          orderData: {},
          orderStatus: {
            type: "PAYMENT_SUCCESSFUL",
            title: "Payment successful",
            description: `Total amount paid: $ ${(
              eventIntent.amount / 100
            ).toFixed(2)}`,
          },
          isComplete: false,
        });
        console.log(`PaymentIntent was successful for ${eventIntent.id}`);
        data = {
          status: "success",
          messages: [
            `PaymentIntent was successful for ${eventIntent.id}`,
            `PaymentIntent was successful for ${eventIntent.id}`,
          ],
        };
        break;

      case "payment_intent.payment_failed":
        const eventFailed = event.data.object as Stripe.PaymentIntent;

        await updateOrder({
          orderId: eventFailed?.metadata?.orderId ?? "",
          orderData: { isPaid: false, status: "PAYMENT_FAILED" },
          orderStatus: {
            type: "PAYMENT_FAILED",
            title: "Payment failed",
            description: `Payment failed for ${eventFailed.id}`,
          },
          isComplete: false,
        });

        console.log(`Payment failed for ${eventFailed.id}`);
        data = {
          status: "failed",
          messages: [`Payment failed for ${eventFailed.id}`],
        };
        break;

      default:
        // Unexpected event type
        console.error(`Unhandled event type: ${event.type}`);
        data = {
          status: "failed",
          messages: [`Unhandled event type: ${event.type}`],
        };
        break;
    }
    return data;
  },

  processPayment: async (order) => {
    // TODO: Process payment
  },

  retrievePayment: async (order) => {
    const paymentIntentId = order.paymentId ?? null;

    if (!paymentIntentId) {
      return null;
    }

    const paymentMethod = await stripe.paymentMethods.retrieve(paymentIntentId);

    console.log(paymentMethod);
    if (!paymentMethod) {
      return null;
    }

    const results: retrievePaymentResult = {
      items: order.orderItems,
      billingAddress: `${paymentMethod?.billing_details?.address?.line1},  ${paymentMethod?.billing_details?.address?.line2}, ${paymentMethod?.billing_details?.address?.city} ${paymentMethod?.billing_details?.address?.state} ${paymentMethod?.billing_details?.address?.postal_code},  `,
      shippingAddress: `${order?.address?.street},  ${order?.address?.additional}, ${order?.address?.city} ${order?.address?.state} ${order?.address?.postal_code},  `,
      orderPlaced: `Placed: ${new Date(paymentMethod?.created).toDateString()}`,
      paymentDetails: `${paymentMethod?.card?.brand} ending in ${paymentMethod?.card?.last4}`,
    };

    return results;
  },
};
