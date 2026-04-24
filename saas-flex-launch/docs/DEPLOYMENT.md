# Deployment Guide

Step-by-step guide to deploy FLEX Launch to production. **First deploy time: ~45 minutes.**

---

## 1. Prerequisites

- Node.js 20+ and `pnpm` installed locally
- A GitHub repository hosting this code
- A [Vercel](https://vercel.com) account (connected to GitHub)
- A [Supabase](https://supabase.com) account
- A [Stripe](https://stripe.com) account
- A [Resend](https://resend.com) account
- A [Upstash](https://upstash.com) account (optional, but recommended for rate limiting)
- An OpenAI API key
- A custom domain (optional but recommended)

---

## 2. Supabase setup (10 min)

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) → "New project"
2. Choose a region near your users (EU recommended for French users)
3. Save the database password somewhere safe
4. Once provisioned, go to **Settings → API**:
   - Copy `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - Copy `anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copy `service_role key` → `SUPABASE_SERVICE_ROLE_KEY` (**never expose client-side**)
5. Go to **Settings → Database → Connection string → URI** → copy → `DATABASE_URL`
6. Go to **Authentication → Providers**:
   - Enable **Email** (+ enable "Confirm email" in production)
   - Enable **Google** (configure OAuth credentials from Google Cloud Console)
7. **Authentication → URL Configuration**:
   - Site URL: `https://YOUR_DOMAIN`
   - Redirect URLs: `https://YOUR_DOMAIN/api/auth/callback`

Then run locally to apply the schema:

```bash
pnpm run db:migrate
```

---

## 3. Stripe setup (15 min)

See [STRIPE_SETUP.md](./STRIPE_SETUP.md) for the full walkthrough.

Short version (test mode first):

```bash
# 1. Set STRIPE_SECRET_KEY in .env.local (sk_test_...)
# 2. Run:
pnpm run setup:stripe
# 3. Copy the printed STRIPE_PRICE_* into .env.local
# 4. In Stripe dashboard → Developers → Webhooks → add endpoint:
#    URL: https://YOUR_DOMAIN/api/webhooks/stripe
#    Events:
#      - checkout.session.completed
#      - customer.subscription.created
#      - customer.subscription.updated
#      - customer.subscription.deleted
#      - invoice.paid
#      - invoice.payment_failed
#    Copy the signing secret → STRIPE_WEBHOOK_SECRET
```

---

## 4. Resend setup (15 min — DNS propagation)

1. [resend.com/domains](https://resend.com/domains) → "Add domain"
2. Add DNS records (SPF, DKIM, DMARC) to your DNS provider
3. Wait for verification (5-30 min)
4. Create an API key → `RESEND_API_KEY`
5. Set `RESEND_FROM_EMAIL=YourBrand <noreply@yourdomain.com>`

---

## 5. OpenAI setup (2 min)

1. [platform.openai.com/api-keys](https://platform.openai.com/api-keys) → "Create key"
2. Copy → `OPENAI_API_KEY`
3. Set usage limits in the dashboard (recommend $50/mo to start)

---

## 6. Upstash Redis (optional, 5 min)

1. [console.upstash.com](https://console.upstash.com) → "Create database" → Redis
2. Choose region near your Vercel deploy
3. Copy `REST URL` → `UPSTASH_REDIS_REST_URL`
4. Copy `REST TOKEN` → `UPSTASH_REDIS_REST_TOKEN`

If you skip this, rate limiting is disabled (not blocking for launch).

---

## 7. Vercel deploy (10 min)

1. [vercel.com/new](https://vercel.com/new) → Import your GitHub repo
2. **Root directory**: set to `saas-flex-launch` (since this SaaS lives in a subdirectory)
3. **Framework**: Next.js (auto-detected)
4. **Environment variables**: paste all from your `.env.local` — EXCEPT change:
   - `NEXT_PUBLIC_APP_URL` → your production URL
   - `NODE_ENV` → `production`
5. Click **Deploy**
6. Once deployed, add your custom domain in **Settings → Domains**

---

## 8. DNS (Cloudflare) — 10 min

1. Add your domain to Cloudflare
2. Change nameservers at your registrar
3. Add the CNAME / A record that Vercel shows you
4. SSL: full (strict)

---

## 9. Inngest (5 min)

Inngest works locally via its dev server. For production:

1. [inngest.com](https://inngest.com) → create an app
2. Copy `Event Key` → `INNGEST_EVENT_KEY`
3. Copy `Signing Key` → `INNGEST_SIGNING_KEY`
4. Register your Vercel URL: `https://YOUR_DOMAIN/api/inngest`

---

## 10. Post-deploy checklist

- [ ] Sign up with a real email → confirm via email → land on dashboard
- [ ] Create a project → check OpenAI generation completes
- [ ] Go to `/billing` → "Passer Pro" → pay with `4242 4242 4242 4242` (test card)
- [ ] Verify webhook received (Stripe dashboard → Webhooks → recent events)
- [ ] Verify your profile plan updated to `pro` in DB (Drizzle Studio or Supabase table editor)
- [ ] Cancel from `/billing` → Stripe portal → verify webhook updates status

---

## 11. Go Live with Stripe

Once everything works in test mode:

1. Toggle Stripe to **Live mode** in their dashboard
2. Replace `STRIPE_SECRET_KEY` with `sk_live_...` in Vercel env
3. Replace `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` with `pk_live_...`
4. Recreate products in live mode:
   ```bash
   # locally, with the live key
   pnpm run setup:stripe
   ```
5. Update `STRIPE_PRICE_PRO_MONTHLY` and `STRIPE_PRICE_AGENCY_MONTHLY` in Vercel
6. Create a **new** webhook endpoint in Stripe live mode → update `STRIPE_WEBHOOK_SECRET`
7. Redeploy

---

## Rollback

Vercel keeps the last 3 deployments. To rollback:

1. Vercel dashboard → your project → Deployments
2. Find the last known-good deployment → ⋯ → **Promote to Production**

For DB migration rollback: Supabase dashboard → Database → SQL Editor → run a compensating migration.
