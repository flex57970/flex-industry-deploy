import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;
if (!secretKey) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(secretKey, {
  apiVersion: "2025-02-24.acacia",
  appInfo: {
    name: "FLEX Launch",
    version: "0.1.0",
  },
  typescript: true,
});
