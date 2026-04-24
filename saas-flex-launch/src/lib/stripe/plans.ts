import type { Plan } from "@/lib/db/schema";

export type PlanConfig = {
  id: Plan;
  name: string;
  description: string;
  priceMonthly: number;
  priceFormatted: string;
  stripePriceEnv: "STRIPE_PRICE_PRO_MONTHLY" | "STRIPE_PRICE_AGENCY_MONTHLY" | null;
  features: string[];
  highlighted?: boolean;
  cta: string;
  limits: {
    projects: number;
    generationsPerMonth: number;
    customDomains: number;
    teamMembers: number;
    removeBranding: boolean;
    apiAccess: boolean;
  };
  trialDays: number;
};

export const PLANS: Record<Plan, PlanConfig> = {
  free: {
    id: "free",
    name: "Free",
    description: "Pour tester l'IA.",
    priceMonthly: 0,
    priceFormatted: "0€",
    stripePriceEnv: null,
    features: [
      "1 landing page",
      "3 générations IA / mois",
      "Sous-domaine flex-launch.com",
      "Export HTML",
    ],
    cta: "Commencer gratuitement",
    limits: {
      projects: 1,
      generationsPerMonth: 3,
      customDomains: 0,
      teamMembers: 1,
      removeBranding: false,
      apiAccess: false,
    },
    trialDays: 0,
  },
  pro: {
    id: "pro",
    name: "Pro",
    description: "Pour freelances et créateurs.",
    priceMonthly: 19,
    priceFormatted: "19€",
    stripePriceEnv: "STRIPE_PRICE_PRO_MONTHLY",
    features: [
      "10 landing pages",
      "100 générations IA / mois",
      "1 domaine personnalisé",
      "Analytics basique",
      "Support email",
    ],
    highlighted: true,
    cta: "Essayer 7 jours",
    limits: {
      projects: 10,
      generationsPerMonth: 100,
      customDomains: 1,
      teamMembers: 1,
      removeBranding: false,
      apiAccess: false,
    },
    trialDays: 7,
  },
  agency: {
    id: "agency",
    name: "Agency",
    description: "Pour agences et équipes.",
    priceMonthly: 49,
    priceFormatted: "49€",
    stripePriceEnv: "STRIPE_PRICE_AGENCY_MONTHLY",
    features: [
      "Landing pages illimitées",
      "1000 générations IA / mois",
      "Domaines illimités",
      "White-label (retrait branding)",
      "5 membres d'équipe",
      "Accès API",
      "Support prioritaire",
    ],
    cta: "Essayer 7 jours",
    limits: {
      projects: Number.POSITIVE_INFINITY,
      generationsPerMonth: 1000,
      customDomains: Number.POSITIVE_INFINITY,
      teamMembers: 5,
      removeBranding: true,
      apiAccess: true,
    },
    trialDays: 7,
  },
};

export function getPlan(plan: Plan): PlanConfig {
  return PLANS[plan];
}

export function getStripePriceId(plan: Plan): string | null {
  const config = PLANS[plan];
  if (!config.stripePriceEnv) return null;
  const priceId = process.env[config.stripePriceEnv];
  return priceId ?? null;
}

export function planFromPriceId(priceId: string): Plan | null {
  if (priceId === process.env.STRIPE_PRICE_PRO_MONTHLY) return "pro";
  if (priceId === process.env.STRIPE_PRICE_AGENCY_MONTHLY) return "agency";
  return null;
}
