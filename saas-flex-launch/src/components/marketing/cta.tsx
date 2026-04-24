import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FinalCTA() {
  return (
    <section className="py-24">
      <div className="container">
        <div className="relative overflow-hidden rounded-2xl border border-flex-gold/30 bg-gradient-to-br from-flex-gold/10 via-card to-card p-12 text-center md:p-16">
          <div className="absolute inset-0 flex-grid-bg opacity-30" aria-hidden />
          <div className="relative">
            <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
              Prêt à <span className="flex-text-gradient">lancer</span> ?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Crée ton compte gratuitement. Ta première landing est en ligne dans 5 min.
            </p>
            <div className="mt-8">
              <Button asChild variant="gold" size="xl">
                <Link href="/signup">Commencer maintenant →</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
