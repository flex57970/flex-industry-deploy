import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PLANS } from "@/lib/stripe/plans";
import { cn } from "@/lib/utils";

export function PricingTable({ compact = false }: { compact?: boolean }) {
  const plans = [PLANS.free, PLANS.pro, PLANS.agency];
  return (
    <section id="pricing" className={cn("border-b border-border", compact ? "py-16" : "py-24")}>
      <div className="container">
        {!compact && (
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
              Tarifs <span className="flex-text-gradient">simples</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Commence gratuitement. Passe au plan payant quand tu en as besoin. Annule en 1 clic.
            </p>
          </div>
        )}
        <div className={cn("mx-auto mt-12 grid max-w-5xl gap-6", "md:grid-cols-3")}>
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "relative flex flex-col rounded-2xl border p-8",
                plan.highlighted
                  ? "border-flex-gold/60 bg-gradient-to-b from-flex-gold/5 to-transparent shadow-[0_0_48px_rgba(212,175,55,0.08)]"
                  : "border-border bg-card",
              )}
            >
              {plan.highlighted && (
                <Badge variant="gold" className="absolute -top-3 left-6">
                  Plus populaire
                </Badge>
              )}
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
              <div className="mt-6">
                <span className="font-display text-5xl font-bold tracking-tight">
                  {plan.priceFormatted}
                </span>
                {plan.priceMonthly > 0 && (
                  <span className="text-sm text-muted-foreground"> / mois</span>
                )}
              </div>
              {plan.trialDays > 0 && (
                <p className="mt-2 text-xs text-flex-gold">Essai {plan.trialDays} jours offert</p>
              )}
              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-flex-gold" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex-1" />
              <Button
                asChild
                variant={plan.highlighted ? "gold" : "outline"}
                size="lg"
                className="mt-2"
              >
                <Link href={plan.id === "free" ? "/signup" : `/signup?plan=${plan.id}`}>
                  {plan.cta}
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
