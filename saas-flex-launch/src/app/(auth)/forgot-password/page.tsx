"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validations/auth";
import { createSupabaseBrowserClient } from "@/lib/auth/supabase-browser";

export default function ForgotPasswordPage() {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = (values: ForgotPasswordInput) => {
    startTransition(async () => {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        toast.error("Erreur", { description: error.message });
        return;
      }
      toast.success("Email envoyé", {
        description: "Vérifie ta boîte mail pour réinitialiser ton mot de passe.",
      });
    });
  };

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl font-bold">Mot de passe oublié ?</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          On t'envoie un lien de réinitialisation par email.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="toi@exemple.com" {...register("email")} className="mt-1.5" />
          {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
        </div>
        <Button type="submit" variant="gold" size="lg" className="w-full" disabled={isPending}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Envoyer le lien"}
        </Button>
      </form>
      <p className="mt-8 text-center text-sm text-muted-foreground">
        <Link href="/login" className="hover:text-foreground">← Retour à la connexion</Link>
      </p>
    </div>
  );
}
