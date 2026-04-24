import { Suspense } from "react";
import Link from "next/link";
import { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Connexion" };
export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl font-bold">Bon retour 👋</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Connecte-toi pour accéder à tes landing pages.
        </p>
      </div>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
      <p className="mt-8 text-center text-sm text-muted-foreground">
        Pas encore de compte ?{" "}
        <Link href="/signup" className="font-medium text-flex-gold hover:underline">
          Créer un compte
        </Link>
      </p>
    </div>
  );
}
