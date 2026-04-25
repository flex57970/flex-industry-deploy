CREATE TYPE "public"."plan" AS ENUM('free', 'pro', 'agency');--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"full_name" text,
	"avatar_url" text,
	"stripe_customer_id" text,
	"plan" "plan" DEFAULT 'free' NOT NULL,
	"trial_ends_at" timestamp with time zone,
	"subscription_status" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"tone" text DEFAULT 'professional',
	"audience" text,
	"content" jsonb DEFAULT 'null'::jsonb,
	"published" boolean DEFAULT false NOT NULL,
	"custom_domain" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"stripe_customer_id" text NOT NULL,
	"stripe_price_id" text NOT NULL,
	"status" text NOT NULL,
	"current_period_start" timestamp with time zone NOT NULL,
	"current_period_end" timestamp with time zone NOT NULL,
	"cancel_at_period_end" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "usage_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"event" text NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usage_events" ADD CONSTRAINT "usage_events_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "profiles_stripe_customer_idx" ON "profiles" USING btree ("stripe_customer_id");--> statement-breakpoint
CREATE INDEX "projects_user_idx" ON "projects" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "subscriptions_user_idx" ON "subscriptions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "usage_events_user_idx" ON "usage_events" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "usage_events_event_idx" ON "usage_events" USING btree ("event");