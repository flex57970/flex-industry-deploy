'use client';

import CategoryPage from '@/components/sections/CategoryPage';

export default function AutomobilePage() {
  return (
    <CategoryPage
      pageSlug="automobile"
      title="Automobile"
      subtitle="L'art de capturer la puissance et l'élégance automobile"
      description="Des productions cinématographiques qui révèlent chaque courbe, chaque détail, chaque sensation de conduite."
      heroLabel="Automobile premium"
      services={[
        { title: "Film de lancement", description: "Productions cinématographiques pour le lancement de nouveaux modèles et concepts." },
        { title: "Packshot dynamique", description: "Mises en scène sophistiquées capturant chaque angle et détail du véhicule." },
        { title: "Essai filmé", description: "Vidéos immersives d'essais sur route capturant performance et sensations." },
        { title: "Contenu social", description: "Formats courts et percutants optimisés pour les réseaux sociaux." },
        { title: "Photos catalogue", description: "Photographie premium pour catalogues et communications de marque." },
        { title: "Événementiel", description: "Couverture complète de salons, lancements et événements exclusifs." },
      ]}
    />
  );
}
