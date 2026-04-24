import { requireUser } from "@/lib/auth/session";
import { NewProjectForm } from "./new-project-form";
import { checkProjectQuota } from "@/lib/quotas";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function NewProjectPage() {
  const user = await requireUser();
  const quota = await checkProjectQuota(user.id, user.profile.plan);

  if (!quota.allowed) {
    return (
      <div className="container max-w-xl py-16">
        <Card>
          <CardContent className="py-12 text-center">
            <h1 className="font-display text-2xl font-bold">Limite atteinte</h1>
            <p className="mt-2 text-muted-foreground">
              Tu as atteint la limite de {quota.limit} projet{quota.limit > 1 ? "s" : ""} de ton plan{" "}
              {user.profile.plan}.
            </p>
            <Button asChild variant="gold" className="mt-6">
              <Link href="/billing">Passer au plan supérieur</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold">Nouveau projet</h1>
        <p className="mt-1 text-muted-foreground">
          Décris ton produit. L'IA génère une landing page complète en quelques secondes.
        </p>
      </div>
      <NewProjectForm />
    </div>
  );
}
