import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Toaster } from "@/components/ui/toast";
import "./globals.css";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "FLEX Launch — Génère des landing pages en 60 secondes",
    template: "%s · FLEX Launch",
  },
  description:
    "FLEX Launch génère des landing pages premium en 60 secondes grâce à l'IA. Hero, features, pricing, FAQ — décris ton produit, on s'occupe du reste.",
  keywords: ["landing page", "AI", "générateur", "freelance", "agence", "Next.js", "SaaS"],
  authors: [{ name: "FLEX Industry", url: "https://flex-industry.fr" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/",
    siteName: "FLEX Launch",
    title: "FLEX Launch — Génère des landing pages en 60 secondes",
    description: "Génère des landing pages premium en 60 secondes grâce à l'IA.",
    images: [{ url: "/og", width: 1200, height: 630, alt: "FLEX Launch" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "FLEX Launch",
    description: "Génère des landing pages premium en 60 secondes grâce à l'IA.",
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#0D0D0D",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${sans.variable} ${display.variable}`}>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
