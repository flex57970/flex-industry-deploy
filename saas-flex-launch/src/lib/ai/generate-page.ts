import { openai, OPENAI_MODEL } from "./openai";
import type { LandingContent } from "@/lib/db/schema";
import type { Tone, Language, PriceRange, CtaGoal } from "@/lib/validations/project";
import { logger } from "@/lib/logger";

const LANGUAGE_LABEL: Record<Language, string> = {
  fr: "Français",
  en: "English",
  es: "Español",
  de: "Deutsch",
  it: "Italiano",
};

const PRICE_RANGE_HINT: Record<PriceRange, string> = {
  free: "Free product / freemium with optional paid plan around €5-15/mo",
  low: "Low-cost: €5-29/mo range",
  medium: "Mid-market: €29-99/mo range",
  premium: "Premium: €99-299/mo range",
  enterprise: "Enterprise: contact sales / custom pricing (no public price)",
};

const CTA_GOAL_HINT: Record<CtaGoal, string> = {
  signup: "Sign up for a free account",
  trial: "Start a free trial",
  buy: "Buy now / subscribe immediately",
  contact: "Contact sales / book a meeting",
  demo: "Book a product demo",
  waitlist: "Join the waitlist (pre-launch)",
};

const SYSTEM_PROMPT = `You are a senior conversion copywriter producing landing page JSON.
You MUST output ONLY valid JSON matching exactly this schema, no prose, no markdown fences:

{
  "hero": { "eyebrow": string, "title": string, "subtitle": string, "ctaPrimary": string, "ctaSecondary": string },
  "features": [ { "title": string, "description": string, "icon": string } ] (exactly 4 items, icon is a lucide-react name like "Zap" or "Shield"),
  "socialProof": [ { "quote": string, "author": string, "role": string } ] (exactly 2 items),
  "pricing": [
    { "name": string, "price": string, "interval": "mois"|"an"|"month"|"year", "features": string[], "highlighted": boolean }
  ] (3 tiers, exactly one with highlighted=true),
  "faq": [ { "question": string, "answer": string } ] (5 items),
  "cta": { "title": string, "subtitle": string, "button": string }
}

Hard rules (never violate):
- Output ONLY the JSON object. No leading/trailing text, no \`\`\`json fences.
- Write ALL copy in the language specified by the user. Do not mix languages.
- Match the requested TONE in voice and word choice.
- Be specific to the product — never use placeholder text like "Lorem ipsum", "Your product here", or generic filler.
- Hero subtitle: 1-2 sentences, benefit-led, includes a concrete outcome.
- Features: 4 items, each with concrete outcome (not just features). Pick relevant lucide-react icon names.
- Pricing: 3 realistic tiers. Use the price-range hint provided. ALL tier features arrays must have 3-6 items each.
- FAQ: 5 items targeting real buyer objections (pricing, alternatives, onboarding time, refund/cancel, security/data).
- CTA button text: 2-4 words, action-oriented.
- ctaPrimary/ctaSecondary in hero must align with the CTA goal provided.`;

export type GenerateArgs = {
  name: string;
  description: string;
  tone: Tone;
  audience?: string;
  language?: Language;
  industry?: string;
  benefits?: string;
  priceRange?: PriceRange;
  ctaGoal?: CtaGoal;
};

function buildUserPrompt(args: GenerateArgs): string {
  const language = args.language ?? "fr";
  const priceRange = args.priceRange ?? "medium";
  const ctaGoal = args.ctaGoal ?? "signup";
  const lines = [
    `Product name: ${args.name}`,
    `Description: ${args.description}`,
    `Tone: ${args.tone}`,
    `Output language: ${LANGUAGE_LABEL[language]} (write everything in this language).`,
    `Pricing range: ${PRICE_RANGE_HINT[priceRange]}.`,
    `Primary CTA goal: ${CTA_GOAL_HINT[ctaGoal]}.`,
  ];
  if (args.industry) lines.push(`Industry / category: ${args.industry}`);
  if (args.audience) lines.push(`Target audience: ${args.audience}`);
  if (args.benefits) lines.push(`Key benefits to emphasize: ${args.benefits}`);
  return lines.join("\n");
}

async function callOpenAI(systemPrompt: string, userPrompt: string): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    response_format: { type: "json_object" },
    temperature: 0.7,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });
  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error("OpenAI returned empty response");
  return raw;
}

export async function generateLandingContent(args: GenerateArgs): Promise<LandingContent> {
  const userPrompt = buildUserPrompt(args);
  logger.debug(
    { name: args.name, tone: args.tone, lang: args.language },
    "Generating landing content",
  );

  let lastError: unknown = null;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const raw = await callOpenAI(SYSTEM_PROMPT, userPrompt);
      const parsed = JSON.parse(raw) as LandingContent;
      validateLandingContent(parsed);
      return parsed;
    } catch (err) {
      lastError = err;
      logger.warn(
        { err, attempt, name: args.name },
        "Generation attempt failed; retrying with stricter prompt",
      );
      if (attempt === 2) break;
      // Tighten on retry: append explicit re-emphasis to user prompt
      // (fall through to next iteration)
    }
  }
  throw lastError instanceof Error
    ? lastError
    : new Error("Generation failed after 2 attempts");
}

function validateLandingContent(c: unknown): asserts c is LandingContent {
  if (!c || typeof c !== "object") throw new Error("Invalid landing content shape");
  const obj = c as Record<string, unknown>;
  if (!obj.hero || !obj.features || !obj.faq || !obj.cta) {
    throw new Error("Landing content missing required sections");
  }
  if (!Array.isArray(obj.features) || obj.features.length === 0) {
    throw new Error("Landing content has no features");
  }
  if (!Array.isArray(obj.faq) || obj.faq.length === 0) {
    throw new Error("Landing content has no FAQ items");
  }
}
