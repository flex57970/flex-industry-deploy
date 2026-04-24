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

export const createProjectSchema = z.object({
  name: z.string().trim().min(2, "2 caractères minimum").max(60, "60 caractères maximum"),
  description: z.string().trim().min(20, "Décris ton produit en 20 caractères minimum").max(800),
  tone: toneEnum.default("professional"),
  audience: z.string().trim().min(2).max(120).optional(),
});

export const updateProjectSchema = z.object({
  name: z.string().trim().min(2).max(60).optional(),
  description: z.string().trim().min(20).max(800).optional(),
  tone: toneEnum.optional(),
  audience: z.string().trim().min(2).max(120).optional(),
  content: z.unknown().optional(),
  published: z.boolean().optional(),
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
