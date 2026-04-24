import type { Metadata } from "next";
import { MarketingNav } from "@/components/marketing/nav";
import { Footer } from "@/components/marketing/footer";

export const metadata: Metadata = { title: "Politique de remboursement" };

export default function RefundPage() {
  return (
    <>
      <MarketingNav />
      <main className="container max-w-3xl py-16">
        <h1 className="font-display text-4xl font-bold">Politique de remboursement</h1>
        <div className="mt-8 space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            <strong className="text-foreground">Essai gratuit 7 jours</strong> sur les plans Pro et
            Agency : tu peux annuler avant la fin du trial sans aucun prélèvement.
          </p>
          <p>
            <strong className="text-foreground">Garantie satisfait ou remboursé 14 jours</strong> :
            si tu n'es pas satisfait dans les 14 jours suivant ton premier paiement, écris-nous à{" "}
            <a href="mailto:contact@flex-industry.fr" className="underline">
              contact@flex-industry.fr
            </a>{" "}
            et on te rembourse intégralement.
          </p>
          <p>
            Après 14 jours, les paiements sont non remboursables, mais tu peux annuler à tout moment
            depuis ton espace de facturation. Tu conserves l'accès jusqu'à la fin de la période en
            cours.
          </p>
          <p>
            <strong className="text-foreground">Exceptions</strong> : abonnement utilisé pour
            produire plus de 50 pages ou usage manifestement abusif.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
