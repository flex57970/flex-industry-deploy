import { and, count, eq, gte } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { projects, usageEvents, type Plan } from "@/lib/db/schema";
import { getPlan } from "@/lib/stripe/plans";

function startOfMonth(): Date {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
}

export type QuotaCheck = {
  allowed: boolean;
  reason?: "plan_limit_projects" | "plan_limit_generations";
  current: number;
  limit: number;
  plan: Plan;
};

export async function checkProjectQuota(userId: string, plan: Plan): Promise<QuotaCheck> {
  const { limits } = getPlan(plan);
  const [row] = await db
    .select({ c: count() })
    .from(projects)
    .where(eq(projects.userId, userId));
  const current = row?.c ?? 0;
  return {
    allowed: current < limits.projects,
    reason: current >= limits.projects ? "plan_limit_projects" : undefined,
    current,
    limit: limits.projects,
    plan,
  };
}

export async function checkGenerationQuota(userId: string, plan: Plan): Promise<QuotaCheck> {
  const { limits } = getPlan(plan);
  const [row] = await db
    .select({ c: count() })
    .from(usageEvents)
    .where(
      and(
        eq(usageEvents.userId, userId),
        eq(usageEvents.event, "page_generated"),
        gte(usageEvents.createdAt, startOfMonth()),
      ),
    );
  const current = row?.c ?? 0;
  return {
    allowed: current < limits.generationsPerMonth,
    reason: current >= limits.generationsPerMonth ? "plan_limit_generations" : undefined,
    current,
    limit: limits.generationsPerMonth,
    plan,
  };
}

export async function recordUsageEvent(
  userId: string,
  event: string,
  metadata: Record<string, unknown> = {},
): Promise<void> {
  await db.insert(usageEvents).values({ userId, event, metadata });
}
