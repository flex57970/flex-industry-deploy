import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientLayout from './client-layout';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0a0a0b',
};

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
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Flex.industry',
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
