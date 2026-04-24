"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Download, Globe, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import type { Project, Plan } from "@/lib/db/schema";

export function ProjectActions({ project, plan }: { project: Project; plan: Plan }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const regenerate = async () => {
    setBusy("regen");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: project.id }),
      });
      const body = await res.json();
      if (!res.ok) {
        toast.error("Erreur", { description: body.error });
        return;
      }
      toast.success("Landing regénérée ✨");
      startTransition(() => router.refresh());
    } finally {
      setBusy(null);
    }
  };

  const togglePublish = async () => {
    setBusy("publish");
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !project.published }),
      });
      if (!res.ok) {
        const body = await res.json();
        toast.error("Erreur", { description: body.error });
        return;
      }
      toast.success(project.published ? "Dépublié" : "Publié 🚀");
      startTransition(() => router.refresh());
    } finally {
      setBusy(null);
    }
  };

  const exportHtml = async () => {
    setBusy("export");
    try {
      const res = await fetch(`/api/projects/${project.id}/export`);
      if (!res.ok) {
        toast.error("Export échoué");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${project.slug}.html`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setBusy(null);
    }
  };

  const deleteProject = async () => {
    if (!confirm("Supprimer définitivement ce projet ?")) return;
    setBusy("delete");
    try {
      const res = await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
      if (!res.ok) {
        toast.error("Erreur");
        return;
      }
      toast.success("Projet supprimé");
      router.push("/projects");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {project.content && (
        <>
          <Button variant="outline" size="sm" onClick={regenerate} disabled={!!busy}>
            <RefreshCw className={`h-4 w-4 ${busy === "regen" ? "animate-spin" : ""}`} />
            Régénérer
          </Button>
          <Button variant="outline" size="sm" onClick={exportHtml} disabled={!!busy}>
            <Download className="h-4 w-4" />
            Export HTML
          </Button>
          <Button
            variant={project.published ? "outline" : "gold"}
            size="sm"
            onClick={togglePublish}
            disabled={!!busy}
          >
            <Globe className="h-4 w-4" />
            {project.published ? "Dépublier" : "Publier"}
          </Button>
        </>
      )}
      <Button variant="ghost" size="sm" onClick={deleteProject} disabled={!!busy}>
        <Trash2 className="h-4 w-4" />
      </Button>
      {plan === "free" && (
        <span className="text-xs text-muted-foreground">· Plan Pro requis pour domaine perso</span>
      )}
    </div>
  );
}
