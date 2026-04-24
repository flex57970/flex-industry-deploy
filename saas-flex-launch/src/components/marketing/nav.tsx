import Link from "next/link";
import { Button } from "@/components/ui/button";

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span className="text-foreground">FLEX</span>
          <span className="flex-text-gradient">Launch</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm md:flex">
          <Link href="/#features" className="text-muted-foreground hover:text-foreground">
            Features
          </Link>
          <Link href="/pricing" className="text-muted-foreground hover:text-foreground">
            Tarifs
          </Link>
          <Link href="/#faq" className="text-muted-foreground hover:text-foreground">
            FAQ
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Se connecter</Link>
          </Button>
          <Button asChild variant="gold" size="sm">
            <Link href="/signup">Commencer →</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
