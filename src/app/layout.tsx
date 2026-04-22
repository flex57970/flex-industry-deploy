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

const SITE_URL = 'https://flex-industry.fr';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0a0a0b',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Flex.industry — Agence de Communication Visuelle Premium',
    template: '%s | Flex.industry',
  },
  description:
    'Agence de communication visuelle premium spécialisée dans la création de contenu cinématographique pour grandes marques. Expertises : Immobilier de luxe, Automobile, Parfumerie.',
  keywords: [
    'agence créative',
    'communication visuelle',
    'contenu cinématographique',
    'branding premium',
    'vidéo immobilier',
    'vidéo automobile',
    'vidéo parfumerie',
    'production vidéo luxe',
    'drone immobilier',
    'photographie premium',
    'Flex industry',
  ],
  authors: [{ name: 'Flex.industry' }],
  creator: 'Flex.industry',
  publisher: 'Flex.industry',
  applicationName: 'Flex.industry',
  category: 'Agence de communication',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: SITE_URL,
    siteName: 'Flex.industry',
    title: 'Flex.industry — Communication Visuelle Premium',
    description:
      'Création de contenu cinématographique pour grandes marques. Immobilier, Automobile, Parfumerie.',
    images: [
      {
        url: '/logo.svg',
        width: 1200,
        height: 630,
        alt: 'Flex.industry — Agence de Communication Visuelle Premium',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flex.industry — Communication Visuelle Premium',
    description: 'Création de contenu cinématographique pour grandes marques.',
    images: ['/logo.svg'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/logo.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: '/logo.svg',
  },
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Flex.industry',
  },
  formatDetection: {
    telephone: false,
  },
  verification: {
    google: 'qYvcfg26Lac8MTD58gQvcLqtQh1RL86E-vLKnst0TIw',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Flex.industry',
  alternateName: 'Flex Industry',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.svg`,
  description:
    'Agence de communication visuelle premium spécialisée dans la création de contenu cinématographique pour grandes marques.',
  slogan: "Nous créons l'extraordinaire",
  founder: {
    '@type': 'Person',
    name: 'Flex.industry',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'contact@flex-industry.fr',
    areaServed: 'FR',
    availableLanguage: ['French', 'English'],
  },
  sameAs: ['https://www.instagram.com/studiot2.9'],
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'FR',
  },
  knowsAbout: [
    'Communication visuelle',
    'Production vidéo',
    'Photographie',
    'Vidéo drone',
    'Immobilier de luxe',
    'Automobile',
    'Parfumerie',
    'Branding',
  ],
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Flex.industry',
  url: SITE_URL,
  inLanguage: 'fr-FR',
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <link rel="canonical" href={SITE_URL} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
