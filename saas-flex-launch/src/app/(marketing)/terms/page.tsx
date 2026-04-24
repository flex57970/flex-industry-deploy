import type { Metadata } from "next";
import { MarketingNav } from "@/components/marketing/nav";
import { Footer } from "@/components/marketing/footer";

export const metadata: Metadata = { title: "Conditions Générales d'Utilisation" };

export default function TermsPage() {
  return (
    <>
      <MarketingNav />
      <main className="container max-w-3xl py-16">
        <h1 className="font-display text-4xl font-bold">Conditions Générales d'Utilisation</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
        </p>

        <div className="prose prose-invert mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground">1. Objet</h2>
            <p>
              Les présentes CGU régissent l'utilisation du service FLEX Launch (le « Service »),
              édité par <strong>[RAISON SOCIALE]</strong>, SIRET <strong>[SIRET]</strong>, siège
              social <strong>[ADRESSE]</strong> (« nous », « notre »).
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">2. Inscription & compte</h2>
            <p>
              L'accès à l'espace authentifié nécessite la création d'un compte avec un email valide.
              Tu es responsable de la confidentialité de tes identifiants.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">3. Abonnement & paiement</h2>
            <p>
              L'abonnement est mensuel, renouvelé tacitement. Tu peux l'annuler à tout moment depuis
              ton espace de facturation. L'annulation prend effet à la fin de la période en cours.
              Les paiements sont traités par Stripe.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">4. Propriété intellectuelle</h2>
            <p>
              Le contenu généré par l'IA est ta propriété dès la génération. Tu garantis que les
              informations fournies ne portent atteinte à aucun droit tiers.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">5. Usage acceptable</h2>
            <p>
              Tu t'engages à ne pas utiliser le Service pour produire du contenu illégal,
              discriminatoire, frauduleux, ou pour contourner les limites techniques imposées.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">6. Résiliation</h2>
            <p>
              Nous pouvons suspendre ou résilier ton compte en cas de violation des présentes CGU,
              de fraude ou d'usage abusif.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">7. Limitation de responsabilité</h2>
            <p>
              Le Service est fourni « en l'état ». Notre responsabilité est limitée au montant payé
              au cours des 12 derniers mois.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">8. Droit applicable</h2>
            <p>
              Les présentes CGU sont régies par le droit français. Tribunaux compétents : Paris.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">9. Contact</h2>
            <p>
              Questions : <a href="mailto:contact@flex-industry.fr">contact@flex-industry.fr</a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
