import { Sparkles, Zap, Globe, Palette, Lock, Code } from "lucide-react";

const FEATURES = [
  {
    icon: Sparkles,
    title: "IA de copywriting",
    description:
      "GPT-4o-mini génère hero, features, pricing et FAQ optimisés pour la conversion — dans le ton de ta marque.",
  },
  {
    icon: Zap,
    title: "60 secondes chrono",
    description:
      "Description → page complète prête à publier. Plus rapide que d'ouvrir Figma.",
  },
  {
    icon: Palette,
    title: "Design premium",
    description:
      "Palette FLEX, typographies éditoriales, animations soignées. Tes pages ont la gueule d'un site à 5k€.",
  },
  {
    icon: Globe,
    title: "Publication en 1 clic",
    description:
      "Sous-domaine gratuit flex-launch.com ou ton propre domaine sur Pro et Agency.",
  },
  {
    icon: Lock,
    title: "Données chez toi",
    description:
      "Export HTML / Next.js à tout moment. Pas de vendor lock-in. Ton code, tes règles.",
  },
  {
    icon: Code,
    title: "API & white-label",
    description:
      "Plan Agency : génère des pages pour tes clients via API, retire le branding FLEX.",
  },
];

export function Features() {
  return (
    <section id="features" className="border-b border-border py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            Tout ce qu'il faut pour <span className="flex-text-gradient">vendre</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Une stack pensée pour les freelances, créateurs et agences qui veulent livrer vite et
            bien.
          </p>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-flex-gold/40"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-flex-gold/10 text-flex-gold">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
