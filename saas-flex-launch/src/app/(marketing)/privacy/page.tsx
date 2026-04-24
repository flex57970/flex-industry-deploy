import type { Metadata } from "next";
import { MarketingNav } from "@/components/marketing/nav";
import { Footer } from "@/components/marketing/footer";

export const metadata: Metadata = { title: "Politique de Confidentialité" };

export default function PrivacyPage() {
  return (
    <>
      <MarketingNav />
      <main className="container max-w-3xl py-16">
        <h1 className="font-display text-4xl font-bold">Politique de Confidentialité</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
        </p>
        <div className="prose prose-invert mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground">1. Responsable de traitement</h2>
            <p>
              <strong>[RAISON SOCIALE]</strong>, SIRET <strong>[SIRET]</strong>, représenté par
              <strong> [DIRIGEANT]</strong>. Contact DPO : <a href="mailto:contact@flex-industry.fr">contact@flex-industry.fr</a>.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">2. Données collectées</h2>
            <ul className="list-disc pl-6">
              <li>Identité : email, nom.</li>
              <li>Facturation : nom, adresse, TVA (via Stripe). Aucune carte stockée sur nos serveurs.</li>
              <li>Usage : logs d'accès, événements (génération, publication), métadonnées projets.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">3. Bases légales</h2>
            <p>Exécution du contrat (fourniture du Service) et intérêt légitime (sécurité).</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">4. Sous-traitants</h2>
            <ul className="list-disc pl-6">
              <li>Supabase (hébergement DB + auth, UE)</li>
              <li>Vercel (hébergement web)</li>
              <li>Stripe (paiement)</li>
              <li>Resend (envoi d'emails)</li>
              <li>OpenAI (génération IA — pas de stockage prolongé)</li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">5. Conservation</h2>
            <p>Les données sont conservées pendant la durée du contrat + 3 ans après résiliation (obligations comptables).</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">6. Tes droits</h2>
            <p>
              Accès, rectification, effacement, portabilité, opposition. Exerce tes droits par email
              à <a href="mailto:contact@flex-industry.fr">contact@flex-industry.fr</a>. Tu peux
              saisir la CNIL (cnil.fr).
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">7. Cookies</h2>
            <p>Cookies strictement nécessaires uniquement (session). Pas de tracking publicitaire.</p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
