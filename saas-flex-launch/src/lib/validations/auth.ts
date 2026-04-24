import { z } from "zod";

export const emailSchema = z.string().trim().toLowerCase().email("Email invalide");

export const signupSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(8, "8 caractères minimum")
    .max(72, "72 caractères maximum")
    .regex(/[a-z]/, "Au moins une minuscule")
    .regex(/[A-Z]/, "Au moins une majuscule")
    .regex(/[0-9]/, "Au moins un chiffre"),
  fullName: z.string().min(1, "Nom requis").max(80).optional(),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Mot de passe requis"),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    password: signupSchema.shape.password,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
