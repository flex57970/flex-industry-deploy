'use client';

import Link from 'next/link';
import Logo from '../ui/Logo';
import ScrollReveal from '../animations/ScrollReveal';
import { ArrowUpRight } from 'lucide-react';

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const footerLinks = {
  expertises: [
    { name: 'Immobilier', href: '/immobilier' },
    { name: 'Automobile', href: '/automobile' },
    { name: 'Parfumerie', href: '/parfumerie' },
  ],
  agence: [
    { name: 'À propos', href: '/#about' },
    { name: 'Notre approche', href: '/#expertises' },
    { name: 'Contact', href: '/contact' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0b] text-white">
      <div className="max-w-[1200px] mx-auto container-px">
        {/* CTA Section */}
        <ScrollReveal>
          <div className="py-28 md:py-36 border-b border-white/[0.06] text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] mb-10">
              <span className="text-[11px] tracking-[0.15em] uppercase text-white/40 font-medium">Commençons</span>
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.1]">
              Prêt à créer quelque chose
              <br />
              <span className="font-semibold">d&apos;exceptionnel ?</span>
            </h2>
            <p className="mt-8 text-white/35 text-base font-light max-w-md mx-auto">
              Discutons de votre projet et donnons vie à votre vision.
            </p>
            <div className="mt-12">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-[var(--color-accent)] text-white text-sm px-7 py-3.5 rounded-full hover:bg-[var(--color-accent-dark)] transition-all duration-300 font-medium tracking-wide"
              >
                Démarrer un projet
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </ScrollReveal>

        {/* Links */}
        <div className="py-20 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <Logo variant="light" size="lg" />
            <p className="mt-6 text-white/30 text-sm leading-relaxed max-w-sm">
              Agence de communication visuelle premium spécialisée dans la création de contenu cinématographique pour grandes marques.
            </p>
            <a
              href="https://www.instagram.com/studiot2.9?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Suivez-nous sur Instagram"
              className="mt-6 inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition-all duration-300 group"
            >
              <InstagramIcon className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
              <span className="text-[13px] text-white/50 group-hover:text-white transition-colors font-medium">@studiot2.9</span>
            </a>
          </div>

          <div>
            <h4 className="text-[11px] tracking-[0.15em] uppercase text-white/30 mb-6 font-semibold">Expertises</h4>
            <ul className="space-y-4">
              {footerLinks.expertises.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/50 hover:text-white transition-colors duration-300">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] tracking-[0.15em] uppercase text-white/30 mb-6 font-semibold">Agence</h4>
            <ul className="space-y-4">
              {footerLinks.agence.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-white/50 hover:text-white transition-colors duration-300">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="py-8 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-white/20">
            &copy; {new Date().getFullYear()} Flex.industry. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/mentions-legales" className="text-[11px] text-white/20 hover:text-white/40 transition-colors">Mentions légales</Link>
            <Link href="/confidentialite" className="text-[11px] text-white/20 hover:text-white/40 transition-colors">Confidentialité</Link>
            <a
              href="https://www.instagram.com/studiot2.9?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-white/20 hover:text-white/50 transition-colors"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
