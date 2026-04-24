import { openai, OPENAI_MODEL } from "./openai";
import type { LandingContent } from "@/lib/db/schema";
import type { Tone } from "@/lib/validations/project";
import { logger } from "@/lib/logger";

const SYSTEM_PROMPT = `You are a senior conversion copywriter producing landing page JSON for FLEX Launch.
You must output ONLY valid JSON matching exactly this schema, no prose, no markdown:

{
  "hero": { "eyebrow": string, "title": string, "subtitle": string, "ctaPrimary": string, "ctaSecondary": string },
  "features": [ { "title": string, "description": string, "icon": string } ] (exactly 4 items, icon is a lucide-react name like "Zap" or "Shield"),
  "socialProof": [ { "quote": string, "author": string, "role": string } ] (exactly 2 items),
  "pricing": [
    { "name": string, "price": string, "interval": "mois"|"an", "features": string[], "highlighted": boolean }
  ] (3 tiers: Starter/Pro/Team),
  "faq": [ { "question": string, "answer": string } ] (5 items),
  "cta": { "title": string, "subtitle": string, "button": string }
}

Rules:
- All copy in the same language as the input description (default: French).
- Be specific to the product. Avoid generic filler.
- Subtitle: 1-2 sentences, benefit-led.
- Features: concrete, outcome-focused, no jargon.
- Pricing: realistic numbers (€9-€99 range) unless user implies otherwise.
- FAQ: anticipate real buyer objections (pricing, refund, onboarding, alternatives, security).
- CTA: urgent but not cheesy.
- Never use placeholder text like "Lorem ipsum" or "Your product here".`;

export type GenerateArgs = {
  name: string;
  description: string;
  tone: Tone;
  audience?: string;
};

export async function generateLandingContent(args: GenerateArgs): Promise<LandingContent> {
  const userPrompt = `Product name: ${args.name}
Description: ${args.description}
Tone: ${args.tone}
${args.audience ? `Target audience: ${args.audience}` : ""}`;

  logger.debug({ name: args.name, tone: args.tone }, "Generating landing content");

  const completion = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    response_format: { type: "json_object" },
    temperature: 0.7,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error("OpenAI returned empty response");

  const parsed = JSON.parse(raw) as LandingContent;
  validateLandingContent(parsed);
  return parsed;
}

function validateLandingContent(c: unknown): asserts c is LandingContent {
  if (!c || typeof c !== "object") throw new Error("Invalid landing content shape");
  const obj = c as Record<string, unknown>;
  if (!obj.hero || !obj.features || !obj.faq || !obj.cta) {
    throw new Error("Landing content missing required sections");
  }
}
