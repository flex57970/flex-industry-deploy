import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact — Discutons de votre projet',
  description:
    'Contactez Flex.industry pour discuter de votre projet de communication visuelle. Devis gratuit et réponse sous 24h. Immobilier, Automobile, Parfumerie.',
  keywords: [
    'contact agence communication',
    'devis vidéo premium',
    'agence créative France',
  ],
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact — Flex.industry',
    description: 'Contactez-nous pour votre projet de communication visuelle premium.',
    url: '/contact',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact — Flex.industry',
    description: 'Contactez-nous pour votre projet de communication visuelle premium.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
