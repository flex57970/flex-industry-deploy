import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientLayout from './client-layout';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Flex.industry — Agence de Communication Visuelle Premium',
  description:
    'Agence de communication visuelle premium spécialisée dans la création de contenu cinématographique pour grandes marques. Immobilier, Automobile, Parfumerie.',
  keywords: ['agence créative', 'communication visuelle', 'contenu cinématographique', 'branding premium'],
  openGraph: {
    title: 'Flex.industry — Communication Visuelle Premium',
    description: 'Création de contenu cinématographique pour grandes marques.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
