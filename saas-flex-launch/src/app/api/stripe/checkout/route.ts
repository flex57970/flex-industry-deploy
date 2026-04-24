import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { profiles } from "@/lib/db/schema";
import { stripe } from "@/lib/stripe/client";
import { getStripePriceId, getPlan } from "@/lib/stripe/plans";
import { errorResponse, handleApiError } from "@/lib/api/errors";
import { logger } from "@/lib/logger";

const schema = z.object({ plan: z.enum(["pro", "agency"]) });

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return errorResponse(401, "Unauthorized");

    const body = await request.json();
    const { plan } = schema.parse(body);

    const priceId = getStripePriceId(plan);
    if (!priceId) return errorResponse(500, `Missing Stripe price ID for plan ${plan}`);

    let customerId = user.profile.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: user.id },
      });
      customerId = customer.id;
      await db
        .update(profiles)
        .set({ stripeCustomerId: customerId, updatedAt: new Date() })
        .where(eq(profiles.id, user.id));
    }

    const config = getPlan(plan);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: config.trialDays > 0 ? { trial_period_days: config.trialDays } : undefined,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      success_url: `${appUrl}/billing?success=1`,
      cancel_url: `${appUrl}/billing?canceled=1`,
      metadata: { userId: user.id, plan },
    });

    if (!session.url) throw new Error("Stripe did not return a checkout URL");
    logger.info({ userId: user.id, plan }, "stripe checkout session created");
    return NextResponse.json({ url: session.url });
  } catch (err) {
    return handleApiError(err, "POST /api/stripe/checkout");
  }
}
