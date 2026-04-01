'use client';

import CategoryPage from '@/components/sections/CategoryPage';

export default function ImmobilierPage() {
  return (
    <CategoryPage
      pageSlug="immobilier"
      title="Immobilier"
      subtitle="Des productions visuelles qui subliment l'immobilier de prestige"
      description="Nous transformons chaque propriété en une expérience visuelle captivante, du drone aux prises de vue intérieures cinématographiques."
      heroLabel="Immobilier de luxe"
      services={[
        { title: "Vidéo drone", description: "Prises de vue aériennes cinématographiques pour mettre en valeur l'environnement et l'architecture." },
        { title: "Visite virtuelle", description: "Expériences immersives 360° pour une découverte à distance des propriétés d'exception." },
        { title: "Photographie", description: "Shooting photo haut de gamme avec éclairage professionnel et post-production soignée." },
        { title: "Film promotionnel", description: "Courts-métrages narratifs pour raconter l'histoire unique de chaque bien." },
        { title: "Home staging digital", description: "Mise en scène virtuelle des espaces pour révéler tout leur potentiel." },
        { title: "Plans 3D", description: "Modélisation et visualisation 3D pour les projets en cours de construction." },
      ]}
    />
  );
}
