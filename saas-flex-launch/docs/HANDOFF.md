# HANDOFF — FLEX Launch

**Status:** MVP code complete · Ready to install deps, connect services, and deploy.

---

## 1. Ce qui a été fait ✅

### Infrastructure
- ✅ Next.js 14 App Router + TypeScript **strict** (no `any`)
- ✅ Tailwind 3 + shadcn/ui (new-york) + thème FLEX (dark, or/noir/off-white)
- ✅ ESLint + Prettier + lint-staged + Husky (prêt)
- ✅ `src/env.ts` — validation Zod runtime de toutes les env vars

### Auth (Supabase)
- ✅ Email + mot de passe (signup/login/forgot/reset)
- ✅ Google OAuth (`/api/auth/callback`)
- ✅ Middleware Next.js : redirection automatique des routes protégées
- ✅ `requireUser` / `requireAdmin` helpers côté serveur

### Base de données
- ✅ Schéma Drizzle : `profiles`, `projects`, `usage_events`, `subscriptions`
- ✅ Migrations (`pnpm run db:migrate`), seed (`pnpm run db:seed`)
- ✅ Client Postgres pooled via `postgres.js`

### Feature principale (Core loop)
- ✅ Formulaire création projet avec nom / description / ton / cible
- ✅ Génération OpenAI GPT-4o-mini → JSON structuré (hero, features, pricing, FAQ, CTA, témoignages)
- ✅ Éditeur projet avec rendu React
- ✅ Régénération
- ✅ Publication toggle (slug unique public `/preview/[slug]`)
- ✅ Export HTML standalone (avec retrait branding pour Agency)
- ✅ Suppression projet

### Billing (Stripe)
- ✅ 3 plans (Free / Pro 19€ / Agency 49€) définis dans `src/lib/stripe/plans.ts`
- ✅ Script idempotent `setup:stripe` pour créer produits + prix
- ✅ Checkout session (avec trial 7j sur Pro/Agency)
- ✅ Customer Portal (self-serve cancel/update card)
- ✅ Webhooks signés : `checkout.completed`, `subscription.created/updated/deleted`, `invoice.paid/failed`
- ✅ Quotas temps-réel (projets + générations/mois) selon plan

### Emails (Resend)
- ✅ Templates HTML : welcome / reset password / receipt / trial ending / cancel confirmation
- ✅ Déclenchés via Inngest (`user/signed-up`, `subscription/created`, etc.)

### Background jobs (Inngest)
- ✅ Client + 4 functions (welcome, receipt, cancel, trial ending)
- ✅ Route `/api/inngest` avec signature

### Pages publiques
- ✅ Landing (`/`) — hero, features, pricing, FAQ, CTA, footer
- ✅ Pricing (`/pricing`)
- ✅ Légal : `/terms`, `/privacy`, `/refund` (templates à personnaliser)
- ✅ Preview page `/preview/[slug]` (pages publiées publiquement)

### App authentifiée
- ✅ Dashboard (`/dashboard`) avec quotas live
- ✅ Projets (`/projects`, `/projects/new`, `/projects/[id]`)
- ✅ Settings (`/settings`)
- ✅ Billing (`/billing`)

### Admin
- ✅ Route `/admin` whitelisted par `ADMIN_EMAILS`
- ✅ KPI : MRR, users, splits par plan, signups 30j
- ✅ Table derniers inscrits

### Sécurité
- ✅ Validation Zod sur **toutes** les routes API
- ✅ Signature webhook Stripe obligatoire
- ✅ Rate limiting Upstash (graceful no-op si non configuré)
- ✅ Headers sécurité (X-Frame-Options, CSP-lite, Permissions-Policy)
- ✅ Secrets jamais exposés côté client (seulement `NEXT_PUBLIC_*`)
- ✅ Logger pino avec redaction (authorization, cookies, secrets, passwords)

