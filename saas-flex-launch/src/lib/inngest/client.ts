import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "flex-launch",
  eventKey: process.env.INNGEST_EVENT_KEY,
});

export type FlexEvents = {
  "user/signed-up": { data: { userId: string; email: string; fullName?: string } };
  "subscription/created": { data: { userId: string; email: string; plan: string; amount: string } };
  "subscription/cancelled": { data: { userId: string; email: string; periodEnd: string } };
  "trial/ending-soon": { data: { userId: string; email: string; daysLeft: number } };
};
