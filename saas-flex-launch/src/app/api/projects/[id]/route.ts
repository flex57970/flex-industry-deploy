import { NextResponse, type NextRequest } from "next/server";
import { and, eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { projects } from "@/lib/db/schema";
import { updateProjectSchema } from "@/lib/validations/project";
import { errorResponse, handleApiError } from "@/lib/api/errors";

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
    return NextResponse.json({ project });
  } catch (err) {
    return handleApiError(err, "GET /api/projects/[id]");
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) return errorResponse(401, "Unauthorized");

    const body = await request.json();
    const input = updateProjectSchema.parse(body);

    if (input.customDomain && user.profile.plan === "free") {
      return errorResponse(403, "Custom domain requires Pro or Agency plan");
    }

    const { content, ...rest } = input;
    const updateSet: Record<string, unknown> = { ...rest, updatedAt: new Date() };
    if (content !== undefined) updateSet.content = content;

    const [updated] = await db
      .update(projects)
      .set(updateSet)
      .where(and(eq(projects.id, params.id), eq(projects.userId, user.id)))
      .returning();

    if (!updated) return errorResponse(404, "Project not found");
    return NextResponse.json({ project: updated });
  } catch (err) {
    return handleApiError(err, "PATCH /api/projects/[id]");
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) return errorResponse(401, "Unauthorized");

    const deleted = await db
      .delete(projects)
      .where(and(eq(projects.id, params.id), eq(projects.userId, user.id)))
      .returning({ id: projects.id });

    if (deleted.length === 0) return errorResponse(404, "Project not found");
    return NextResponse.json({ success: true });
  } catch (err) {
    return handleApiError(err, "DELETE /api/projects/[id]");
  }
}
