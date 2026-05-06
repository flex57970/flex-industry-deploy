'use client';

import { useState } from 'react';
import Link from 'next/link';
import Logo from '../ui/Logo';
import ScrollReveal from '../animations/ScrollReveal';
import { ArrowUpRight, Check } from 'lucide-react';
import { newsletterAPI } from '@/lib/api';
import { usePageText } from '@/hooks/usePageText';

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
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Contact', href: '/contact' },
  ],
};

export default function Footer() {
  const { t } = usePageText('footer');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const igUrl = t('instagram-url', 'https://www.instagram.com/studiot2.9');
  const igHandle = t('instagram-handle', '@studiot2.9');
  const copyrightText = t('copyright', '© {year} Flex.industry. Tous droits réservés.').replace(
    '{year}',
    String(new Date().getFullYear())
  );

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error');
      setMessage('Email invalide');
      return;
    }
    setStatus('loading');
    try {
      const result = (await newsletterAPI.subscribe(email)) as { message: string };
      setStatus('success');
      setMessage(result.message);
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Erreur');
    }
  };

  return (
    <footer className="bg-[#0a0a0b] text-white">
      <div className="max-w-[1200px] mx-auto container-px">
        {/* CTA Section */}
        <ScrollReveal>
          <div className="py-28 md:py-36 border-b border-white/[0.06] text-center">
            <span className="eyebrow eyebrow-dark mb-10">{t('cta.eyebrow', 'Commençons')}</span>
            <h2 className="heading-display text-3xl md:text-5xl lg:text-6xl text-white mt-10 text-balance">
              {t('cta.title-line-1', 'Prêt à créer quelque chose')}
              <br />
              <span className="serif-accent text-[var(--color-accent-light)]">{t('cta.title-line-2', "d'exceptionnel ?")}</span>
            </h2>
            <p className="mt-8 text-white/40 text-base font-light max-w-md mx-auto text-balance">
              {t('cta.subtitle', 'Discutons de votre projet et donnons vie à votre vision.')}
            </p>
            <div className="mt-12">
              <Link href="/contact" className="btn-premium btn-premium-accent magnetic">
                {t('cta.button', 'Démarrer un projet')}
                <span className="btn-premium-icon">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>
          </div>
        </ScrollReveal>

        {/* Newsletter signup */}
        <ScrollReveal>
          <div className="py-16 border-b border-white/[0.06]">
            <div className="max-w-xl mx-auto text-center">
              <span className="eyebrow eyebrow-dark mb-4">{t('newsletter.eyebrow', 'Newsletter')}</span>
              <h3 className="heading-display text-2xl md:text-3xl text-white mt-4 mb-4 text-balance">
                {t('newsletter.title-line-1', 'Recevez nos')} <span className="serif-accent text-[var(--color-accent-light)]">{t('newsletter.title-line-2', 'dernières réalisations')}</span>
              </h3>
              <p className="text-[13px] text-white/40 mb-8">{t('newsletter.subtitle', 'Un email par projet. Désinscription en un clic.')}</p>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('newsletter.placeholder', 'votre@email.com')}
                  disabled={status === 'loading' || status === 'success'}
                  className="flex-1 px-5 py-3 rounded-full bg-white/[0.04] border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={status === 'loading' || status === 'success'}
                  className="px-6 py-3 rounded-full bg-[var(--color-accent)] text-white text-sm font-medium hover:bg-[var(--color-accent-dark)] transition-colors disabled:opacity-40 flex items-center justify-center gap-2 min-w-[120px]"
                >
                  {status === 'loading' ? (
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : status === 'success' ? (
                    <>
                      <Check className="w-4 h-4" />
                      Inscrit
                    </>
                  ) : (
                    t('newsletter.button', "S'inscrire")
                  )}
                </button>
              </form>
              {message && (
                <p className={`text-[12px] mt-4 ${status === 'error' ? 'text-red-400' : 'text-white/60'}`}>
                  {message}
                </p>
              )}
            </div>
          </div>
        </ScrollReveal>

        {/* Links */}
        <div className="py-20 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <Logo variant="light" size="lg" />
            <p className="mt-6 text-white/30 text-sm leading-relaxed max-w-sm">
              {t('description', 'Agence de communication visuelle premium spécialisée dans la création de contenu cinématographique pour grandes marques.')}
            </p>
            <a
              href={igUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Suivez-nous sur Instagram ${igHandle}`}
              className="mt-6 inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition-all duration-300 group"
            >
              <InstagramIcon className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
              <span className="text-[13px] text-white/50 group-hover:text-white transition-colors font-medium">{igHandle}</span>
            </a>
          </div>

          <div>
            <h4 className="text-[11px] tracking-[0.15em] uppercase text-white/30 mb-6 font-semibold">{t('expertises-title', 'Expertises')}</h4>
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
            <h4 className="text-[11px] tracking-[0.15em] uppercase text-white/30 mb-6 font-semibold">{t('agence-title', 'Agence')}</h4>
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
            {copyrightText}
          </p>
          <div className="flex items-center gap-6">
            <Link href="/mentions-legales" className="text-[11px] text-white/20 hover:text-white/40 transition-colors">Mentions légales</Link>
            <Link href="/confidentialite" className="text-[11px] text-white/20 hover:text-white/40 transition-colors">Confidentialité</Link>
            <a
              href={igUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Instagram ${igHandle}`}
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
