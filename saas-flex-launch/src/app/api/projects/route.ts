import { NextResponse, type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { projects } from "@/lib/db/schema";
import { createProjectSchema } from "@/lib/validations/project";
import { checkProjectQuota } from "@/lib/quotas";
import { slugify } from "@/lib/utils";
import { errorResponse, handleApiError } from "@/lib/api/errors";
import { checkRateLimit } from "@/lib/ratelimit";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return errorResponse(401, "Unauthorized");

    const list = await db.select().from(projects).where(eq(projects.userId, user.id));
    return NextResponse.json({ projects: list });
  } catch (err) {
    return handleApiError(err, "GET /api/projects");
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return errorResponse(401, "Unauthorized");

    const rl = await checkRateLimit("api", user.id);
    if (!rl.success) return errorResponse(429, "Rate limit exceeded");

    const quota = await checkProjectQuota(user.id, user.profile.plan);
    if (!quota.allowed) {
      return errorResponse(403, "Project quota reached", {
        reason: quota.reason,
        current: quota.current,
        limit: quota.limit,
      });
    }

    const body = await request.json();
    const input = createProjectSchema.parse(body);

    const slugBase = slugify(input.name);
    const slug = `${slugBase}-${Math.random().toString(36).slice(2, 8)}`;

    const [created] = await db
      .insert(projects)
      .values({
        userId: user.id,
        name: input.name,
        description: input.description,
        tone: input.tone,
        audience: input.audience || null,
        language: input.language,
        industry: input.industry || null,
        benefits: input.benefits || null,
        priceRange: input.priceRange,
        ctaGoal: input.ctaGoal,
        slug,
      })
      .returning();

    if (!created) throw new Error("Failed to insert project");

    logger.info({ userId: user.id, projectId: created.id }, "project created");
    return NextResponse.json({ project: created }, { status: 201 });
  } catch (err) {
    return handleApiError(err, "POST /api/projects");
  }
}
