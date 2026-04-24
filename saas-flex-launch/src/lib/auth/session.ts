import { cache } from "react";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "./supabase-server";
import { db } from "@/lib/db/client";
import { profiles, type Profile } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { logger } from "@/lib/logger";

export type AuthUser = {
  id: string;
  email: string;
  profile: Profile;
};

export const getSession = cache(async () => {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user || !user.email) return null;
  return { id: user.id, email: user.email };
});

export const getCurrentUser = cache(async (): Promise<AuthUser | null> => {
  const session = await getSession();
  if (!session) return null;

  const [profile] = await db.select().from(profiles).where(eq(profiles.id, session.id)).limit(1);

  if (!profile) {
    const [inserted] = await db
      .insert(profiles)
      .values({ id: session.id, email: session.email, plan: "free" })
      .returning();
    if (!inserted) {
      logger.error({ userId: session.id }, "Failed to create profile");
      return null;
    }
    return { id: session.id, email: session.email, profile: inserted };
  }

  return { id: session.id, email: session.email, profile };
});

export async function requireUser(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireAdmin(): Promise<AuthUser> {
  const user = await requireUser();
  const admins = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  if (!admins.includes(user.email.toLowerCase())) redirect("/dashboard");
  return user;
}
