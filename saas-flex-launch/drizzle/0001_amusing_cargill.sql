ALTER TABLE "projects" ADD COLUMN "language" text DEFAULT 'fr';--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "industry" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "benefits" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "price_range" text DEFAULT 'medium';--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "cta_goal" text DEFAULT 'signup';