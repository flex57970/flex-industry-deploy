import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Parfumerie — Flex.industry',
  description: 'Créations visuelles pour la parfumerie de luxe. Des productions qui éveillent les sens et subliment chaque fragrance.',
  openGraph: {
    title: 'Parfumerie — Flex.industry',
    description: 'Créations visuelles pour la parfumerie de luxe.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
