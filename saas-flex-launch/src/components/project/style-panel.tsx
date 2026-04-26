"use client";

import { useState } from "react";
import { Loader2, Palette, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/toast";

const PRESETS: Array<{ name: string; primary: string; accent: string }> = [
  { name: "FLEX (or/noir)", primary: "#D4AF37", accent: "#0D0D0D" },
  { name: "Indigo", primary: "#6366F1", accent: "#1E1B4B" },
  { name: "Émeraude", primary: "#10B981", accent: "#064E3B" },
  { name: "Rose", primary: "#EC4899", accent: "#831843" },
  { name: "Orange", primary: "#F97316", accent: "#7C2D12" },
  { name: "Cyan", primary: "#06B6D4", accent: "#164E63" },
  { name: "Slate clean", primary: "#0F172A", accent: "#475569" },
  { name: "Crimson", primary: "#DC2626", accent: "#450A0A" },
];

export function StylePanel({
  projectId,
  initialPrimary,
  initialAccent,
  onChange,
}: {
  projectId: string;
  initialPrimary: string;
  initialAccent: string;
  onChange: (primary: string, accent: string) => void;
}) {
  const [primary, setPrimary] = useState(initialPrimary);
  const [accent, setAccent] = useState(initialAccent);
  const [saving, setSaving] = useState(false);

  const save = async (p: string, a: string) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ primaryColor: p, accentColor: a }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        toast.error("Sauvegarde échouée", { description: body.error });
      }
    } finally {
      setSaving(false);
    }
  };

  const apply = (p: string, a: string) => {
    setPrimary(p);
    setAccent(a);
    onChange(p, a);
    save(p, a);
  };

  const reset = () => apply("#D4AF37", "#0D0D0D");

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4 text-flex-gold" />
          <h4 className="text-sm font-semibold">Couleurs</h4>
          {saving && <Loader2 className="ml-auto h-3 w-3 animate-spin" />}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <label className="text-xs">
            <span className="block text-muted-foreground">Primaire (CTA)</span>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="color"
                value={primary}
                onChange={(e) => apply(e.target.value, accent)}
                className="h-8 w-8 cursor-pointer rounded border border-border bg-transparent"
              />
              <input
                type="text"
                value={primary}
                onChange={(e) => {
                  const v = e.target.value;
                  if (/^#[0-9a-fA-F]{0,6}$/.test(v)) setPrimary(v);
                }}
                onBlur={() => /^#[0-9a-fA-F]{6}$/.test(primary) && apply(primary, accent)}
                className="w-24 rounded border border-border bg-background px-2 py-1 font-mono text-xs"
              />
            </div>
          </label>
          <label className="text-xs">
            <span className="block text-muted-foreground">Accent (sections)</span>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="color"
                value={accent}
                onChange={(e) => apply(primary, e.target.value)}
                className="h-8 w-8 cursor-pointer rounded border border-border bg-transparent"
              />
              <input
                type="text"
                value={accent}
                onChange={(e) => {
                  const v = e.target.value;
                  if (/^#[0-9a-fA-F]{0,6}$/.test(v)) setAccent(v);
                }}
                onBlur={() => /^#[0-9a-fA-F]{6}$/.test(accent) && apply(primary, accent)}
                className="w-24 rounded border border-border bg-background px-2 py-1 font-mono text-xs"
              />
            </div>
          </label>
        </div>

        <div className="mt-4">
          <p className="text-xs text-muted-foreground">Presets</p>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => apply(p.primary, p.accent)}
                title={p.name}
                className={`flex h-9 items-center gap-1 rounded border border-border p-1 text-[10px] transition-colors hover:border-flex-gold/40 ${
                  primary === p.primary && accent === p.accent ? "border-flex-gold ring-1 ring-flex-gold/40" : ""
                }`}
              >
                <span
                  className="h-5 w-5 rounded shrink-0"
                  style={{ backgroundColor: p.primary }}
                />
                <span className="truncate">{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        <Button variant="ghost" size="sm" onClick={reset} className="mt-3 text-xs">
          <RotateCcw className="h-3 w-3" /> Reset FLEX
        </Button>
      </CardContent>
    </Card>
  );
}