### SEO / perf
- ✅ `metadataBase` + OG/Twitter cards
- ✅ `sitemap.ts` + `robots.ts`
- ✅ OG image dynamique via `@vercel/og`
- ✅ Fonts Inter + Playfair via `next/font`

### Tests
- ✅ Vitest — 3 fichiers : plans, validations, utils
- ✅ Playwright — 2 specs : landing public + auth redirects

### CI/CD
- ✅ `.github/workflows/ci.yml` : lint + typecheck + test + build
- ✅ Variables env placeholder (avec `SKIP_ENV_VALIDATION=1`)

### Routes créées

**Publiques** : `/`, `/pricing`, `/terms`, `/privacy`, `/refund`, `/preview/[slug]`

**Auth** : `/login`, `/signup`, `/forgot-password`, `/reset-password`

**App (protégées)** : `/dashboard`, `/projects`, `/projects/new`, `/projects/[id]`, `/settings`, `/billing`

**Admin** : `/admin`

**API** :
- `GET/POST /api/projects` · `GET/PATCH/DELETE /api/projects/[id]` · `GET /api/projects/[id]/export`
- `POST /api/generate`
- `POST /api/stripe/checkout` · `POST /api/stripe/portal`
- `POST /api/webhooks/stripe`
- `GET/POST/PUT /api/inngest`
- `GET /api/auth/callback`
- `PATCH /api/profile`
- `GET /api/health`

### Tables DB
`profiles`, `projects`, `usage_events`, `subscriptions` + enum `plan`

### Emails configurés
`welcome`, `reset-password`, `receipt`, `trial-ending`, `cancel-confirmation`

### Couverture de test
Unit tests : plans (6 cas), validations auth + project (6 cas), utils (5 cas) = **17 cas** sur la logique critique.
E2E : landing + auth flow (7 cas).
La génération OpenAI n'est pas moquée en tests — à ajouter avec MSW si besoin.

---

## 2. Ce qu'il RESTE à faire côté code ⚠️

