import Stripe from "stripe";
import { env } from "~/env.mjs";

export const stripe = new Stripe(env.STRIPE_SK, {
  apiVersion: "2022-11-15",
});

export const getStripeClient = (key: string): Stripe => {
  return new Stripe(key, {
    apiVersion: "2022-11-15",
  });
};
