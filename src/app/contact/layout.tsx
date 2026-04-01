import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact — Flex.industry',
  description: 'Contactez Flex.industry pour discuter de votre projet de communication visuelle. Devis gratuit, réponse sous 24h.',
  openGraph: {
    title: 'Contact — Flex.industry',
    description: 'Contactez-nous pour votre projet de communication visuelle premium.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
