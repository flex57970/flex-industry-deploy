import { MarketingNav } from "@/components/marketing/nav";
import { Footer } from "@/components/marketing/footer";
import { PricingTable } from "@/components/marketing/pricing-table";
import { FAQ } from "@/components/marketing/faq";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tarifs",
  description:
    "Commence gratuitement. Pro 19€/mois. Agency 49€/mois. Annulation en 1 clic.",
};

export default function PricingPage() {
  return (
    <>
      <MarketingNav />
      <main>
        <section className="border-b border-border py-16 text-center">
          <div className="container">
            <h1 className="font-display text-5xl font-bold">Des tarifs clairs.</h1>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Pas d'engagement. Change ou annule en 1 clic.
            </p>
          </div>
        </section>
        <PricingTable compact />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
