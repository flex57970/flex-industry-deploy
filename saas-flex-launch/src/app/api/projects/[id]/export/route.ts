import { NextResponse, type NextRequest } from "next/server";
import { and, eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { projects } from "@/lib/db/schema";
import { errorResponse, handleApiError } from "@/lib/api/errors";
import { renderLandingHtml } from "@/lib/exporter/html";

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) return errorResponse(401, "Unauthorized");

    const [project] = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, params.id), eq(projects.userId, user.id)))
      .limit(1);

    if (!project) return errorResponse(404, "Project not found");
    if (!project.content) return errorResponse(400, "Project has no generated content");

    const html = renderLandingHtml(project.name, project.content, {
      removeBranding: user.profile.plan === "agency",
      primaryColor: project.primaryColor ?? undefined,
      accentColor: project.accentColor ?? undefined,
    });

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `attachment; filename="${project.slug}.html"`,
      },
    });
  } catch (err) {
    return handleApiError(err, "GET /api/projects/[id]/export");
  }
}
