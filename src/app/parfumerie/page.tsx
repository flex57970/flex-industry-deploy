'use client';

import CategoryPage from '@/components/sections/CategoryPage';

export default function ParfumeriePage() {
  return (
    <CategoryPage
      pageSlug="parfumerie"
      title="Parfumerie"
      subtitle="Des créations visuelles qui éveillent les sens"
      description="Nous sublimos chaque fragrance à travers des visuels qui capturent l'essence, l'émotion et le raffinement."
      heroLabel="L'univers du parfum"
      services={[
        { title: "Film de marque", description: "Courts-métrages narratifs qui racontent l'histoire et l'univers de chaque fragrance." },
        { title: "Packshot créatif", description: "Photographie de produit avec mises en scène artistiques et éclairages d'exception." },
        { title: "Contenu éditorial", description: "Visuels premium pour magazines, campagnes print et communication digitale." },
        { title: "Campagne digitale", description: "Contenus optimisés pour les plateformes sociales et le e-commerce." },
        { title: "Direction artistique", description: "Conception visuelle globale alignée avec l'identité de la maison de parfum." },
        { title: "Post-production", description: "Retouche et étalonnage de niveau cinématographique pour chaque livrable." },
      ]}
    />
  );
}
