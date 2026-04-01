import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Immobilier de Luxe — Flex.industry',
  description: 'Productions visuelles cinématographiques pour l\'immobilier de prestige. Vidéo drone, visites virtuelles, photographie haut de gamme.',
  openGraph: {
    title: 'Immobilier de Luxe — Flex.industry',
    description: 'Productions visuelles cinématographiques pour l\'immobilier de prestige.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
