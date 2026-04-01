import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politique de Confidentialité — Flex.industry',
};

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen bg-white pt-40 pb-24">
      <div className="max-w-[800px] mx-auto container-px">
        <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-12">
          Politique de <span className="font-semibold">confidentialité</span>
        </h1>

        <div className="space-y-10 text-[15px] text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">1. Collecte des données</h2>
            <p>
              Nous collectons les données que vous nous fournissez volontairement via nos formulaires :
              nom, prénom, email, numéro de téléphone, nom d&apos;entreprise et message.
              Ces données sont nécessaires au traitement de votre demande.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">2. Utilisation des données</h2>
            <p>
              Vos données personnelles sont utilisées uniquement pour :
            </p>
            <ul className="mt-3 space-y-2 list-disc pl-5">
              <li>Répondre à vos demandes de contact</li>
              <li>Gérer votre compte utilisateur</li>
              <li>Vous envoyer des communications relatives à nos services (avec votre consentement)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">3. Conservation des données</h2>
            <p>
              Vos données sont conservées pendant la durée nécessaire au traitement de votre demande
              et pendant une durée maximale de 3 ans à compter de votre dernier contact.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">4. Partage des données</h2>
            <p>
              Vos données personnelles ne sont jamais vendues ni partagées avec des tiers à des fins commerciales.
              Elles peuvent être transmises à nos sous-traitants techniques (hébergement, envoi d&apos;emails) dans le strict
              cadre de leur mission.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">5. Vos droits</h2>
            <p>
              Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification, de suppression
              et de portabilité de vos données. Vous pouvez exercer ces droits en nous contactant à :
              contact@flex-industry.fr
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">6. Cookies</h2>
            <p>
              Ce site utilise uniquement des cookies techniques nécessaires à son bon fonctionnement.
              Aucun cookie de tracking ou publicitaire n&apos;est utilisé.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