- [ ] **Emails React Email** (actuellement HTML inline) — à migrer si tu veux plus de flexibilité
- [ ] **Streaming OpenAI** (actuellement bloquant pendant ~30s) — côté serveur avec Server Actions ou SSE
- [ ] **Custom domain** pour plan Pro/Agency — logique DNS + certif SSL à ajouter (on envoie `customDomain` en DB mais la résolution prod n'est pas implémentée)
- [ ] **Analytics basique** (vues par landing) — table `page_views` + route tracking sur `/preview/[slug]`
- [ ] **API publique** pour plan Agency — endpoint `/api/v1/generate` avec API key
- [ ] **White-label** du preview (retirer "Made with FLEX Launch") — le flag est en place dans `exporter/html.ts`, à propager dans `RenderLanding` SSR
- [ ] **Invitations équipe** pour plan Agency (5 membres)
- [ ] **Stripe Tax** activation (EU VAT) — config dashboard
- [ ] **Sentry integration** réelle (actuellement juste un env var) — ajouter `@sentry/nextjs`
- [ ] **PostHog integration** réelle — ajouter `posthog-js` + events tracking
- [ ] **Trial ending** cron : scheduler Inngest quotidien qui détecte `trial_ends_at` dans 2 jours et envoie l'email

### Dette technique
- Le `createSupabaseServiceClient` utilise `require()` dans un fichier ESM pour éviter de charger le service client dans les RSC clients — à remplacer par un import dynamique propre quand on en aura besoin.
- `render-landing.tsx` duplique la logique HTML du standalone exporter — à DRY dans un module partagé si la logique diverge.

---

## 3. ⚡ CE QUE TU DOIS FAIRE TOI (checklist actionnable)

### Étape 0 — Install
- [ ] `cd saas-flex-launch` puis `pnpm install` *(3 min)*
- [ ] `cp .env.example .env.local` *(10 sec)*

### Étape 1 — Supabase *(10 min)*
- [ ] Créer compte sur [supabase.com](https://supabase.com) → New project (région EU)
- [ ] Settings → API → copier `URL`, `anon key`, `service_role key` → `.env.local`
- [ ] Settings → Database → Connection string (URI) → `.env.local` comme `DATABASE_URL`
- [ ] Authentication → Providers → activer Email + Google (OAuth credentials sur [console.cloud.google.com](https://console.cloud.google.com))
- [ ] `pnpm run db:migrate` pour créer les tables
- [ ] (Optionnel) `pnpm run db:seed` pour 3 users de test

### Étape 2 — Stripe *(15 min)*
- [ ] Créer compte [stripe.com](https://stripe.com) → passer en **mode test**
- [ ] Developers → API keys → copier `sk_test_...` et `pk_test_...` → `.env.local`
- [ ] `pnpm run setup:stripe` → coller les `STRIPE_PRICE_*` printés dans `.env.local`
- [ ] Installer Stripe CLI : `brew install stripe/stripe-cli/stripe && stripe login`
- [ ] Terminal 1 : `stripe listen --forward-to localhost:3000/api/webhooks/stripe` → copier le `whsec_` → `STRIPE_WEBHOOK_SECRET`
- [ ] Settings → Billing → Customer portal → Activate "Cancel subscriptions", "Update card"

### Étape 3 — OpenAI *(2 min)*
- [ ] [platform.openai.com/api-keys](https://platform.openai.com/api-keys) → Create key → `.env.local` → `OPENAI_API_KEY`
- [ ] Settings → Limits → set budget hard cap (ex: 50$/mois)

### Étape 4 — Resend *(15 min — DNS prop)*
- [ ] [resend.com](https://resend.com) → créer compte
- [ ] Domains → Add domain → ajouter SPF/DKIM/DMARC chez ton DNS provider
- [ ] Attendre vérification (5-30 min)
- [ ] API Keys → Create → copier → `.env.local` → `RESEND_API_KEY`
- [ ] `.env.local` → `RESEND_FROM_EMAIL=FLEX Launch <noreply@tondomaine.com>`

### Étape 5 — Upstash (optionnel mais reco) *(5 min)*
- [ ] [console.upstash.com](https://console.upstash.com) → Create Redis database (région EU)
- [ ] Copier REST URL + TOKEN → `.env.local`

### Étape 6 — Dev local *(2 min)*
- [ ] Terminal 1 : `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
- [ ] Terminal 2 : `pnpm run dev`
- [ ] Tester : signup → create project → AI génère → checkout avec `4242 4242 4242 4242`
- [ ] Vérifier dans Stripe test dashboard que le sub apparaît
- [ ] Vérifier dans Drizzle Studio (`pnpm run db:studio`) que `profile.plan = 'pro'`

### Étape 7 — Déploiement Vercel *(15 min)*
- [ ] `git add . && git commit && git push` sur GitHub
- [ ] [vercel.com/new](https://vercel.com/new) → import repo
- [ ] **Root directory : `saas-flex-launch`** (important : sous-dossier)
- [ ] Environment variables : copier TOUT ton `.env.local` (sauf `STRIPE_WEBHOOK_SECRET` — on le met après)
- [ ] Changer `NEXT_PUBLIC_APP_URL` → `https://tondomaine.com`
- [ ] Deploy

### Étape 8 — Domaine + DNS *(10 min)*
- [ ] Vercel → Settings → Domains → Add → tondomaine.com
- [ ] Cloudflare : ajouter CNAME que Vercel donne
- [ ] SSL "Full (strict)"

### Étape 9 — Webhook Stripe prod *(5 min)*
- [ ] Stripe dashboard (mode test d'abord) → Developers → Webhooks → Add endpoint
- [ ] URL : `https://tondomaine.com/api/webhooks/stripe`
- [ ] Events : `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.paid`, `invoice.payment_failed`
- [ ] Copier signing secret → Vercel env → `STRIPE_WEBHOOK_SECRET` → Redeploy

### Étape 10 — Inngest prod *(5 min)*
- [ ] [inngest.com](https://inngest.com) → créer app
- [ ] Settings → Keys → copier Event Key + Signing Key → Vercel env
- [ ] Register endpoint : `https://tondomaine.com/api/inngest`

### Étape 11 — Test prod *(10 min)*
- [ ] Signup réel avec email qui marche → cliquer lien email → land sur dashboard
- [ ] Créer projet → vérifier génération OpenAI
- [ ] /billing → Passer Pro avec `4242 4242 4242 4242`
- [ ] Vérifier webhook dans Stripe → event `checkout.session.completed` en succès
- [ ] Vérifier email reçu (Resend dashboard + boîte)
- [ ] Annuler depuis portal → vérifier plan repasse free à la fin de la période

### Étape 12 — Passage en live *(15 min)*
- [ ] Stripe → activer compte (identity + bank)
- [ ] Toggle en **Live mode**
- [ ] Remplacer `sk_test_` par `sk_live_`, `pk_test_` par `pk_live_` dans Vercel env
- [ ] Re-run `pnpm run setup:stripe` en local avec la clé live → update `STRIPE_PRICE_*` dans Vercel
- [ ] Créer webhook en **live mode** avec la même URL → update `STRIPE_WEBHOOK_SECRET`
- [ ] Redeploy

### Étape 13 — Personnalisation légale *(30 min)*
- [ ] `src/app/(marketing)/terms/page.tsx` — remplacer `[RAISON SOCIALE]`, `[SIRET]`, `[ADRESSE]`
- [ ] `src/app/(marketing)/privacy/page.tsx` — remplacer `[RAISON SOCIALE]`, `[SIRET]`, `[DIRIGEANT]`
- [ ] `src/app/(marketing)/refund/page.tsx` — relire et ajuster si besoin
- [ ] Déploiement mentions légales → Vercel redeploy

### Étape 14 — Admin *(2 min)*
- [ ] `pnpm run create:admin -- ton@email.com` *(après avoir signup)*
- [ ] Ajouter ton email dans `ADMIN_EMAILS` sur Vercel env → Redeploy
- [ ] Aller sur `/admin` pour vérifier l'accès

### Étape 15 — Branding *(2 min)*
- [ ] Remplacer `public/logo.svg` par ton vrai logo
- [ ] Remplacer `public/favicon.svg` par ton vrai favicon
- [ ] (Optionnel) Ajuster les couleurs dans `src/app/globals.css` si tu veux dévier de la palette FLEX

---

## 4. 🚀 Commandes de démarrage

```bash
cd saas-flex-launch
pnpm install
cp .env.example .env.local
# remplir les variables
pnpm run db:migrate
pnpm run setup:stripe
# coller les STRIPE_PRICE_* dans .env.local
pnpm run dev
```

Dans un autre terminal pour les webhooks :
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## 5. 🔐 Identifiants de test générés

**Pas de credentials hardcodés livrés** (sécurité). Après avoir lancé Supabase en local :

```bash
pnpm run db:seed
```

Ça affichera UNE SEULE FOIS dans le terminal :

```
admin@test.local       FLEX-xxx-Launch!    [plan=agency]
free@test.local        FLEX-xxx-Launch!    [plan=free]
pro@test.local         FLEX-xxx-Launch!    [plan=pro]
```

⚠️ **Sauvegarde-les immédiatement**, les mots de passe sont aléatoires et ne sont pas re-affichés.

---

## 6. 📊 Métriques & monitoring

- **MRR / users / splits** → `/admin` (whitelisted par `ADMIN_EMAILS`)
- **Usage events** → table `usage_events` (raw) + Drizzle Studio
- **Stripe events** → dashboard Stripe → Developers → Events / Webhooks
- **Resend emails** → [resend.com/emails](https://resend.com/emails)
- **Inngest jobs** → [app.inngest.com](https://app.inngest.com) (runs, retries, errors)
- **Vercel logs** → Vercel dashboard → Logs (realtime)
- **Sentry** → à activer en définissant `NEXT_PUBLIC_SENTRY_DSN` (stub prêt)
- **PostHog** → à activer en définissant `NEXT_PUBLIC_POSTHOG_KEY` (stub prêt)

---

## 7. 💰 Coûts mensuels estimés (MVP)

| Service      | Tier           | Coût fixe                   | Coût variable                    |
| ------------ | -------------- | --------------------------- | -------------------------------- |
| Vercel       | Hobby          | 0€                          | 0€ (limite 100 GB bandwidth)     |
| Supabase     | Free           | 0€                          | 0€ (limite 500 MB DB + 50k MAU)  |
| Stripe       | -              | 0€                          | 1,5% + 0,25€ par transac (EU)    |
| Resend       | Free           | 0€                          | 0€ (3 000 emails/mois)           |
| OpenAI       | -              | 0€                          | ~0,01€ par génération (gpt-4o-mini) |
| Upstash      | Free           | 0€                          | 0€ (10 000 commandes/jour)       |
| Inngest      | Free           | 0€                          | 0€ (50k events/mois)             |
| Domaine      | Cloudflare     | ~10€/an                     | -                                |
| **TOTAL MVP**| -              | **~1€/mois**                | **~15% de MRR** en infra         |

À 100 users (20 Pro + 5 Agency) → MRR ≈ 625€ → coûts ≈ 20€ → **marge ≈ 97%**.

---

## 8. 🆘 Troubleshooting

| Symptôme                                  | Cause probable                                                       | Fix                                                                             |
| ----------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Build Vercel échoue "Invalid env"         | Variables manquantes                                                 | Vercel → Settings → Environment Variables → vérifier toutes celles de `.env.example` |
| Webhook Stripe 400 "Invalid signature"    | `STRIPE_WEBHOOK_SECRET` ne correspond pas                            | Recopier depuis Stripe dashboard → redeploy                                      |
| Webhook 404                               | Mauvaise URL                                                         | URL doit être EXACTEMENT `/api/webhooks/stripe`                                  |
| Plan pas mis à jour après paiement        | Webhook n'arrive pas ou profil introuvable via `stripe_customer_id`   | Vérifier event dans Stripe + table `profiles` a bien `stripe_customer_id` rempli |
| Email non reçu                            | DNS Resend non propagé ou `RESEND_FROM_EMAIL` sur domaine non vérifié | [resend.com/domains](https://resend.com/domains) doit afficher "Verified"       |
| OpenAI "invalid_api_key"                  | Clé manquante / incorrecte                                           | Régénérer sur OpenAI → update Vercel env                                        |
| OpenAI "rate_limit_exceeded"              | Limite atteinte                                                      | Augmenter limite sur dashboard OpenAI ou attendre reset                         |
| `/admin` redirige vers `/dashboard`       | Email pas dans `ADMIN_EMAILS`                                        | Ajouter l'email (comma-separated) → redeploy                                    |
| Google OAuth "redirect_uri_mismatch"      | URL de callback pas enregistrée dans Google Cloud Console            | Ajouter `https://tondomaine.com/api/auth/callback` dans OAuth → Credentials     |
| Génération OpenAI renvoie JSON invalide   | Modèle part dans la nature                                           | Already handled : `response_format: json_object` + schema validation            |
| Database migration échoue                 | Permissions DB insuffisantes                                         | Utiliser `service_role` et non l'anon key pour les migrations                   |

**Contact support FLEX** : [contact@flex-industry.fr](mailto:contact@flex-industry.fr)

---

## 🎯 TL;DR

1. **Installer** : `pnpm install`
2. **Connecter** : Supabase + Stripe + Resend + OpenAI (45 min)
3. **Tester en local** : card 4242 → checkout → plan updated
4. **Déployer** : Vercel avec root=`saas-flex-launch` (15 min)
5. **Personnaliser** : CGU, logo, domaine (30 min)
6. **Passer live Stripe** : sk_live_... (15 min)
7. **Premier encaissement** 🚀

Total : **~2h30** de travail manuel entre l'install et la première vente.
