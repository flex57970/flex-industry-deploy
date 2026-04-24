import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/auth/supabase-server";
import { db } from "@/lib/db/client";
import { profiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { inngest } from "@/lib/inngest/client";
import { logger } from "@/lib/logger";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const supabase = createSupabaseServerClient();
  const { error, data } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user || !data.user.email) {
    logger.error({ error }, "auth callback failed");
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  const userId = data.user.id;
  const email = data.user.email;
  const fullName = (data.user.user_metadata?.full_name as string | undefined) ?? undefined;
  const avatarUrl = (data.user.user_metadata?.avatar_url as string | undefined) ?? undefined;

  try {
    const [existing] = await db.select().from(profiles).where(eq(profiles.id, userId)).limit(1);
    if (!existing) {
      await db.insert(profiles).values({
        id: userId,
        email,
        fullName: fullName ?? null,
        avatarUrl: avatarUrl ?? null,
        plan: "free",
      });
      await inngest.send({
        name: "user/signed-up",
        data: { userId, email, fullName },
      });
      logger.info({ userId }, "profile created via auth callback");
    }
  } catch (err) {
    logger.error({ err, userId }, "profile upsert failed in callback");
  }

  return NextResponse.redirect(`${origin}${next}`);
}
