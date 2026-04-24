import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 flex-grid-bg opacity-60" aria-hidden />
      <div className="absolute left-1/2 top-0 h-[560px] w-[840px] -translate-x-1/2 rounded-full bg-flex-gold/10 blur-3xl" aria-hidden />
      <div className="container relative py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="gold" className="mb-6 inline-flex items-center gap-1.5">
            <Sparkles className="h-3 w-3" />
            Nouveau · IA intégrée
          </Badge>
          <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
            Ta landing page{" "}
            <span className="flex-text-gradient">premium</span>
            <br />
            en 60 secondes
          </h1>
          <p className="mt-6 text-lg text-muted-foreground md:text-xl">
            Décris ton produit. L'IA génère une landing complète — hero, features, pricing, FAQ.
            <br className="hidden md:inline" />
            Tu exportes, tu publies, tu vends.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild variant="gold" size="xl" className="group">
              <Link href="/signup">
                Commencer gratuitement
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="xl">
              <Link href="/pricing">Voir les tarifs</Link>
            </Button>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            Gratuit pour toujours · Carte bancaire non requise · 60 sec pour ta 1re page
          </p>
        </div>
      </div>
    </section>
  );
}
