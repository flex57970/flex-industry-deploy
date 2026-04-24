import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { profiles } from "@/lib/db/schema";
import { errorResponse, handleApiError } from "@/lib/api/errors";

const schema = z.object({
  fullName: z.string().trim().min(1).max(80).optional(),
  avatarUrl: z.string().url().optional(),
});

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return errorResponse(401, "Unauthorized");

    const body = await request.json();
    const input = schema.parse(body);

    await db
      .update(profiles)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(profiles.id, user.id));

    return NextResponse.json({ success: true });
  } catch (err) {
    return handleApiError(err, "PATCH /api/profile");
  }
}
