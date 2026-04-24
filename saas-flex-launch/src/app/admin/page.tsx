import { requireAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { profiles, projects, subscriptions } from "@/lib/db/schema";
import { count, desc, eq, gte, sql } from "drizzle-orm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { PLANS } from "@/lib/stripe/plans";

export default async function AdminPage() {
  await requireAdmin();

  const last30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [
    usersRows,
    proRows,
    agencyRows,
    totalProjectsRows,
    recentSignupsRows,
    latestUsers,
    activeSubs,
  ] = await Promise.all([
    db.select({ c: count() }).from(profiles),
    db.select({ c: count() }).from(profiles).where(eq(profiles.plan, "pro")),
    db.select({ c: count() }).from(profiles).where(eq(profiles.plan, "agency")),
    db.select({ c: count() }).from(projects),
    db.select({ c: count() }).from(profiles).where(gte(profiles.createdAt, last30)),
    db.select().from(profiles).orderBy(desc(profiles.createdAt)).limit(20),
    db
      .select({
        status: subscriptions.status,
        count: sql<number>`count(*)`,
      })
      .from(subscriptions)
      .groupBy(subscriptions.status),
  ]);

  const users = usersRows[0]?.c ?? 0;
  const proUsers = proRows[0]?.c ?? 0;
  const agencyUsers = agencyRows[0]?.c ?? 0;
  const totalProjects = totalProjectsRows[0]?.c ?? 0;
  const recentSignups = recentSignupsRows[0]?.c ?? 0;
  const mrr = proUsers * PLANS.pro.priceMonthly + agencyUsers * PLANS.agency.priceMonthly;

  return (
    <div className="container py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Admin</h1>
          <p className="mt-1 text-muted-foreground">Vue d'ensemble · MRR & users</p>
        </div>
        <Badge variant="gold">ADMIN</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="MRR" value={formatCurrency(mrr)} accent />
        <StatCard label="Users" value={String(users)} />
        <StatCard label="Pro" value={String(proUsers)} />
        <StatCard label="Agency" value={String(agencyUsers)} />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <StatCard label="Signups (30j)" value={String(recentSignups)} />
        <StatCard label="Projets total" value={String(totalProjects)} />
        <StatCard
          label="Subs actives"
          value={String(activeSubs.find((s) => s.status === "active")?.count ?? 0)}
        />
      </div>

      <div className="mt-10">
        <h2 className="mb-4 text-lg font-semibold">Derniers inscrits</h2>
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="border-b border-border text-left">
                <tr>
                  <th className="p-4 font-semibold">Email</th>
                  <th className="p-4 font-semibold">Plan</th>
                  <th className="p-4 font-semibold">Inscrit le</th>
                </tr>
              </thead>
              <tbody>
                {latestUsers.map((u) => (
                  <tr key={u.id} className="border-b border-border/60">
                    <td className="p-4">{u.email}</td>
                    <td className="p-4">
                      <Badge variant={u.plan === "free" ? "secondary" : "gold"}>{u.plan}</Badge>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {new Date(u.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <Card className={accent ? "border-flex-gold/40" : undefined}>
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
      </CardHeader>
      <CardContent>
        <CardTitle className={`text-3xl ${accent ? "text-flex-gold" : ""}`}>{value}</CardTitle>
      </CardContent>
    </Card>
  );
}
