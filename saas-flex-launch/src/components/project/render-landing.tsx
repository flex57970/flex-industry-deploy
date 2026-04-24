import { Check, Quote } from "lucide-react";
import type { LandingContent } from "@/lib/db/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function RenderLanding({ content }: { content: LandingContent }) {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-flex-gold/30 bg-gradient-to-b from-flex-gold/5 to-transparent p-12 text-center">
        {content.hero.eyebrow && (
          <Badge variant="gold" className="mb-4">
            {content.hero.eyebrow}
          </Badge>
        )}
        <h2 className="font-display text-4xl font-bold leading-tight md:text-6xl">
          {content.hero.title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">{content.hero.subtitle}</p>
        <div className="mt-6 flex justify-center gap-3">
          <span className="inline-flex items-center rounded-md bg-flex-gold px-4 py-2 text-sm font-semibold text-flex-black">
            {content.hero.ctaPrimary}
          </span>
          {content.hero.ctaSecondary && (
            <span className="inline-flex items-center rounded-md border border-border px-4 py-2 text-sm">
              {content.hero.ctaSecondary}
            </span>
          )}
        </div>
      </section>

      <section>
        <h3 className="font-display text-2xl font-bold">Features</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {content.features.map((f) => (
            <Card key={f.title}>
              <CardContent className="p-6">
                <h4 className="font-semibold">{f.title}</h4>
                <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {content.socialProof && content.socialProof.length > 0 && (
        <section>
          <h3 className="font-display text-2xl font-bold">Témoignages</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {content.socialProof.map((t, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Quote className="h-5 w-5 text-flex-gold" />
                  <p className="mt-3 italic">"{t.quote}"</p>
                  <p className="mt-3 text-sm font-semibold">{t.author}</p>
                  {t.role && <p className="text-xs text-muted-foreground">{t.role}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {content.pricing && content.pricing.length > 0 && (
        <section>
          <h3 className="font-display text-2xl font-bold">Tarifs</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {content.pricing.map((p) => (
              <Card key={p.name} className={p.highlighted ? "border-flex-gold/60" : undefined}>
                <CardContent className="p-6">
                  <h4 className="font-semibold">{p.name}</h4>
                  <div className="mt-2">
                    <span className="font-display text-3xl font-bold">{p.price}</span>
                    <span className="text-sm text-muted-foreground"> / {p.interval}</span>
                  </div>
                  <ul className="mt-4 space-y-2">
                    {p.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-flex-gold" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      <section>
        <h3 className="font-display text-2xl font-bold">FAQ</h3>
        <div className="mt-4 space-y-2">
          {content.faq.map((item) => (
            <details key={item.question} className="rounded-lg border border-border bg-card p-4">
              <summary className="cursor-pointer text-sm font-semibold">{item.question}</summary>
              <p className="mt-2 text-sm text-muted-foreground">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-flex-gold/30 bg-gradient-to-b from-flex-gold/5 to-transparent p-8 text-center">
        <h3 className="font-display text-2xl font-bold">{content.cta.title}</h3>
        <p className="mt-2 text-muted-foreground">{content.cta.subtitle}</p>
        <div className="mt-4">
          <span className="inline-flex items-center rounded-md bg-flex-gold px-4 py-2 text-sm font-semibold text-flex-black">
            {content.cta.button}
          </span>
        </div>
      </section>
    </div>
  );
}
