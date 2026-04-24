"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { Card, CardContent } from "@/components/ui/card";
import { createProjectSchema, type CreateProjectInput } from "@/lib/validations/project";

const TONES: Array<{ value: CreateProjectInput["tone"]; label: string }> = [
  { value: "professional", label: "Professionnel" },
  { value: "playful", label: "Décalé" },
  { value: "bold", label: "Direct" },
  { value: "minimal", label: "Minimaliste" },
  { value: "luxury", label: "Luxe" },
  { value: "technical", label: "Technique" },
];

export function NewProjectForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [generating, setGenerating] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: { tone: "professional" },
  });

  const currentTone = watch("tone");

  const onSubmit = (values: CreateProjectInput) => {
    startTransition(async () => {
      setGenerating(true);
      try {
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        const body = await res.json();
        if (!res.ok) {
          toast.error("Erreur", { description: body.error ?? "Impossible de créer le projet." });
          return;
        }
        toast.loading("Génération IA en cours...", { id: "gen" });
        const genRes = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId: body.project.id }),
        });
        const genBody = await genRes.json();
        toast.dismiss("gen");
        if (!genRes.ok) {
          toast.error("Génération échouée", { description: genBody.error ?? "Réessaie." });
          router.push(`/projects/${body.project.id}`);
          return;
        }
        toast.success("Page générée ✨");
        router.push(`/projects/${body.project.id}`);
      } finally {
        setGenerating(false);
      }
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <Label htmlFor="name">Nom du projet</Label>
            <Input
              id="name"
              placeholder="Ex: Acme SaaS"
              {...register("name")}
              className="mt-1.5"
            />
            {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="description">Décris ton produit</Label>
            <Textarea
              id="description"
              rows={5}
              placeholder="Ex: Un SaaS d'automatisation de facturation pour freelances. On synchronise avec ton compte bancaire, génère les factures au bon moment, relance les clients automatiquement. Cible : freelances qui facturent 5k-50k€/mois et perdent des heures en admin."
              {...register("description")}
              className="mt-1.5"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-destructive">{errors.description.message}</p>
            )}
            <p className="mt-1 text-xs text-muted-foreground">
              Plus tu es précis, plus la page sera bonne. Mentionne cible, problème résolu, bénéfices.
            </p>
          </div>

          <div>
            <Label htmlFor="audience">Cible (optionnel)</Label>
            <Input
              id="audience"
              placeholder="Ex: Freelances 25-45 ans, SaaS creators, agences digitales"
              {...register("audience")}
              className="mt-1.5"
            />
          </div>

          <div>
            <Label>Ton</Label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {TONES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setValue("tone", t.value)}
                  className={`rounded-md border px-3 py-2 text-sm transition-colors ${
                    currentTone === t.value
                      ? "border-flex-gold bg-flex-gold/10 text-flex-gold"
                      : "border-border hover:border-flex-gold/40"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            variant="gold"
            size="lg"
            className="w-full"
            disabled={isPending || generating}
          >
            {isPending || generating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Génération en cours (≈ 30s)...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Générer ma landing page
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
