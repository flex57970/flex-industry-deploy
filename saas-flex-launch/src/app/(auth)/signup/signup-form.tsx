"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { signupSchema, type SignupInput } from "@/lib/validations/auth";
import { createSupabaseBrowserClient } from "@/lib/auth/supabase-browser";

export function SignupForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [oauthLoading, setOauthLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({ resolver: zodResolver(signupSchema) });

  const onSubmit = (values: SignupInput) => {
    startTransition(async () => {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
          data: { full_name: values.fullName },
        },
      });
      if (error) {
        toast.error("Inscription impossible", { description: error.message });
        return;
      }
      toast.success("Compte créé ! Vérifie ta boîte mail pour confirmer.");
      router.push("/login?confirmed=pending");
    });
  };

  const signInWithGoogle = async () => {
    setOauthLoading(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/api/auth/callback` },
    });
    if (error) {
      setOauthLoading(false);
      toast.error("Google sign-up échoué", { description: error.message });
    }
  };

  return (
    <div className="space-y-4">
      <Button variant="outline" size="lg" className="w-full" onClick={signInWithGoogle} disabled={oauthLoading}>
        {oauthLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Continuer avec Google
      </Button>
      <div className="relative flex items-center">
        <div className="flex-1 border-t border-border" />
        <span className="px-3 text-xs uppercase text-muted-foreground">ou</span>
        <div className="flex-1 border-t border-border" />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="fullName">Nom complet</Label>
          <Input id="fullName" type="text" placeholder="Jane Dupont" {...register("fullName")} className="mt-1.5" />
          {errors.fullName && <p className="mt-1 text-xs text-destructive">{errors.fullName.message}</p>}
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="toi@exemple.com" {...register("email")} className="mt-1.5" />
          {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
        </div>
        <div>
          <Label htmlFor="password">Mot de passe</Label>
          <Input id="password" type="password" {...register("password")} className="mt-1.5" />
          {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>}
          <p className="mt-1 text-xs text-muted-foreground">8 car. min, 1 maj., 1 min., 1 chiffre</p>
        </div>
        <Button type="submit" variant="gold" size="lg" className="w-full" disabled={isPending}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Créer mon compte"}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          En t'inscrivant tu acceptes nos{" "}
          <a href="/terms" className="underline">CGU</a> et{" "}
          <a href="/privacy" className="underline">Confidentialité</a>.
        </p>
      </form>
    </div>
  );
}
