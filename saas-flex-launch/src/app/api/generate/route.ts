import { NextResponse, type NextRequest } from "next/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { projects } from "@/lib/db/schema";
import { generateLandingContent } from "@/lib/ai/generate-page";
import { toneEnum } from "@/lib/validations/project";
import { checkGenerationQuota, recordUsageEvent } from "@/lib/quotas";
import { errorResponse, handleApiError } from "@/lib/api/errors";
import { checkRateLimit } from "@/lib/ratelimit";
import { logger } from "@/lib/logger";

export const maxDuration = 60;

const bodySchema = z.object({ projectId: z.string().uuid() });

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return errorResponse(401, "Unauthorized");

    const rl = await checkRateLimit("generate", user.id);
    if (!rl.success) return errorResponse(429, "Rate limit exceeded. Try again in 1 minute.");

    const quota = await checkGenerationQuota(user.id, user.profile.plan);
    if (!quota.allowed) {
      return errorResponse(403, "Generation quota reached this month", {
        reason: quota.reason,
        current: quota.current,
        limit: quota.limit,
      });
    }

    const body = await request.json();
    const { projectId } = bodySchema.parse(body);

    const [project] = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, projectId), eq(projects.userId, user.id)))
      .limit(1);

    if (!project) return errorResponse(404, "Project not found");

    const tone = toneEnum.safeParse(project.tone).success ? toneEnum.parse(project.tone) : "professional";

    const start = Date.now();
    const content = await generateLandingContent({
      name: project.name,
      description: project.description,
      tone,
      audience: project.audience ?? undefined,
    });
    const durationMs = Date.now() - start;

    await db
      .update(projects)
      .set({ content, updatedAt: new Date() })
      .where(eq(projects.id, project.id));

    await recordUsageEvent(user.id, "page_generated", {
      projectId: project.id,
      durationMs,
    });

    logger.info({ userId: user.id, projectId: project.id, durationMs }, "page generated");
    return NextResponse.json({ content });
  } catch (err) {
    return handleApiError(err, "POST /api/generate");
  }
}
