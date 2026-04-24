"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validations/auth";
import { createSupabaseBrowserClient } from "@/lib/auth/supabase-browser";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({ resolver: zodResolver(resetPasswordSchema) });

  const onSubmit = (values: ResetPasswordInput) => {
    startTransition(async () => {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.updateUser({ password: values.password });
      if (error) {
        toast.error("Erreur", { description: error.message });
        return;
      }
      toast.success("Mot de passe mis à jour");
      router.push("/dashboard");
    });
  };

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl font-bold">Nouveau mot de passe</h1>
        <p className="mt-2 text-sm text-muted-foreground">Choisis un mot de passe robuste.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="password">Nouveau mot de passe</Label>
          <Input id="password" type="password" {...register("password")} className="mt-1.5" />
          {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>}
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirmer</Label>
          <Input id="confirmPassword" type="password" {...register("confirmPassword")} className="mt-1.5" />
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>
        <Button type="submit" variant="gold" size="lg" className="w-full" disabled={isPending}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Mettre à jour"}
        </Button>
      </form>
    </div>
  );
}
