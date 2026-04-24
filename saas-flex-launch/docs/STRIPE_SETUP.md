# Stripe Setup Guide

Detailed walkthrough for creating products in Stripe **test** mode (dev), then switching to **live** mode for production.

---

## Phase 1 — Test mode (local dev)

### 1. Get your test keys

1. [dashboard.stripe.com](https://dashboard.stripe.com) → top-right toggle → ensure **Test mode** is ON
2. Developers → API keys:
   - Copy **Secret key** (`sk_test_...`) → `.env.local` → `STRIPE_SECRET_KEY`
   - Copy **Publishable key** (`pk_test_...`) → `.env.local` → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

### 2. Create products + prices

Run the idempotent setup script:

```bash
pnpm run setup:stripe
```

Output:
```
🔷 FLEX Launch Stripe setup — TEST mode
+ created product FLEX Launch — Pro (prod_...)
  + created price 19€/mois (price_...)
+ created product FLEX Launch — Agency (prod_...)
  + created price 49€/mois (price_...)

📋 Ajoute ces variables dans ton .env.local :
STRIPE_PRICE_PRO_MONTHLY=price_...
STRIPE_PRICE_AGENCY_MONTHLY=price_...
```

Copy those into `.env.local`.

### 3. Webhook forwarding (local dev)

Install the Stripe CLI:
```bash
brew install stripe/stripe-cli/stripe
stripe login
```

Forward webhooks to your local server:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

The CLI prints a `whsec_...` → copy → `.env.local` → `STRIPE_WEBHOOK_SECRET`.

Restart `pnpm run dev`.

### 4. Test the flow

- Run `pnpm run dev`
- Sign up → go to `/billing` → click "Passer Pro"
- Use test card: **4242 4242 4242 4242** · any future date · any CVC · any ZIP
- Verify:
  - Stripe dashboard shows a new test subscription
  - Your user's plan is updated to `pro` in the DB
  - You received a receipt email (Resend logs or inbox if DNS configured)

### 5. Enable Customer Portal (for self-serve cancel/update card)

1. Stripe dashboard → Settings → Billing → Customer portal
2. Turn ON "Cancel subscriptions"
3. Turn ON "Update card"
4. Turn ON "Update billing information"
5. Save

---

## Phase 2 — Going live

⚠️ **Do this only after thorough testing.**

### 1. Business setup

- Activate your Stripe account (identity verification, bank details, business info)
- Wait for activation (usually same day, up to 48h)

### 2. Get your live keys

Toggle to **Live mode** in Stripe dashboard and repeat step 1 from Phase 1 — but replace test env vars with live ones in Vercel:
- `STRIPE_SECRET_KEY` → `sk_live_...`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` → `pk_live_...`

### 3. Recreate products in live mode

Locally (with `STRIPE_SECRET_KEY=sk_live_...` in `.env.local`):
```bash
pnpm run setup:stripe
```

Update the printed `STRIPE_PRICE_*` in Vercel env variables.

### 4. Live webhook endpoint

1. Stripe dashboard (live mode) → Developers → Webhooks → Add endpoint
2. URL: `https://YOUR_DOMAIN/api/webhooks/stripe`
3. Events to send (must match):
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
4. Copy signing secret → Vercel env `STRIPE_WEBHOOK_SECRET`
5. Redeploy

### 5. Enable Customer Portal in live mode

Same as step 5 of Phase 1, but in live mode.

### 6. Tax / VAT (EU)

In Stripe Tax:
1. Settings → Tax → Activate Stripe Tax
2. Add your business address + VAT number
3. Configure tax registrations for countries where you sell
4. Prices in `PLANS` are TTC (tax-inclusive) by default — adjust if needed

### 7. Real card test

Once live, run **one real transaction** from your own card to verify end-to-end:
- Payment succeeds
- Webhook fires
- Plan updated in DB
- Receipt email received
- Refund yourself via dashboard to test the flow

---

## Troubleshooting

| Problem                                 | Fix                                                                      |
| --------------------------------------- | ------------------------------------------------------------------------ |
| Webhook 400 "Invalid signature"         | `STRIPE_WEBHOOK_SECRET` mismatch — copy again from Stripe dashboard      |
| Webhook 404                             | Wrong URL — must be `/api/webhooks/stripe` exact                         |
| Checkout loops back without sub         | Missing `line_items` price ID — verify `STRIPE_PRICE_*` env vars         |
| Customer portal "not configured"        | Enable in Settings → Billing → Customer portal                           |
| Plan not updating after checkout        | Webhook not arriving — check `stripe listen` is running (local)          |
| Test card declined                      | Use 4242 4242 4242 4242 (success), 4000 0000 0000 0002 (declined)        |
