import { NextResponse, type NextRequest } from "next/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { projects, type LandingContent } from "@/lib/db/schema";
import { generateLandingContent, generateSection } from "@/lib/ai/generate-page";
import { toneEnum, languageEnum, priceRangeEnum, ctaGoalEnum } from "@/lib/validations/project";
import { checkGenerationQuota, recordUsageEvent } from "@/lib/quotas";
import { errorResponse, handleApiError } from "@/lib/api/errors";
import { checkRateLimit } from "@/lib/ratelimit";
import { logger } from "@/lib/logger";

export const maxDuration = 60;

const sectionEnum = z.enum(["all", "hero", "features", "socialProof", "pricing", "faq", "cta"]);

const bodySchema = z.object({
  projectId: z.string().uuid(),
  section: sectionEnum.default("all"),
});

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
    const { projectId, section } = bodySchema.parse(body);

    const [project] = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, projectId), eq(projects.userId, user.id)))
      .limit(1);

    if (!project) return errorResponse(404, "Project not found");

    const tone = toneEnum.safeParse(project.tone).success
      ? toneEnum.parse(project.tone)
      : "professional";
    const language = languageEnum.safeParse(project.language).success
      ? languageEnum.parse(project.language)
      : "fr";
    const priceRange = priceRangeEnum.safeParse(project.priceRange).success
      ? priceRangeEnum.parse(project.priceRange)
      : "medium";
    const ctaGoal = ctaGoalEnum.safeParse(project.ctaGoal).success
      ? ctaGoalEnum.parse(project.ctaGoal)
      : "signup";

    const baseArgs = {
      name: project.name,
      description: project.description,
      tone,
      audience: project.audience ?? undefined,
      language,
      industry: project.industry ?? undefined,
      benefits: project.benefits ?? undefined,
      priceRange,
      ctaGoal,
    };

    const start = Date.now();
    let content: LandingContent;

    if (section === "all" || !project.content) {
      content = await generateLandingContent(baseArgs);
    } else {
      const partial = await generateSection(section, baseArgs);
      content = mergeSection(project.content, section, partial);
    }
    const durationMs = Date.now() - start;

    await db
      .update(projects)
      .set({ content, updatedAt: new Date() })
      .where(eq(projects.id, project.id));

    await recordUsageEvent(user.id, "page_generated", {
      projectId: project.id,
      section,
      durationMs,
    });

    logger.info(
      { userId: user.id, projectId: project.id, section, durationMs },
      "page generated",
    );
    return NextResponse.json({ content });
  } catch (err) {
    return handleApiError(err, "POST /api/generate");
  }
}

function mergeSection(
  current: LandingContent,
  section: Exclude<z.infer<typeof sectionEnum>, "all">,
  partial: unknown,
): LandingContent {
  switch (section) {
    case "hero":
      return { ...current, hero: partial as LandingContent["hero"] };
    case "features":
      return { ...current, features: partial as LandingContent["features"] };
    case "socialProof":
      return { ...current, socialProof: partial as LandingContent["socialProof"] };
    case "pricing":
      return { ...current, pricing: partial as LandingContent["pricing"] };
    case "faq":
      return { ...current, faq: partial as LandingContent["faq"] };
    case "cta":
      return { ...current, cta: partial as LandingContent["cta"] };
  }
}
