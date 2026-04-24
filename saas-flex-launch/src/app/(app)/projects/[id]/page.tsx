import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink, Globe, Sparkles } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { projects } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { RenderLanding } from "@/components/project/render-landing";
import { ProjectActions } from "@/components/project/project-actions";

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const user = await requireUser();
  const [project] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, params.id), eq(projects.userId, user.id)))
    .limit(1);

  if (!project) notFound();

  return (
    <div className="container py-10">
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/projects" className="hover:text-foreground">Projets</Link>
        <span>/</span>
        <span className="text-foreground">{project.name}</span>
      </div>

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl font-bold">{project.name}</h1>
            {project.published ? (
              <Badge variant="gold" className="gap-1">
                <Globe className="h-3 w-3" /> En ligne
              </Badge>
            ) : (
              <Badge variant="secondary">Brouillon</Badge>
            )}
          </div>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{project.description}</p>
          {project.published && (
            <Link
              href={`/preview/${project.slug}`}
              target="_blank"
              className="mt-2 inline-flex items-center gap-1 text-sm text-flex-gold hover:underline"
            >
              Voir en ligne <ExternalLink className="h-3 w-3" />
            </Link>
          )}
        </div>
        <ProjectActions project={project} plan={user.profile.plan} />
      </div>

      {!project.content ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <Sparkles className="h-10 w-10 text-flex-gold" />
            <div>
              <p className="font-semibold">Pas encore de contenu généré</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Lance une génération IA pour créer le contenu de cette landing page.
              </p>
            </div>
            <form action={`/api/generate`} method="POST">
              <input type="hidden" name="projectId" value={project.id} />
              <Button type="submit" variant="gold">
                <Sparkles className="h-4 w-4" /> Générer maintenant
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <RenderLanding content={project.content} />
      )}
    </div>
  );
}
