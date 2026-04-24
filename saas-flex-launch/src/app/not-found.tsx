import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-6xl font-bold text-flex-gold">404</p>
      <h1 className="mt-4 font-display text-3xl font-bold">Page introuvable</h1>
      <p className="mt-2 text-muted-foreground">
        La page que tu cherches n'existe pas ou a été déplacée.
      </p>
      <Button asChild variant="gold" className="mt-8">
        <Link href="/">← Retour à l'accueil</Link>
      </Button>
    </div>
  );
}
