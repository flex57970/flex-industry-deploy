import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { subscriptions } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { PLANS } from "@/lib/stripe/plans";
import { BillingActions } from "./billing-actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function BillingPage() {
  const user = await requireUser();
  const [sub] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, user.id))
    .orderBy(desc(subscriptions.createdAt))
    .limit(1);

  const currentPlan = PLANS[user.profile.plan];

  return (
    <div className="container max-w-4xl py-10">
      <h1 className="font-display text-3xl font-bold">Facturation</h1>
      <p className="mt-1 text-muted-foreground">Gère ton abonnement et tes factures.</p>

      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardDescription>Plan actuel</CardDescription>
              <CardTitle className="mt-1 text-3xl">{currentPlan.name}</CardTitle>
            </div>
            <Badge variant={user.profile.plan === "free" ? "secondary" : "gold"}>
              {user.profile.subscriptionStatus ?? "free"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {sub && (
            <div className="grid gap-4 border-t border-border pt-4 md:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">Période actuelle</p>
                <p className="text-sm">
                  {new Date(sub.currentPeriodStart).toLocaleDateString("fr-FR")} →{" "}
                  {new Date(sub.currentPeriodEnd).toLocaleDateString("fr-FR")}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Renouvellement</p>
                <p className="text-sm">
                  {sub.cancelAtPeriodEnd
                    ? "Annulé — accès jusqu'à la fin de la période"
                    : "Automatique"}
                </p>
              </div>
            </div>
          )}
          <BillingActions plan={user.profile.plan} hasCustomer={!!user.profile.stripeCustomerId} />
        </CardContent>
      </Card>

      {user.profile.plan !== "agency" && (
        <div className="mt-10">
          <h2 className="font-semibold">Upgrade</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {Object.values(PLANS)
              .filter((p) => p.id !== "free" && p.id !== user.profile.plan)
              .map((p) => (
                <Card key={p.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{p.name}</CardTitle>
                      <p className="font-display text-2xl">
                        {p.priceFormatted}
                        <span className="text-sm text-muted-foreground"> /mois</span>
                      </p>
                    </div>
                    <CardDescription>{p.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BillingActions upgradeTo={p.id as "pro" | "agency"} plan={user.profile.plan} hasCustomer={!!user.profile.stripeCustomerId} />
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
