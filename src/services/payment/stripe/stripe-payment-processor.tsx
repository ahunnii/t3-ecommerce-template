import { Address } from "@prisma/client";
import { buffer } from "micro";
import type { Stripe } from "stripe";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";
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
      line_items.push({
        quantity: Number(quantities[idx]) ?? 1,
        price_data: {
          currency: "USD",
          product_data: {
            name: product.product.name,
            description: product.variant?.values,
            images: product.product.images.map((image) => image.url),
            metadata: {
              product_id: product.product.id,
              variant_id: product.variant?.id ?? "",
              discount_id: product?.discountBundle?.discount?.id ?? "",
            },
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

  createCheckoutSession: async ({
    items,
    shippingOptions,
    order_id,
    user_id,
    store_id,
  }) => {
    const session = await stripe.checkout.sessions.create({
      line_items: items,
      mode: "payment",
      payment_method_types: ["card"],
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["US", "CA"],
      },
      shipping_options: shippingOptions,
      phone_number_collection: { enabled: true },
      automatic_tax: { enabled: true },
      custom_text: {
        shipping_address: {
          message: `Please note that things made to order takes additional processing time before shipping. Check estimated delivery dates of products to see when to expect your item(s).`,
        },
      },
      success_url: `${env.NEXT_PUBLIC_URL}/cart/success`,
      cancel_url: `${env.NEXT_PUBLIC_URL}/cart?canceled=1`,

      metadata: { order_id: order_id ?? "", user_id: user_id ?? "", store_id },
      payment_intent_data: {
        metadata: {
          order_id: order_id ?? "",
          user_id: user_id ?? "",
          store_id,
        },
      },
    });

    return { url: session.url };
  },

  handleCheckout: async ({ req }) => {
    let data: CheckoutSessionResponse;
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"];

    const event: Stripe.Event = stripe.webhooks.constructEvent(
      buf.toString(),
      sig as string,
      webhookSecret
    );

    try {
      switch (event.type) {
        case "checkout.session.completed":
          const eventSession = event.data.object as Stripe.Checkout.Session;

          const checkoutSession = await stripe.checkout.sessions.retrieve(
            eventSession.id,
            {
              expand: ["line_items", "payment_intent"],
            }
          );

          const line_items = await stripe.checkout.sessions.listLineItems(
            eventSession.id,
            {
              expand: ["data.price.product"],
            }
          );

          console.log(checkoutSession);
          const paymentIntent = await stripe.paymentIntents.retrieve(
            (checkoutSession.payment_intent as Stripe.PaymentIntent).id,
            {
              expand: ["latest_charge", "latest_charge.balance_transaction"],
            }
          );
          console.log(paymentIntent);
          // convert line items back to order items
          const stripeOrderItems =
            line_items.data?.map((item: Stripe.LineItem) => {
              return {
                productId:
                  (item?.price?.product as Stripe.Product)?.metadata
                    ?.product_id ?? "",
                variantId:
                  (item?.price?.product as Stripe.Product)?.metadata
                    ?.variant_id ?? null,
                discountId:
                  (item?.price?.product as Stripe.Product)?.metadata
                    ?.discount_id ?? null,
                quantity: item.quantity ?? 1,
              };
            }) ?? [];

          const billingAddress = {
            name: checkoutSession?.customer_details?.name ?? "Guest",
            street: checkoutSession?.customer_details?.address?.line1 ?? "",
            additional: checkoutSession?.customer_details?.address?.line2 ?? "",
            city: checkoutSession?.customer_details?.address?.city ?? "",
            state: checkoutSession?.customer_details?.address?.state ?? "",
            postal_code:
              checkoutSession?.customer_details?.address?.postal_code ?? "",
            country: checkoutSession?.customer_details?.address?.country ?? "",
          };

          const shippingAddress = {
            name: checkoutSession?.shipping_details?.name ?? "Guest",
            street: checkoutSession?.shipping_details?.address?.line1 ?? "",
            additional: checkoutSession?.shipping_details?.address?.line2 ?? "",
            city: checkoutSession?.shipping_details?.address?.city ?? "",
            state: checkoutSession?.shipping_details?.address?.state ?? "",
            postal_code:
              checkoutSession?.shipping_details?.address?.postal_code ?? "",
            country: checkoutSession?.shipping_details?.address?.country ?? "",
          };

          const referenceNumber = (
            checkoutSession.payment_intent as Stripe.PaymentIntent
          ).id;

          const receiptLink =
            (paymentIntent.latest_charge as Stripe.Charge)?.receipt_url ?? "";

          const order = await prisma.order.create({
            data: {
              store: { connect: { id: checkoutSession?.metadata!.store_id } },
              user: {
                connect: {
                  id: checkoutSession?.metadata!.user_id ?? undefined,
                },
              },
              orderItems: { createMany: { data: stripeOrderItems } },
              receiptLink: receiptLink,
              timeline: {
                create: {
                  type: "ORDER_PLACED",
                  title: "Order placed",
                  description: `Placed on ${new Date().toDateString()}. Total amount paid: $ ${(
                    (checkoutSession?.amount_total ?? 0) / 100
                  ).toFixed(2)}`,
                },
              },
              paymentStatus: "PAID",
              referenceNumber: referenceNumber,
              referenceProvider: "STRIPE",

              subtotal: checkoutSession?.amount_subtotal ?? 0,
              total: checkoutSession?.amount_total ?? 0,
              shipping: checkoutSession?.total_details?.amount_shipping ?? 0,
              tax: checkoutSession?.total_details?.amount_tax ?? 0,
              discount: checkoutSession?.total_details?.amount_discount ?? 0,
              fee:
                (
                  (paymentIntent.latest_charge as Stripe.Charge)
                    ?.balance_transaction as Stripe.BalanceTransaction
                )?.fee ?? 0,

              billingAddress: {
                create: billingAddress,
              },
              shippingAddress: {
                create: shippingAddress,
              },
              email: checkoutSession?.customer_details?.email ?? "",
              phone:
                checkoutSession?.shipping_details?.phone ??
                checkoutSession?.customer_details?.phone ??
                "",
            },
            include: {
              orderItems: {
                include: {
                  variant: true,
                  product: {
                    include: {
                      variants: true,
                    },
                  },
                },
              },
            },
          });

          // const orderDataFromSession = getOrderInfo({
          //   orderData: {
          //     shippingAddress: {
          //       name: eventSession?.shipping_details?.name ?? "",
          //       street: eventSession?.shipping_details?.address?.line1 ?? "",
          //       additional: eventSession?.shipping_details?.address?.line2 ?? "",
          //       city: eventSession?.shipping_details?.address?.city ?? "",
          //       state: eventSession?.shipping_details?.address?.state ?? "",
          //       postal_code:
          //         eventSession?.shipping_details?.address?.postal_code ?? "",
          //       country: eventSession?.shipping_details?.address?.country ?? "",
          //     },
          //   },
          //   formattedData: formatSessionData(eventSession),
          // });

          // const checkoutSessionOrder = await updateOrder({
          //   orderId: eventSession?.metadata?.orderId ?? "",
          //   orderData: orderDataFromSession,
          //   orderStatus: {
          //     type: "ORDER_PLACED",
          //     title: "Order placed",
          //     description: `Total amount to be paid: $ ${(
          //       formatSessionData(eventSession).totalDetails.total / 100
          //     ).toFixed(2)}`,
          //   },
          //   isComplete: true,
          // });

          // if (!checkoutSessionOrder) {
          //   data = {
          //     status: "failed",
          //     messages: [
          //       "There was an issue with updating the order. Please try again later.",
          //     ],
          //   };
          //   break;
          // }

          if (!order) {
            data = {
              status: "failed",
              messages: [
                "There was an issue with updating the order. Please try again later.",
              ],
            };
            break;
          }

          order.orderItems.map(async (orderItem) => {
            if (!orderItem.variantId) {
              await prisma.product
                .update({
                  where: { id: orderItem.productId },
                  data: {
                    quantity:
                      orderItem.product.quantity - orderItem.quantity < 0
                        ? 0
                        : orderItem.product.quantity - orderItem.quantity,
                  },
                })
                .then((res) => {
                  if (res.quantity <= 0) {
                    return prisma.product.update({
                      where: { id: orderItem.productId },
                      data: { status: "ARCHIVED" },
                    });
                  }
                });
            } else if (orderItem.variantId && orderItem.variant) {
              await prisma.variation.update({
                where: { id: orderItem.variantId },
                data: {
                  quantity:
                    orderItem.variant.quantity - orderItem.quantity < 0
                      ? 0
                      : orderItem.variant.quantity - orderItem.quantity,
                },
              });
              const variants = await prisma.variation.findMany({
                where: {
                  id: { in: [...orderItem.product.variants.map((v) => v.id)] },
                },
              });

              const hasValidItems = variants.some(
                (variant) => variant.quantity > 0
              );

              if (!hasValidItems) {
                return prisma.product.update({
                  where: { id: orderItem.productId },
                  data: { status: "ARCHIVED" },
                });
              }
            }
          });

          console.log(`Order #${order?.id} has been created.`);
          console.log(`Payment successful for session ID: ${eventSession.id}`);
          data = {
            status: "success",
            messages: [
              `Order #${order.id} has been updated.`,
              `Payment successful for session ID: ${eventSession.id}`,
            ],
          };
          break;

        // case "payment_intent.created":
        //   const eventCreated = event.data.object as Stripe.PaymentIntent;

        //   await updateOrder({
        //     orderId: eventCreated?.metadata?.orderId ?? "",
        //     orderData: {},
        //     orderStatus: {
        //       type: "PAYMENT_INITIATED",
        //       title: "Payment initiated",
        //       description: `Payment has been initiated for ${eventCreated.id}`,
        //     },
        //     isComplete: false,
        //   });

        //   console.log(`Payment created for ${eventCreated.id}`);
        //   data = {
        //     status: "success",
        //     messages: [`Payment created for ${eventCreated.id}`],
        //   };
        //   break;

        // case "payment_intent.processing":
        //   const eventProcessing = event.data.object as Stripe.PaymentIntent;

        //   await updateOrder({
        //     orderId: eventProcessing?.metadata?.orderId ?? "",
        //     orderData: {},
        //     orderStatus: {
        //       type: "PAYMENT_PENDING",
        //       title: "Payment processing",
        //       description: `Payment processing for ${eventProcessing.id}`,
        //     },
        //     isComplete: false,
        //   });

        //   console.log(`Payment processing for ${eventProcessing.id}`);
        //   data = {
        //     status: "success",
        //     messages: [`Payment processing for ${eventProcessing.id}`],
        //   };
        //   break;

        // case "charge.succeeded":
        //   const eventCharge = event.data.object as Stripe.Charge;

        //   await updateOrder({
        //     orderId: eventCharge?.metadata?.orderId ?? "",
        //     orderData: { paymentStatus: "PAID" },
        //     orderStatus: {
        //       type: "PAYMENT_SUCCESSFUL",
        //       title: "Order payment was successful",
        //       description: `Customer successfully paid $ ${(
        //         eventCharge.amount / 100
        //       ).toFixed(2)} for order #${eventCharge.metadata?.orderId}`,
        //     },
        //     isComplete: false,
        //   });

        //   console.log(`Charge was successful for ${eventCharge.id}`);
        //   data = {
        //     status: "success",
        //     messages: [`Charge was successful for ${eventCharge.id}`],
        //   };
        //   break;

        // case "payment_intent.succeeded":
        //   const eventIntent = event.data.object as Stripe.PaymentIntent;

        //   await updateOrder({
        //     orderId: eventIntent?.metadata?.orderId ?? "",
        //     orderData: {},
        //     orderStatus: {
        //       type: "PAYMENT_SUCCESSFUL",
        //       title: "Payment successful",
        //       description: `Total amount paid: $ ${(
        //         eventIntent.amount / 100
        //       ).toFixed(2)}`,
        //     },
        //     isComplete: false,
        //   });
        //   console.log(`PaymentIntent was successful for ${eventIntent.id}`);
        //   data = {
        //     status: "success",
        //     messages: [
        //       `PaymentIntent was successful for ${eventIntent.id}`,
        //       `PaymentIntent was successful for ${eventIntent.id}`,
        //     ],
        //   };
        //   break;

        // case "payment_intent.payment_failed":
        //   const eventFailed = event.data.object as Stripe.PaymentIntent;

        //   await updateOrder({
        //     orderId: eventFailed?.metadata?.orderId ?? "",
        //     orderData: { paymentStatus: "FAILED" },
        //     orderStatus: {
        //       type: "PAYMENT_FAILED",
        //       title: "Payment failed",
        //       description: `Payment failed for ${eventFailed.id}`,
        //     },
        //     isComplete: false,
        //   });

        //   console.log(`Payment failed for ${eventFailed.id}`);
        //   data = {
        //     status: "failed",
        //     messages: [`Payment failed for ${eventFailed.id}`],
        //   };
        //   break;

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
    } catch (e) {
      throw new Error(`Unhandled event type: ${event.type}`);
    }
  },

  processPayment: async () => {
    // TODO: Process payment
  },

  retrievePayment: async (order) => {
    const paymentIntentId = order.referenceNumber ?? null;

    // if (!paymentIntentId) {
    //   return null;
    // }

    // const paymentMethod = await stripe.paymentMethods.retrieve(paymentIntentId);

    // console.log(paymentMethod);
    // if (!paymentMethod) {
    //   return null;
    // }

    // const results: retrievePaymentResult = {
    //   items: order.orderItems,
    //   billingAddress: `${paymentMethod?.billing_details?.address?.line1},  ${paymentMethod?.billing_details?.address?.line2}, ${paymentMethod?.billing_details?.address?.city} ${paymentMethod?.billing_details?.address?.state} ${paymentMethod?.billing_details?.address?.postal_code},  `,
    //   shippingAddress: `${order?.shippingAddress?.street},  ${order?.shippingAddress?.additional}, ${order?.shippingAddress?.city} ${order?.shippingAddress?.state} ${order?.shippingAddress?.postal_code},  `,
    //   orderPlaced: `Placed: ${new Date(paymentMethod?.created).toDateString()}`,
    //   paymentDetails: `${paymentMethod?.card?.brand} ending in ${paymentMethod?.card?.last4}`,
    // };

    await new Promise((resolve) => setTimeout(resolve, 2000));
    const results: retrievePaymentResult = {
      items: [],
      billingAddress: `billingAddress`,
      shippingAddress: `shippingAddress`,
      orderPlaced: `Placed: `,
      paymentDetails: ``,
    };

    return results;
  },
};
