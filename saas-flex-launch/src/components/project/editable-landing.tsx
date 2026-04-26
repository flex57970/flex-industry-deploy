"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Edit3, Eye, Loader2, Quote, RefreshCw } from "lucide-react";
import type { LandingContent } from "@/lib/db/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { EditableText } from "./editable-text";

type Section = "hero" | "features" | "socialProof" | "pricing" | "faq" | "cta";

export function EditableLanding({
  projectId,
  initialContent,
}: {
  projectId: string;
  initialContent: LandingContent;
}) {
  const router = useRouter();
  const [content, setContent] = useState<LandingContent>(initialContent);
  const [editMode, setEditMode] = useState(false);
  const [savingPath, setSavingPath] = useState<string | null>(null);
  const [regenerating, setRegenerating] = useState<Section | null>(null);
  const [, startTransition] = useTransition();

  // Persist a partial content update via PATCH /api/projects/[id]
  const saveContent = async (next: LandingContent, path: string) => {
    setSavingPath(path);
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: next }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        toast.error("Erreur de sauvegarde", { description: body.error ?? "Réessaie." });
        return;
      }
    } finally {
      setSavingPath(null);
    }
  };

  const updateAndSave = (mutator: (c: LandingContent) => LandingContent, path: string) => {
    const next = mutator(content);
    setContent(next);
    saveContent(next, path);
  };

  const regenerateSection = async (section: Section) => {
    setRegenerating(section);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, section }),
      });
      const body = await res.json();
      if (!res.ok) {
        toast.error("Régénération échouée", { description: body.error });
        return;
      }
      setContent(body.content as LandingContent);
      toast.success(`Section "${section}" régénérée ✨`);
      startTransition(() => router.refresh());
    } finally {
      setRegenerating(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-30 flex items-center justify-between rounded-lg border border-border bg-card/80 p-3 backdrop-blur">
        <div className="flex items-center gap-3 text-sm">
          <Badge variant={editMode ? "gold" : "secondary"}>
            {editMode ? "Mode édition" : "Aperçu"}
          </Badge>
          {savingPath && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" /> Sauvegarde...
            </span>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? <Eye className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
          {editMode ? "Aperçu" : "Éditer"}
        </Button>
      </div>

      {/* HERO */}
      <SectionWrapper
        label="Hero"
        editMode={editMode}
        onRegenerate={() => regenerateSection("hero")}
        regenerating={regenerating === "hero"}
      >
        <section className="rounded-2xl border border-flex-gold/30 bg-gradient-to-b from-flex-gold/5 to-transparent p-12 text-center">
          {(editMode || content.hero.eyebrow) && (
            <div className="mb-4">
              <Badge variant="gold">
                <EditableText
                  editable={editMode}
                  value={content.hero.eyebrow ?? ""}
                  placeholder="Eyebrow (optionnel)"
                  onChange={(v) =>
                    updateAndSave(
                      (c) => ({ ...c, hero: { ...c.hero, eyebrow: v || undefined } }),
                      "hero.eyebrow",
                    )
                  }
                />
              </Badge>
            </div>
          )}
          <h2 className="font-display text-4xl font-bold leading-tight md:text-6xl">
            <EditableText
              editable={editMode}
              value={content.hero.title}
              onChange={(v) =>
                updateAndSave((c) => ({ ...c, hero: { ...c.hero, title: v } }), "hero.title")
              }
            />
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            <EditableText
              editable={editMode}
              multiline
              value={content.hero.subtitle}
              onChange={(v) =>
                updateAndSave(
                  (c) => ({ ...c, hero: { ...c.hero, subtitle: v } }),
                  "hero.subtitle",
                )
              }
            />
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <span className="inline-flex items-center rounded-md bg-flex-gold px-4 py-2 text-sm font-semibold text-flex-black">
              <EditableText
                editable={editMode}
                value={content.hero.ctaPrimary}
                onChange={(v) =>
                  updateAndSave(
                    (c) => ({ ...c, hero: { ...c.hero, ctaPrimary: v } }),
                    "hero.ctaPrimary",
                  )
                }
              />
            </span>
            {(editMode || content.hero.ctaSecondary) && (
              <span className="inline-flex items-center rounded-md border border-border px-4 py-2 text-sm">
                <EditableText
                  editable={editMode}
                  value={content.hero.ctaSecondary ?? ""}
                  placeholder="CTA secondaire"
                  onChange={(v) =>
                    updateAndSave(
                      (c) => ({ ...c, hero: { ...c.hero, ctaSecondary: v || undefined } }),
                      "hero.ctaSecondary",
                    )
                  }
                />
              </span>
            )}
          </div>
        </section>
      </SectionWrapper>

      {/* FEATURES */}
      <SectionWrapper
        label="Features"
        editMode={editMode}
        onRegenerate={() => regenerateSection("features")}
        regenerating={regenerating === "features"}
      >
        <section>
          <h3 className="font-display text-2xl font-bold">Features</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {content.features.map((f, idx) => (
              <Card key={idx}>
                <CardContent className="p-6">
                  <h4 className="font-semibold">
                    <EditableText
                      editable={editMode}
                      value={f.title}
                      onChange={(v) =>
                        updateAndSave(
                          (c) => ({
                            ...c,
                            features: c.features.map((it, i) =>
                              i === idx ? { ...it, title: v } : it,
                            ),
                          }),
                          `features.${idx}.title`,
                        )
                      }
                    />
                  </h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    <EditableText
                      editable={editMode}
                      multiline
                      value={f.description}
                      onChange={(v) =>
                        updateAndSave(
                          (c) => ({
                            ...c,
                            features: c.features.map((it, i) =>
                              i === idx ? { ...it, description: v } : it,
                            ),
                          }),
                          `features.${idx}.description`,
                        )
                      }
                    />
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </SectionWrapper>

      {/* SOCIAL PROOF */}
      {content.socialProof && content.socialProof.length > 0 && (
        <SectionWrapper
          label="Témoignages"
          editMode={editMode}
          onRegenerate={() => regenerateSection("socialProof")}
          regenerating={regenerating === "socialProof"}
        >
          <section>
            <h3 className="font-display text-2xl font-bold">Témoignages</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {content.socialProof.map((t, idx) => (
                <Card key={idx}>
                  <CardContent className="p-6">
                    <Quote className="h-5 w-5 text-flex-gold" />
                    <p className="mt-3 italic">
                      "
                      <EditableText
                        editable={editMode}
                        multiline
                        value={t.quote}
                        onChange={(v) =>
                          updateAndSave(
                            (c) => ({
                              ...c,
                              socialProof: c.socialProof?.map((it, i) =>
                                i === idx ? { ...it, quote: v } : it,
                              ),
                            }),
                            `socialProof.${idx}.quote`,
                          )
                        }
                      />
                      "
                    </p>
                    <p className="mt-3 text-sm font-semibold">
                      <EditableText
                        editable={editMode}
                        value={t.author}
                        onChange={(v) =>
                          updateAndSave(
                            (c) => ({
                              ...c,
                              socialProof: c.socialProof?.map((it, i) =>
                                i === idx ? { ...it, author: v } : it,
                              ),
                            }),
                            `socialProof.${idx}.author`,
                          )
                        }
                      />
                    </p>
                    {(editMode || t.role) && (
                      <p className="text-xs text-muted-foreground">
                        <EditableText
                          editable={editMode}
                          value={t.role ?? ""}
                          placeholder="Rôle / poste"
                          onChange={(v) =>
                            updateAndSave(
                              (c) => ({
                                ...c,
                                socialProof: c.socialProof?.map((it, i) =>
                                  i === idx ? { ...it, role: v || undefined } : it,
                                ),
                              }),
                              `socialProof.${idx}.role`,
                            )
                          }
                        />
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </SectionWrapper>
      )}

      {/* PRICING */}
      {content.pricing && content.pricing.length > 0 && (
        <SectionWrapper
          label="Pricing"
          editMode={editMode}
          onRegenerate={() => regenerateSection("pricing")}
          regenerating={regenerating === "pricing"}
        >
          <section>
            <h3 className="font-display text-2xl font-bold">Tarifs</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {content.pricing.map((p, idx) => (
                <Card key={idx} className={p.highlighted ? "border-flex-gold/60" : undefined}>
                  <CardContent className="p-6">
                    <h4 className="font-semibold">
                      <EditableText
                        editable={editMode}
                        value={p.name}
                        onChange={(v) =>
                          updateAndSave(
                            (c) => ({
                              ...c,
                              pricing: c.pricing?.map((it, i) =>
                                i === idx ? { ...it, name: v } : it,
                              ),
                            }),
                            `pricing.${idx}.name`,
                          )
                        }
                      />
                    </h4>
                    <div className="mt-2">
                      <span className="font-display text-3xl font-bold">
                        <EditableText
                          editable={editMode}
                          value={p.price}
                          onChange={(v) =>
                            updateAndSave(
                              (c) => ({
                                ...c,
                                pricing: c.pricing?.map((it, i) =>
                                  i === idx ? { ...it, price: v } : it,
                                ),
                              }),
                              `pricing.${idx}.price`,
                            )
                          }
                        />
                      </span>
                      <span className="text-sm text-muted-foreground"> / {p.interval}</span>
                    </div>
                    <ul className="mt-4 space-y-2">
                      {p.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2 text-sm">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-flex-gold" />
                          <span className="flex-1">
                            <EditableText
                              editable={editMode}
                              value={feat}
                              onChange={(v) =>
                                updateAndSave(
                                  (c) => ({
                                    ...c,
                                    pricing: c.pricing?.map((it, i) =>
                                      i === idx
                                        ? {
                                            ...it,
                                            features: it.features.map((ff, fi) =>
                                              fi === fIdx ? v : ff,
                                            ),
                                          }
                                        : it,
                                    ),
                                  }),
                                  `pricing.${idx}.features.${fIdx}`,
                                )
                              }
                            />
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </SectionWrapper>
      )}

      {/* FAQ */}
      <SectionWrapper
        label="FAQ"
        editMode={editMode}
        onRegenerate={() => regenerateSection("faq")}
        regenerating={regenerating === "faq"}
      >
        <section>
          <h3 className="font-display text-2xl font-bold">FAQ</h3>
          <div className="mt-4 space-y-2">
            {content.faq.map((item, idx) => (
              <div key={idx} className="rounded-lg border border-border bg-card p-4">
                <p className="text-sm font-semibold">
                  <EditableText
                    editable={editMode}
                    value={item.question}
                    onChange={(v) =>
                      updateAndSave(
                        (c) => ({
                          ...c,
                          faq: c.faq.map((it, i) => (i === idx ? { ...it, question: v } : it)),
                        }),
                        `faq.${idx}.question`,
                      )
                    }
                  />
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  <EditableText
                    editable={editMode}
                    multiline
                    value={item.answer}
                    onChange={(v) =>
                      updateAndSave(
                        (c) => ({
                          ...c,
                          faq: c.faq.map((it, i) => (i === idx ? { ...it, answer: v } : it)),
                        }),
                        `faq.${idx}.answer`,
                      )
                    }
                  />
                </p>
              </div>
            ))}
          </div>
        </section>
      </SectionWrapper>

      {/* CTA */}
      <SectionWrapper
        label="CTA final"
        editMode={editMode}
        onRegenerate={() => regenerateSection("cta")}
        regenerating={regenerating === "cta"}
      >
        <section className="rounded-2xl border border-flex-gold/30 bg-gradient-to-b from-flex-gold/5 to-transparent p-8 text-center">
          <h3 className="font-display text-2xl font-bold">
            <EditableText
              editable={editMode}
              value={content.cta.title}
              onChange={(v) =>
                updateAndSave((c) => ({ ...c, cta: { ...c.cta, title: v } }), "cta.title")
              }
            />
          </h3>
          <p className="mt-2 text-muted-foreground">
            <EditableText
              editable={editMode}
              multiline
              value={content.cta.subtitle}
              onChange={(v) =>
                updateAndSave((c) => ({ ...c, cta: { ...c.cta, subtitle: v } }), "cta.subtitle")
              }
            />
          </p>
          <div className="mt-4">
            <span className="inline-flex items-center rounded-md bg-flex-gold px-4 py-2 text-sm font-semibold text-flex-black">
              <EditableText
                editable={editMode}
                value={content.cta.button}
                onChange={(v) =>
                  updateAndSave((c) => ({ ...c, cta: { ...c.cta, button: v } }), "cta.button")
                }
              />
            </span>
          </div>
        </section>
      </SectionWrapper>
    </div>
  );
}

function SectionWrapper({
  label,
  editMode,
  onRegenerate,
  regenerating,
  children,
}: {
  label: string;
  editMode: boolean;
  onRegenerate: () => void;
  regenerating: boolean;
  children: React.ReactNode;
}) {
  if (!editMode) return <>{children}</>;
  return (
    <div className="relative rounded-xl border border-dashed border-border p-2">
      <div className="absolute -top-3 left-3 z-10 flex items-center gap-2 rounded-full border border-border bg-background px-2 py-0.5 text-xs">
        <span className="font-medium">{label}</span>
        <button
          type="button"
          onClick={onRegenerate}
          disabled={regenerating}
          className="flex items-center gap-1 text-flex-gold hover:underline disabled:opacity-50"
        >
          {regenerating ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" /> régénère...
            </>
          ) : (
            <>
              <RefreshCw className="h-3 w-3" /> régénérer
            </>
          )}
        </button>
      </div>
      {children}
    </div>
  );
}
