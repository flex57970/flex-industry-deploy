import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="text-lg font-bold">
              <span className="text-foreground">FLEX</span>{" "}
              <span className="flex-text-gradient">Launch</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Génère des landing pages premium en 60 secondes.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Produit</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/#features" className="hover:text-foreground">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-foreground">Tarifs</Link></li>
              <li><Link href="/#faq" className="hover:text-foreground">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Légal</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/terms" className="hover:text-foreground">CGU</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground">Confidentialité</Link></li>
              <li><Link href="/refund" className="hover:text-foreground">Remboursement</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Contact</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><a href="mailto:contact@flex-industry.fr" className="hover:text-foreground">contact@flex-industry.fr</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-2 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} FLEX Industry. Tous droits réservés.</p>
          <p>Fait avec ⚡ à Paris.</p>
        </div>
      </div>
    </footer>
  );
}
