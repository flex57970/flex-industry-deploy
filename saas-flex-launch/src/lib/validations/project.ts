import { z } from "zod";

export const toneEnum = z.enum([
  "professional",
  "playful",
  "bold",
  "minimal",
  "luxury",
  "technical",
]);
export type Tone = z.infer<typeof toneEnum>;

export const languageEnum = z.enum(["fr", "en", "es", "de", "it"]);
export type Language = z.infer<typeof languageEnum>;

export const priceRangeEnum = z.enum(["free", "low", "medium", "premium", "enterprise"]);
export type PriceRange = z.infer<typeof priceRangeEnum>;

export const ctaGoalEnum = z.enum(["signup", "trial", "buy", "contact", "demo", "waitlist"]);
export type CtaGoal = z.infer<typeof ctaGoalEnum>;

export const createProjectSchema = z.object({
  name: z.string().trim().min(2, "2 caractères minimum").max(60, "60 caractères maximum"),
  description: z.string().trim().min(20, "Décris ton produit en 20 caractères minimum").max(1500),
  tone: toneEnum.default("professional"),
  audience: z.string().trim().max(120).optional().or(z.literal("")),
  language: languageEnum.default("fr"),
  industry: z.string().trim().max(60).optional().or(z.literal("")),
  benefits: z.string().trim().max(500).optional().or(z.literal("")),
  priceRange: priceRangeEnum.default("medium"),
  ctaGoal: ctaGoalEnum.default("signup"),
});

export const themeEnum = z.enum(["dark", "light", "auto"]);
export type Theme = z.infer<typeof themeEnum>;

const hexColorSchema = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/i, "Format attendu: #RRGGBB");

export const updateProjectSchema = z.object({
  name: z.string().trim().min(2).max(60).optional(),
  description: z.string().trim().min(20).max(1500).optional(),
  tone: toneEnum.optional(),
  audience: z.string().trim().max(120).optional(),
  content: z.unknown().optional(),
  published: z.boolean().optional(),
  primaryColor: hexColorSchema.optional(),
  accentColor: hexColorSchema.optional(),
  theme: themeEnum.optional(),
  customDomain: z
    .string()
    .trim()
    .regex(/^[a-z0-9][a-z0-9.-]{1,253}[a-z0-9]$/i, "Domaine invalide")
    .nullable()
    .optional(),
});

export const generateSchema = z.object({
  projectId: z.string().uuid(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
