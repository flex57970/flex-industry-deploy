import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio — Nos Réalisations Visuelles Premium',
  description:
    'Découvrez le portfolio Flex.industry. Nos dernières créations cinématographiques dans l\'immobilier, l\'automobile et la parfumerie de luxe.',
  keywords: [
    'portfolio vidéo',
    'réalisations communication visuelle',
    'projets immobilier luxe',
    'créations automobile',
    'showcase parfumerie',
  ],
  alternates: { canonical: '/portfolio' },
  openGraph: {
    title: 'Portfolio — Flex.industry',
    description: 'Nos dernières créations cinématographiques pour grandes marques.',
    url: '/portfolio',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio — Flex.industry',
    description: 'Nos dernières créations cinématographiques pour grandes marques.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
