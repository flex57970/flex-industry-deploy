import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Immobilier de Luxe — Vidéo & Photo Premium',
  description:
    'Productions visuelles cinématographiques pour l\'immobilier de prestige. Vidéo drone, visites virtuelles 360°, photographie haut de gamme et films promotionnels pour biens d\'exception.',
  keywords: [
    'vidéo immobilier luxe',
    'drone immobilier',
    'visite virtuelle 360',
    'photographie immobilier prestige',
    'film promotionnel immobilier',
    'home staging digital',
  ],
  alternates: { canonical: '/immobilier' },
  openGraph: {
    title: 'Immobilier de Luxe — Flex.industry',
    description: 'Productions visuelles cinématographiques pour l\'immobilier de prestige.',
    url: '/immobilier',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Immobilier de Luxe — Flex.industry',
    description: 'Productions visuelles cinématographiques pour l\'immobilier de prestige.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
