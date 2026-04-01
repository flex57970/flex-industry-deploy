import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mentions Légales — Flex.industry',
};

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-white pt-40 pb-24">
      <div className="max-w-[800px] mx-auto container-px">
        <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-12">
          Mentions <span className="font-semibold">légales</span>
        </h1>

        <div className="space-y-10 text-[15px] text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">1. Éditeur du site</h2>
            <p>
              Le site flex.industry est édité par Flex.industry, agence de communication visuelle.
            </p>
            <p className="mt-2">
              Email : contact@flex-industry.fr<br />
              Téléphone : +33 6 50 98 65 76
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">2. Hébergement</h2>
            <p>
              Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">3. Propriété intellectuelle</h2>
            <p>
              L&apos;ensemble du contenu de ce site (textes, images, vidéos, logos, graphismes) est protégé par le droit d&apos;auteur.
              Toute reproduction, représentation ou diffusion, en tout ou partie, du contenu de ce site sans autorisation
              préalable est interdite.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">4. Responsabilité</h2>
            <p>
              Flex.industry s&apos;efforce de fournir des informations exactes et à jour. Toutefois, nous ne pouvons
              garantir l&apos;exactitude, la complétude ou l&apos;actualité des informations diffusées sur ce site.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">5. Contact</h2>
            <p>
              Pour toute question relative aux mentions légales, vous pouvez nous contacter à l&apos;adresse
              email : contact@flex-industry.fr
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
