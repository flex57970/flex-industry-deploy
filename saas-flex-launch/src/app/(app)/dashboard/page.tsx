import Link from "next/link";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { projects } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Plus, FolderOpen, Sparkles } from "lucide-react";
import { checkGenerationQuota, checkProjectQuota } from "@/lib/quotas";
import { getPlan } from "@/lib/stripe/plans";

export default async function DashboardPage() {
  const user = await requireUser();
  const [userProjects, genQuota, projQuota] = await Promise.all([
    db
      .select()
      .from(projects)
      .where(eq(projects.userId, user.id))
      .orderBy(desc(projects.updatedAt))
      .limit(5),
    checkGenerationQuota(user.id, user.profile.plan),
    checkProjectQuota(user.id, user.profile.plan),
  ]);
  const plan = getPlan(user.profile.plan);

  return (
    <div className="container py-10">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">
            Salut {user.profile.fullName ?? user.email.split("@")[0]} 👋
          </h1>
          <p className="mt-1 text-muted-foreground">Prêt à lancer une nouvelle landing ?</p>
        </div>
        <Button asChild variant="gold" size="lg">
          <Link href="/projects/new">
            <Plus className="h-4 w-4" /> Nouveau projet
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Plan actuel</CardDescription>
            <CardTitle className="text-2xl uppercase">{plan.name}</CardTitle>
          </CardHeader>
          <CardContent>
            {user.profile.plan === "free" ? (
              <Button asChild variant="gold" size="sm">
                <Link href="/billing">Upgrade →</Link>
              </Button>
            ) : (
              <p className="text-xs text-muted-foreground">Merci 💛</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Projets utilisés</CardDescription>
            <CardTitle className="text-2xl">
              {projQuota.current}
              <span className="text-base font-normal text-muted-foreground">
                {" "}
                / {projQuota.limit === Number.POSITIVE_INFINITY ? "∞" : projQuota.limit}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-1.5 w-full rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-flex-gold"
                style={{
                  width: `${Math.min(100, (projQuota.current / (projQuota.limit === Number.POSITIVE_INFINITY ? 1000 : projQuota.limit)) * 100)}%`,
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Générations ce mois</CardDescription>
            <CardTitle className="text-2xl">
              {genQuota.current}
              <span className="text-base font-normal text-muted-foreground"> / {genQuota.limit}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-1.5 w-full rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-flex-gold"
                style={{
                  width: `${Math.min(100, (genQuota.current / genQuota.limit) * 100)}%`,
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Projets récents</h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/projects">
              Tout voir <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        {userProjects.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
              <div className="rounded-full bg-flex-gold/10 p-4">
                <Sparkles className="h-6 w-6 text-flex-gold" />
              </div>
              <div>
                <p className="font-semibold">Aucun projet pour le moment.</p>
                <p className="text-sm text-muted-foreground">
                  Lance ta première landing en moins de 60 secondes.
                </p>
              </div>
              <Button asChild variant="gold">
                <Link href="/projects/new">
                  <Plus className="h-4 w-4" /> Créer mon premier projet
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {userProjects.map((p) => (
              <Link
                key={p.id}
                href={`/projects/${p.id}`}
                className="flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:border-flex-gold/40"
              >
                <div className="flex items-center gap-3">
                  <FolderOpen className="h-5 w-5 text-flex-gold" />
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Modifié {new Date(p.updatedAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
