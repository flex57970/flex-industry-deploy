# FLEX Launch — Architecture

## 1. Overview

**FLEX Launch** is an AI-powered landing page generator SaaS targeting freelancers and agencies.

**Core loop**: User describes their product → OpenAI generates a complete landing page (hero, features, pricing, FAQ, CTA) → User exports HTML or publishes to a flex-launch.com subdomain.

## 2. Tech Stack

| Layer          | Technology                                 |
| -------------- | ------------------------------------------ |
| Framework      | Next.js 14 (App Router, RSC)               |
| Language       | TypeScript (strict mode, no `any`)         |
| Styling        | Tailwind CSS 3 + shadcn/ui                 |
| UI animations  | Framer Motion                              |
| Auth           | Supabase Auth (email + Google OAuth)       |
| Database       | Postgres (Supabase) + Drizzle ORM          |
| Validation     | Zod                                        |
| Forms          | React Hook Form + @hookform/resolvers      |
| Payments       | Stripe (Checkout + Customer Portal)        |
| Emails         | Resend + React Email                       |
| AI             | OpenAI (GPT-4o-mini for generation)        |
| Background     | Inngest (webhooks, emails, scheduled jobs) |
| Rate limiting  | Upstash Redis                              |
| Observability  | pino (logs), Sentry (errors), PostHog      |
| Testing        | Vitest (unit), Playwright (e2e)            |
| Hosting        | Vercel (Edge + Serverless)                 |
| DNS            | Cloudflare                                 |

## 3. Database Schema

### `users`

Managed by Supabase Auth (auth.users), extended via `profiles`.

### `profiles`

| Column              | Type        | Notes                                          |
| ------------------- | ----------- | ---------------------------------------------- |
| id                  | uuid (PK)   | References auth.users(id)                      |
| email               | text        | Unique, not null                               |
| full_name           | text        | Nullable                                       |
| avatar_url          | text        | Nullable                                       |
| stripe_customer_id  | text        | Nullable, indexed                              |
| plan                | enum        | 'free' \| 'pro' \| 'agency' (default 'free')   |
| trial_ends_at       | timestamptz | Nullable                                       |
| subscription_status | text        | Nullable (from Stripe)                         |
| created_at          | timestamptz | default now()                                  |
| updated_at          | timestamptz | default now()                                  |

### `projects` (landing pages)

| Column      | Type        | Notes                                        |
| ----------- | ----------- | -------------------------------------------- |
| id          | uuid (PK)   | default gen_random_uuid()                    |
| user_id     | uuid (FK)   | References profiles(id), indexed             |
| slug        | text        | Unique global (subdomain slug)               |
| name        | text        | Project display name                         |
| description | text        | User input for AI                            |
| content     | jsonb       | Generated landing content (hero, features..) |
| published   | boolean     | default false                                |
| custom_domain | text      | Nullable (Pro/Agency)                        |
| created_at  | timestamptz | default now()                                |
| updated_at  | timestamptz | default now()                                |

### `usage_events`

| Column    | Type        | Notes                                      |
| --------- | ----------- | ------------------------------------------ |
| id        | uuid (PK)   |                                            |
| user_id   | uuid (FK)   | Indexed                                    |
| event     | text        | 'page_generated' \| 'page_published' \| .. |
| metadata  | jsonb       |                                            |
| created_at | timestamptz | default now()                              |

### `subscriptions`

Cached from Stripe webhooks for fast plan lookups.

| Column                | Type        |
| --------------------- | ----------- |
| id                    | text (PK)   |
| user_id               | uuid (FK)   |
| stripe_customer_id    | text        |
| stripe_price_id       | text        |
| status                | text        |
| current_period_start  | timestamptz |
| current_period_end    | timestamptz |
| cancel_at_period_end  | boolean     |
| created_at            | timestamptz |

## 4. Routes

### Public (marketing)

