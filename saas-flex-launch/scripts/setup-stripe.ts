/**
 * Creates Stripe products + prices for FLEX Launch.
 *
 * Usage:
 *   1. Ensure STRIPE_SECRET_KEY is set in .env.local (test or live mode)
 *   2. pnpm run setup:stripe
 *   3. Copy the printed STRIPE_PRICE_* env vars into .env.local
 *
 * Idempotent: if products with matching names exist, they're reused.
 */
import "dotenv/config";
import Stripe from "stripe";
import { PLANS } from "../src/lib/stripe/plans";

const secret = process.env.STRIPE_SECRET_KEY;
if (!secret) {
  console.error("❌ STRIPE_SECRET_KEY not set");
  process.exit(1);
}

const stripe = new Stripe(secret, { apiVersion: "2025-02-24.acacia" });

async function upsertProduct(name: string, description: string) {
  const existing = await stripe.products.list({ limit: 100 });
  const match = existing.data.find((p) => p.name === name && p.active);
  if (match) {
    console.log(`✓ reuse product ${name} (${match.id})`);
    return match;
  }
  const p = await stripe.products.create({ name, description });
  console.log(`+ created product ${name} (${p.id})`);
  return p;
}

async function upsertMonthlyPrice(productId: string, amountEuros: number) {
  const existing = await stripe.prices.list({ product: productId, limit: 100, active: true });
  const match = existing.data.find(
    (p) =>
      p.unit_amount === amountEuros * 100 &&
      p.currency === "eur" &&
      p.recurring?.interval === "month",
  );
  if (match) {
    console.log(`  ✓ reuse price ${amountEuros}€/mois (${match.id})`);
    return match;
  }
  const price = await stripe.prices.create({
    product: productId,
    unit_amount: amountEuros * 100,
    currency: "eur",
    recurring: { interval: "month" },
    nickname: `${amountEuros}€/month`,
  });
  console.log(`  + created price ${amountEuros}€/mois (${price.id})`);
  return price;
}

async function main() {
  const mode = secret!.startsWith("sk_live_") ? "LIVE" : "TEST";
  console.log(`\n🔷 FLEX Launch Stripe setup — ${mode} mode\n`);

  const pro = PLANS.pro;
  const agency = PLANS.agency;

  const proProduct = await upsertProduct(
    `FLEX Launch — ${pro.name}`,
    "Générateur IA de landing pages · Plan Pro",
  );
  const proPrice = await upsertMonthlyPrice(proProduct.id, pro.priceMonthly);

  const agencyProduct = await upsertProduct(
    `FLEX Launch — ${agency.name}`,
    "Générateur IA de landing pages · Plan Agency",
  );
  const agencyPrice = await upsertMonthlyPrice(agencyProduct.id, agency.priceMonthly);

  console.log("\n📋 Ajoute ces variables dans ton .env.local :\n");
  console.log(`STRIPE_PRICE_PRO_MONTHLY=${proPrice.id}`);
  console.log(`STRIPE_PRICE_AGENCY_MONTHLY=${agencyPrice.id}`);
  console.log("\n✅ Done.\n");
}

main().catch((err) => {
  console.error("❌ setup-stripe failed:", err);
  process.exit(1);
});
