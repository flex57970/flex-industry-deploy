"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { createSupabaseBrowserClient } from "@/lib/auth/supabase-browser";

export function SettingsForm({
  defaultEmail,
  defaultFullName,
}: {
  defaultEmail: string;
  defaultFullName: string;
}) {
  const [fullName, setFullName] = useState(defaultFullName);
  const [isPending, startTransition] = useTransition();

  const save = () => {
    startTransition(async () => {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        toast.error("Erreur", { description: body.error ?? "Échec de sauvegarde" });
        return;
      }
      toast.success("Profil mis à jour");
    });
  };

  const sendPasswordReset = async () => {
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.resetPasswordForEmail(defaultEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      toast.error("Erreur", { description: error.message });
      return;
    }
    toast.success("Email envoyé", { description: "Clique sur le lien pour changer ton mot de passe." });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" value={defaultEmail} disabled className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="fullName">Nom complet</Label>
        <Input
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="mt-1.5"
        />
      </div>
      <div className="flex gap-3">
        <Button onClick={save} variant="gold" disabled={isPending}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sauvegarder"}
        </Button>
        <Button onClick={sendPasswordReset} variant="outline">
          Changer le mot de passe
        </Button>
      </div>
    </div>
  );
}
