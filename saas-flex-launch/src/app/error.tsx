"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { logger } from "@/lib/logger";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    logger.error({ digest: error.digest, message: error.message }, "client error boundary");
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-3xl font-bold">Une erreur est survenue</h1>
      <p className="mt-2 text-muted-foreground">
        On est désolés. Essaie de recharger la page. Si ça persiste, écris-nous à{" "}
        <a href="mailto:contact@flex-industry.fr" className="text-flex-gold hover:underline">
          contact@flex-industry.fr
        </a>
        .
      </p>
      <div className="mt-8 flex gap-3">
        <Button variant="gold" onClick={reset}>Réessayer</Button>
        <Button asChild variant="outline">
          <a href="/">Accueil</a>
        </Button>
      </div>
      {error.digest && <p className="mt-6 text-xs text-muted-foreground">ref: {error.digest}</p>}
    </div>
  );
}
