# FLEX Launch ⚡

> AI-powered landing page generator for freelancers and agencies.

Describe your product → Get a complete landing page (hero, features, pricing, FAQ) in 60 seconds. Export HTML or publish to a flex-launch.com subdomain.

## Stack

Next.js 14 (App Router) · TypeScript strict · Tailwind + shadcn/ui · Supabase (auth + Postgres) · Drizzle ORM · Stripe · Resend · OpenAI · Inngest · Vitest + Playwright.

## Quick start (5 commands)

```bash
pnpm install
cp .env.example .env.local    # then fill in the values
pnpm run db:migrate
pnpm run setup:stripe          # creates Stripe products + prints STRIPE_PRICE_* for .env.local
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000).

For test users: `pnpm run db:seed` (prints credentials once).

## Scripts

| Command                   | What it does                                           |
| ------------------------- | ------------------------------------------------------ |
| `pnpm run dev`            | Start Next.js dev server                               |
| `pnpm run build`          | Production build                                       |
| `pnpm run typecheck`      | `tsc --noEmit`                                         |
| `pnpm run lint`           | Next.js lint                                           |
| `pnpm run test`           | Vitest unit tests                                      |
| `pnpm run test:e2e`       | Playwright end-to-end tests                            |
| `pnpm run db:generate`    | Generate Drizzle SQL migration from schema changes     |
| `pnpm run db:migrate`     | Apply pending migrations                               |
| `pnpm run db:studio`      | Open Drizzle Studio (DB GUI)                           |
| `pnpm run db:seed`        | Seed admin/free/pro test users                         |
| `pnpm run setup:stripe`   | Create Stripe products + prices (TEST or LIVE)         |
| `pnpm run create:admin`   | Upgrade a user to agency plan (step 2: add to `ADMIN_EMAILS`) |

## Structure

```
src/
├── app/               # Next.js App Router
│   ├── (auth)/        # login / signup / forgot-password / reset-password
│   ├── (app)/         # dashboard / projects / billing / settings  (protected)
│   ├── (marketing)/   # pricing / terms / privacy / refund
│   ├── admin/         # admin console (email-whitelisted)
│   ├── preview/[slug] # public published landing page
│   └── api/           # route handlers
├── components/        # ui/ (shadcn primitives), marketing/, app/, project/
├── lib/
│   ├── ai/            # OpenAI client + generate-page
│   ├── auth/          # Supabase server/browser clients + session
│   ├── db/            # Drizzle schema + client
│   ├── email/         # Resend client + HTML templates
│   ├── exporter/      # Standalone HTML export
│   ├── inngest/       # Background jobs (emails)
│   ├── stripe/        # Stripe client + PLANS config
│   ├── validations/   # Zod schemas
│   ├── logger.ts      # pino structured logger
│   ├── quotas.ts      # Plan quota enforcement
│   ├── ratelimit.ts   # Upstash rate limiting
│   └── utils.ts
├── env.ts             # runtime env validation (zod)
└── middleware.ts      # auth redirect on protected paths
```

## Docs

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — DB schema, routes, flows, permissions
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) — step-by-step production deployment
- [docs/STRIPE_SETUP.md](docs/STRIPE_SETUP.md) — going live with Stripe
- [docs/HANDOFF.md](docs/HANDOFF.md) — what's done, what's next, your checklist

## License

Proprietary — FLEX Industry © 2026.
