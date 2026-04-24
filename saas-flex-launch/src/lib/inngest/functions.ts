import { inngest } from "./client";
import { sendEmail } from "@/lib/email/send";
import {
  welcomeEmail,
  receiptEmail,
  cancelConfirmationEmail,
  trialEndingEmail,
} from "@/lib/email/templates";
import { logger } from "@/lib/logger";

export const onUserSignedUp = inngest.createFunction(
  { id: "on-user-signed-up", name: "Send welcome email on signup" },
  { event: "user/signed-up" },
  async ({ event, step }) => {
    await step.run("send-welcome-email", async () => {
      const { email, fullName } = event.data;
      const tmpl = welcomeEmail(fullName);
      const res = await sendEmail({ to: email, subject: tmpl.subject, html: tmpl.html });
      logger.info({ userId: event.data.userId, emailId: res.id }, "welcome email sent");
      return res;
    });
  },
);

export const onSubscriptionCreated = inngest.createFunction(
  { id: "on-subscription-created", name: "Send receipt on new subscription" },
  { event: "subscription/created" },
  async ({ event, step }) => {
    await step.run("send-receipt", async () => {
      const tmpl = receiptEmail(event.data.plan, event.data.amount);
      return sendEmail({ to: event.data.email, subject: tmpl.subject, html: tmpl.html });
    });
  },
);

export const onSubscriptionCancelled = inngest.createFunction(
  { id: "on-subscription-cancelled", name: "Send cancel confirmation" },
  { event: "subscription/cancelled" },
  async ({ event, step }) => {
    await step.run("send-cancel-email", async () => {
      const tmpl = cancelConfirmationEmail(event.data.periodEnd);
      return sendEmail({ to: event.data.email, subject: tmpl.subject, html: tmpl.html });
    });
  },
);

export const onTrialEndingSoon = inngest.createFunction(
  { id: "on-trial-ending-soon", name: "Send trial ending email" },
  { event: "trial/ending-soon" },
  async ({ event, step }) => {
    await step.run("send-trial-ending-email", async () => {
      const tmpl = trialEndingEmail(event.data.daysLeft);
      return sendEmail({ to: event.data.email, subject: tmpl.subject, html: tmpl.html });
    });
  },
);

export const functions = [
  onUserSignedUp,
  onSubscriptionCreated,
  onSubscriptionCancelled,
  onTrialEndingSoon,
];