- `/` — Landing page (hero, features, pricing, FAQ, CTA)
- `/pricing` — Pricing table (data from Stripe)
- `/terms`, `/privacy`, `/refund` — Legal

### Auth

- `/login`, `/signup`, `/forgot-password`, `/reset-password`
- Supabase OAuth callback: `/api/auth/callback`

### App (authenticated, `(app)` group)

- `/dashboard` — overview + quota + quick actions
- `/projects` — list of user's landing pages
- `/projects/new` — create + generate
- `/projects/[id]` — edit + preview + publish
- `/settings` — profile, password
- `/billing` — plan, invoices, Stripe portal link

### Admin (email whitelist)

- `/admin` — users, MRR, churn, manual actions

### API

- `POST /api/projects` — create project
- `GET /api/projects/[id]` — get project
- `PATCH /api/projects/[id]` — update
- `DELETE /api/projects/[id]` — delete
- `POST /api/generate` — AI generation (streamed)
- `POST /api/stripe/checkout` — create checkout session
- `POST /api/stripe/portal` — create customer portal session
- `POST /api/webhooks/stripe` — Stripe webhooks (signature verified)
- `POST /api/inngest` — Inngest event receiver
- `GET /api/health` — healthcheck

## 5. Critical Flows

### Signup → Onboarding → Paiement

1. User signs up (`/signup`) via email or Google → Supabase creates `auth.users`
2. Trigger creates `profiles` row with plan='free'
3. Welcome email sent via Inngest → Resend
4. Redirected to `/dashboard`
5. User clicks "Upgrade" → `/billing` → Stripe Checkout (with 7-day trial)
6. Stripe webhook `checkout.completed` → update profile.plan, trial_ends_at
7. Email receipt sent

### Generation flow

1. User in `/projects/new` fills form (name, description, tone, audience)
2. Client POSTs to `/api/generate` with streaming response
3. API verifies auth + quota (free=1 page, pro=10, agency=∞)
4. If quota OK → OpenAI streaming call
5. Result saved to `projects.content` jsonb
6. `usage_events` row inserted
7. Redirect to `/projects/[id]` editor

### Cancel flow

1. User → `/billing` → "Manage subscription" → Stripe Customer Portal
2. User cancels → Stripe webhook `customer.subscription.updated`
3. Webhook updates `subscriptions.cancel_at_period_end`
4. At period end → webhook `customer.subscription.deleted` → plan='free'
5. Confirmation email sent

## 6. Permissions matrix

| Action                  | Free        | Pro          | Agency         |
| ----------------------- | ----------- | ------------ | -------------- |
| Create landing page     | 1 total     | 10 active    | Unlimited      |
| AI generations / month  | 3           | 100          | 1000           |
| Publish to subdomain    | ✅          | ✅           | ✅             |
| Custom domain           | ❌          | ✅ (1)       | ✅ (unlimited) |
| Remove FLEX branding    | ❌          | ❌           | ✅             |
| Team members            | 1           | 1            | 5              |
| API access              | ❌          | ❌           | ✅             |
| Priority support        | ❌          | Email        | Email + chat   |

## 7. Environment Variables

See [.env.example](../.env.example) for the authoritative, documented list.

## 8. Security

- All API routes validate input via Zod
- Rate limiting on generation and auth endpoints (Upstash)
- Stripe webhook signature verification (required)
- Middleware enforces auth on `(app)` + `/admin` routes
- Admin route additionally checks email against `ADMIN_EMAILS`
- No secrets in client bundle — only `NEXT_PUBLIC_*` is exposed
- Security headers set in `next.config.mjs`
- CSRF: SameSite cookies + origin check on mutations

## 9. Observability

- `pino` structured logger (JSON in prod, pretty in dev)
- Sentry hooks are wired but disabled if `NEXT_PUBLIC_SENTRY_DSN` empty
- PostHog events: signup, page_generated, checkout_started, checkout_completed
