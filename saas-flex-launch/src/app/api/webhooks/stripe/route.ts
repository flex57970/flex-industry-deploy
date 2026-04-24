import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { eq } from "drizzle-orm";
import { stripe } from "@/lib/stripe/client";
import { db } from "@/lib/db/client";
import { profiles, subscriptions } from "@/lib/db/schema";
import { planFromPriceId, getPlan } from "@/lib/stripe/plans";
import { inngest } from "@/lib/inngest/client";
import { logger } from "@/lib/logger";
import { formatCurrency } from "@/lib/utils";

export const runtime = "nodejs";

const RELEVANT_EVENTS = new Set([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.paid",
  "invoice.payment_failed",
]);

export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    logger.error("STRIPE_WEBHOOK_SECRET not set");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch (err) {
    logger.warn({ err }, "webhook signature verification failed");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (!RELEVANT_EVENTS.has(event.type)) {
    return NextResponse.json({ received: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        logger.info({ sessionId: session.id, userId: session.metadata?.userId }, "checkout completed");
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpsert(sub, event.type === "customer.subscription.created");
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(sub);
        break;
      }
      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaid(invoice);
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        logger.warn({ invoiceId: invoice.id, customer: invoice.customer }, "invoice payment failed");
        break;
      }
    }
    return NextResponse.json({ received: true });
  } catch (err) {
    logger.error({ err, eventType: event.type }, "webhook handler error");
    return NextResponse.json({ error: "Handler error" }, { status: 500 });
  }
}

async function handleSubscriptionUpsert(sub: Stripe.Subscription, isNew: boolean) {
  const customerId = sub.customer as string;
  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.stripeCustomerId, customerId))
    .limit(1);

  if (!profile) {
    logger.warn({ customerId }, "no profile for stripe customer");
    return;
  }

  const priceId = sub.items.data[0]?.price.id;
  if (!priceId) return;
  const plan = planFromPriceId(priceId) ?? "free";

  await db
    .update(profiles)
    .set({
      plan,
      subscriptionStatus: sub.status,
      trialEndsAt: sub.trial_end ? new Date(sub.trial_end * 1000) : null,
      updatedAt: new Date(),
    })
    .where(eq(profiles.id, profile.id));

  await db
    .insert(subscriptions)
    .values({
      id: sub.id,
      userId: profile.id,
      stripeCustomerId: customerId,
      stripePriceId: priceId,
      status: sub.status,
      currentPeriodStart: new Date(sub.current_period_start * 1000),
      currentPeriodEnd: new Date(sub.current_period_end * 1000),
      cancelAtPeriodEnd: sub.cancel_at_period_end,
    })
    .onConflictDoUpdate({
      target: subscriptions.id,
      set: {
        status: sub.status,
        currentPeriodStart: new Date(sub.current_period_start * 1000),
        currentPeriodEnd: new Date(sub.current_period_end * 1000),
        cancelAtPeriodEnd: sub.cancel_at_period_end,
        updatedAt: new Date(),
      },
    });

  if (isNew && plan !== "free") {
    const planConfig = getPlan(plan);
    await inngest.send({
      name: "subscription/created",
      data: {
        userId: profile.id,
        email: profile.email,
        plan: planConfig.name,
        amount: formatCurrency(planConfig.priceMonthly),
      },
    });
  }

  logger.info({ userId: profile.id, plan, status: sub.status }, "subscription upserted");
}

async function handleSubscriptionDeleted(sub: Stripe.Subscription) {
  const customerId = sub.customer as string;
  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.stripeCustomerId, customerId))
    .limit(1);

  if (!profile) return;

  await db
    .update(profiles)
    .set({ plan: "free", subscriptionStatus: "canceled", trialEndsAt: null, updatedAt: new Date() })
    .where(eq(profiles.id, profile.id));

  await inngest.send({
    name: "subscription/cancelled",
    data: {
      userId: profile.id,
      email: profile.email,
      periodEnd: new Date(sub.current_period_end * 1000).toLocaleDateString("fr-FR"),
    },
  });

  logger.info({ userId: profile.id }, "subscription deleted, plan reverted to free");
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  logger.info({ invoiceId: invoice.id, amount: invoice.amount_paid }, "invoice paid");
}
