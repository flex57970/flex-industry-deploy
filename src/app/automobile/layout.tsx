import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Automobile — Contenu Vidéo Cinématographique',
  description:
    'Contenu cinématographique automobile premium. Capturez la puissance, le design et l\'élégance de chaque véhicule avec des productions visuelles haut de gamme.',
  keywords: [
    'vidéo automobile luxe',
    'film automobile premium',
    'shooting voiture',
    'communication automobile',
    'production automobile',
    'voiture cinématographique',
  ],
  alternates: { canonical: '/automobile' },
  openGraph: {
    title: 'Automobile — Flex.industry',
    description: 'Contenu cinématographique automobile premium.',
    url: '/automobile',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Automobile — Flex.industry',
    description: 'Contenu cinématographique automobile premium.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
