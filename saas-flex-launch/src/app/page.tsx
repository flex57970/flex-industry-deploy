import { MarketingNav } from "@/components/marketing/nav";
import { Hero } from "@/components/marketing/hero";
import { Features } from "@/components/marketing/features";
import { PricingTable } from "@/components/marketing/pricing-table";
import { FAQ } from "@/components/marketing/faq";
import { FinalCTA } from "@/components/marketing/cta";
import { Footer } from "@/components/marketing/footer";

export default function HomePage() {
  return (
    <>
      <MarketingNav />
      <main>
        <Hero />
        <Features />
        <PricingTable />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
