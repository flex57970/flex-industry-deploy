import Link from "next/link";
import { Plus, ExternalLink, Globe } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { projects } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function ProjectsPage() {
  const user = await requireUser();
  const userProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.userId, user.id))
    .orderBy(desc(projects.updatedAt));

  return (
    <div className="container py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Mes projets</h1>
          <p className="mt-1 text-muted-foreground">
            {userProjects.length} projet{userProjects.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button asChild variant="gold">
          <Link href="/projects/new">
            <Plus className="h-4 w-4" /> Nouveau projet
          </Link>
        </Button>
      </div>

      {userProjects.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border py-24 text-center">
          <p className="text-muted-foreground">Tu n'as aucun projet pour le moment.</p>
          <Button asChild variant="gold" className="mt-4">
            <Link href="/projects/new">Créer mon premier projet</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {userProjects.map((p) => (
            <Link
              key={p.id}
              href={`/projects/${p.id}`}
              className="group rounded-lg border border-border bg-card p-5 transition-colors hover:border-flex-gold/40"
            >
              <div className="mb-3 flex items-start justify-between">
                <h3 className="font-semibold">{p.name}</h3>
                {p.published ? (
                  <Badge variant="gold" className="gap-1">
                    <Globe className="h-3 w-3" /> En ligne
                  </Badge>
                ) : (
                  <Badge variant="secondary">Brouillon</Badge>
                )}
              </div>
              <p className="line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span>Modifié {new Date(p.updatedAt).toLocaleDateString("fr-FR")}</span>
                <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
