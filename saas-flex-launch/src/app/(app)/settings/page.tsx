import { requireUser } from "@/lib/auth/session";
import { SettingsForm } from "./settings-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SettingsPage() {
  const user = await requireUser();
  return (
    <div className="container max-w-2xl py-10">
      <h1 className="font-display text-3xl font-bold">Paramètres</h1>
      <p className="mt-1 text-muted-foreground">Gère ton profil et ta sécurité.</p>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Profil</CardTitle>
        </CardHeader>
        <CardContent>
          <SettingsForm
            defaultEmail={user.email}
            defaultFullName={user.profile.fullName ?? ""}
          />
        </CardContent>
      </Card>
    </div>
  );
}
