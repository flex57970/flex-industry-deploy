import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { logger } from "@/lib/logger";

export function errorResponse(status: number, error: string, details?: unknown): NextResponse {
  return NextResponse.json({ error, details }, { status });
}

export function handleApiError(err: unknown, context: string): NextResponse {
  if (err instanceof ZodError) {
    return errorResponse(400, "Validation error", err.flatten().fieldErrors);
  }
  logger.error({ err, context }, "API error");
  const message = err instanceof Error ? err.message : "Internal server error";
  return errorResponse(500, message);
}
