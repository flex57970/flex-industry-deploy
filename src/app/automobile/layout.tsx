import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Automobile — Flex.industry',
  description: 'Contenu cinématographique automobile. Capturer la puissance et l\'élégance de chaque véhicule avec des productions visuelles premium.',
  openGraph: {
    title: 'Automobile — Flex.industry',
    description: 'Contenu cinématographique automobile premium.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
