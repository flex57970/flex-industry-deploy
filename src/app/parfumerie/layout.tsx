import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Parfumerie — Créations Visuelles Sensorielles',
  description:
    'Créations visuelles pour la parfumerie de luxe. Des productions cinématographiques qui éveillent les sens et subliment chaque fragrance d\'exception.',
  keywords: [
    'vidéo parfum luxe',
    'communication parfumerie',
    'film parfum premium',
    'production parfumerie',
    'shooting parfum',
    'branding parfumerie',
  ],
  alternates: { canonical: '/parfumerie' },
  openGraph: {
    title: 'Parfumerie — Flex.industry',
    description: 'Créations visuelles pour la parfumerie de luxe.',
    url: '/parfumerie',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Parfumerie — Flex.industry',
    description: 'Créations visuelles pour la parfumerie de luxe.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
