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

const LANGUAGES: Array<{ value: CreateProjectInput["language"]; label: string }> = [
  { value: "fr", label: "🇫🇷 Français" },
  { value: "en", label: "🇬🇧 English" },
  { value: "es", label: "🇪🇸 Español" },
  { value: "de", label: "🇩🇪 Deutsch" },
  { value: "it", label: "🇮🇹 Italiano" },
];

const PRICE_RANGES: Array<{ value: CreateProjectInput["priceRange"]; label: string }> = [
  { value: "free", label: "Gratuit / freemium" },
  { value: "low", label: "Low-cost (€5-29/mo)" },
  { value: "medium", label: "Mid-market (€29-99/mo)" },
  { value: "premium", label: "Premium (€99-299/mo)" },
  { value: "enterprise", label: "Enterprise (sur devis)" },
];

const CTA_GOALS: Array<{ value: CreateProjectInput["ctaGoal"]; label: string }> = [
  { value: "signup", label: "Créer un compte gratuit" },
  { value: "trial", label: "Démarrer un essai" },
  { value: "buy", label: "Acheter / s'abonner" },
  { value: "demo", label: "Réserver une démo" },
  { value: "contact", label: "Contacter les ventes" },
  { value: "waitlist", label: "Liste d'attente (pre-launch)" },
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
    defaultValues: {
      tone: "professional",
      language: "fr",
      priceRange: "medium",
      ctaGoal: "signup",
    },
  });

  const currentTone = watch("tone");
  const currentLanguage = watch("language");
  const currentPriceRange = watch("priceRange");
  const currentCtaGoal = watch("ctaGoal");

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
        toast.loading("Génération IA en cours (~30s)...", { id: "gen" });
        const genRes = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId: body.project.id }),
        });
        const genBody = await genRes.json();
        toast.dismiss("gen");
        if (!genRes.ok) {
          toast.error("Génération échouée", {
            description: genBody.error ?? "Réessaie depuis la page projet.",
          });
          router.push(`/projects/${body.project.id}`);
          return;
        }
        toast.success("Page générée ✨");
        router.push(`/projects/${body.project.id}`);
      } catch (err) {
        toast.dismiss("gen");
        toast.error("Erreur réseau", {
          description: err instanceof Error ? err.message : "Vérifie ta connexion.",
        });
      } finally {
        setGenerating(false);
      }
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* PRODUCT INFO */}
          <div>
            <Label htmlFor="name">Nom du produit *</Label>
            <Input
              id="name"
              placeholder="Ex: Acme CRM"
              {...register("name")}
              className="mt-1.5"
            />
            {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="description">Décris ton produit *</Label>
            <Textarea
              id="description"
              rows={5}
              placeholder="Ex: Un CRM moderne pour freelances. Synchronise tes contacts, gère ton pipeline, automatise les relances. Pour indépendants 25-45 ans qui en ont marre des outils complexes type Salesforce."
              {...register("description")}
              className="mt-1.5"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-destructive">{errors.description.message}</p>
            )}
            <p className="mt-1 text-xs text-muted-foreground">
              Plus tu es précis, meilleure sera la page. Mentionne le problème résolu, les bénéfices clés, et ce qui te différencie.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <Label htmlFor="industry">Secteur (optionnel)</Label>
              <Input
                id="industry"
                placeholder="Ex: SaaS B2B, e-commerce, fintech, formation..."
                {...register("industry")}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="audience">Cible (optionnel)</Label>
              <Input
                id="audience"
                placeholder="Ex: Freelances 25-45 ans, agences digitales..."
                {...register("audience")}
                className="mt-1.5"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="benefits">3 bénéfices clés (optionnel)</Label>
            <Textarea
              id="benefits"
              rows={3}
              placeholder="Ex: 1) Gain de temps de 5h/semaine. 2) Plus de clients perdus dans le suivi. 3) Setup en 5 minutes."
              {...register("benefits")}
              className="mt-1.5"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Liste les vrais "wins" — l'IA s'en servira pour les features et le hero.
            </p>
          </div>

          {/* LANGUAGE + TONE */}
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <Label>Langue de la page</Label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.value}
                    type="button"
                    onClick={() => setValue("language", l.value)}
                    className={`rounded-md border px-2 py-2 text-xs transition-colors ${
                      currentLanguage === l.value
                        ? "border-flex-gold bg-flex-gold/10 text-flex-gold"
                        : "border-border hover:border-flex-gold/40"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>Ton de la copy</Label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {TONES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setValue("tone", t.value)}
                    className={`rounded-md border px-2 py-2 text-xs transition-colors ${
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
          </div>

          {/* PRICE RANGE + CTA GOAL */}
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <Label>Gamme tarifaire</Label>
              <div className="mt-2 grid grid-cols-1 gap-2">
                {PRICE_RANGES.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setValue("priceRange", p.value)}
                    className={`rounded-md border px-3 py-2 text-left text-xs transition-colors ${
                      currentPriceRange === p.value
                        ? "border-flex-gold bg-flex-gold/10 text-flex-gold"
                        : "border-border hover:border-flex-gold/40"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>Objectif CTA principal</Label>
              <div className="mt-2 grid grid-cols-1 gap-2">
                {CTA_GOALS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setValue("ctaGoal", c.value)}
                    className={`rounded-md border px-3 py-2 text-left text-xs transition-colors ${
                      currentCtaGoal === c.value
                        ? "border-flex-gold bg-flex-gold/10 text-flex-gold"
                        : "border-border hover:border-flex-gold/40"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
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
