import { resend, FROM_EMAIL } from "./client";
import { logger } from "@/lib/logger";

export async function sendEmail(args: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<{ id: string | null; error: string | null }> {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: args.to,
      subject: args.subject,
      html: args.html,
      replyTo: args.replyTo,
    });
    if (error) {
      logger.error({ error, to: args.to }, "Resend send failed");
      return { id: null, error: error.message };
    }
    return { id: data?.id ?? null, error: null };
  } catch (err) {
    logger.error({ err, to: args.to }, "Email send exception");
    return { id: null, error: err instanceof Error ? err.message : "unknown error" };
  }
}
