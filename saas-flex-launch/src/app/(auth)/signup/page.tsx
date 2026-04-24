import Link from "next/link";
import type { Metadata } from "next";
import { SignupForm } from "./signup-form";

export const metadata: Metadata = { title: "Créer un compte" };

export default function SignupPage() {
  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl font-bold">Crée ton compte</h1>
        <p className="mt-2 text-sm text-muted-foreground">Gratuit. Sans carte bancaire.</p>
      </div>
      <SignupForm />
      <p className="mt-8 text-center text-sm text-muted-foreground">
        Déjà un compte ?{" "}
        <Link href="/login" className="font-medium text-flex-gold hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
