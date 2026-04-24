import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { stripe } from "@/lib/stripe/client";
import { errorResponse, handleApiError } from "@/lib/api/errors";

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user) return errorResponse(401, "Unauthorized");
    if (!user.profile.stripeCustomerId) return errorResponse(400, "No Stripe customer");

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const session = await stripe.billingPortal.sessions.create({
      customer: user.profile.stripeCustomerId,
      return_url: `${appUrl}/billing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    return handleApiError(err, "POST /api/stripe/portal");
  }
}
