import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const planEnum = pgEnum("plan", ["free", "pro", "agency"]);

export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id").primaryKey(),
    email: text("email").notNull().unique(),
    fullName: text("full_name"),
    avatarUrl: text("avatar_url"),
    stripeCustomerId: text("stripe_customer_id"),
    plan: planEnum("plan").notNull().default("free"),
    trialEndsAt: timestamp("trial_ends_at", { withTimezone: true }),
    subscriptionStatus: text("subscription_status"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    stripeCustomerIdx: index("profiles_stripe_customer_idx").on(t.stripeCustomerId),
  }),
);

export const projects = pgTable(
  "projects",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    tone: text("tone").default("professional"),
    audience: text("audience"),
    language: text("language").default("fr"),
    industry: text("industry"),
    benefits: text("benefits"),
    priceRange: text("price_range").default("medium"),
    ctaGoal: text("cta_goal").default("signup"),
    primaryColor: text("primary_color").default("#D4AF37"),
    accentColor: text("accent_color").default("#0D0D0D"),
    theme: text("theme").default("dark"),
    content: jsonb("content").$type<LandingContent | null>().default(null),
    published: boolean("published").notNull().default(false),
    customDomain: text("custom_domain"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx: index("projects_user_idx").on(t.userId),
    slugIdx: index("projects_slug_idx").on(t.slug),
  }),
);

export const usageEvents = pgTable(
  "usage_events",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    event: text("event").notNull(),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx: index("usage_events_user_idx").on(t.userId),
    eventIdx: index("usage_events_event_idx").on(t.event),
  }),
);

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: text("id").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    stripeCustomerId: text("stripe_customer_id").notNull(),
    stripePriceId: text("stripe_price_id").notNull(),
    status: text("status").notNull(),
    currentPeriodStart: timestamp("current_period_start", { withTimezone: true }).notNull(),
    currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }).notNull(),
    cancelAtPeriodEnd: boolean("cancel_at_period_end").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx: index("subscriptions_user_idx").on(t.userId),
  }),
);

export const profilesRelations = relations(profiles, ({ many }) => ({
  projects: many(projects),
  usageEvents: many(usageEvents),
  subscriptions: many(subscriptions),
}));

export const projectsRelations = relations(projects, ({ one }) => ({
  user: one(profiles, { fields: [projects.userId], references: [profiles.id] }),
}));

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type UsageEvent = typeof usageEvents.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;
export type Plan = (typeof planEnum.enumValues)[number];

export type LandingContent = {
  hero: { eyebrow?: string; title: string; subtitle: string; ctaPrimary: string; ctaSecondary?: string };
  features: Array<{ title: string; description: string; icon?: string }>;
  socialProof?: { quote: string; author: string; role?: string }[];
  pricing?: Array<{
    name: string;
    price: string;
    interval: string;
    features: string[];
    highlighted?: boolean;
  }>;
  faq: Array<{ question: string; answer: string }>;
  cta: { title: string; subtitle: string; button: string };
};
