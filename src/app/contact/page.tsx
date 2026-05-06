'use client';

import { useState } from 'react';
import { ArrowUpRight, Mail, MapPin, Phone, CheckCircle, Calendar, Star } from 'lucide-react';
import ScrollReveal from '@/components/animations/ScrollReveal';
import HeroIllustration from '@/components/ui/HeroIllustration';
import { contactAPI } from '@/lib/api';
import { usePageText } from '@/hooks/usePageText';

export default function ContactPage() {
  const { t } = usePageText('contact');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await contactAPI.send(formData);
      setStatus('sent');
      setFormData({ name: '', email: '', phone: '', company: '', service: '', message: '' });
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const inputClass = "w-full px-4 py-3.5 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)] transition-all duration-200 placeholder:text-gray-300";

  return (
    <>
      {/* ═══════ HERO ═══════ */}
      <section className="relative h-[55vh] min-h-[400px] flex items-end overflow-hidden">
        <div className="absolute inset-0 bg-[#1c1c22]">
          <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c22]/90 via-[#1c1c22]/30 to-[#1c1c22]/40" />
          <HeroIllustration slug="contact" />
          <div className="hero-bg-effects" />
          <div className="hero-grid-line hero-grid-line-v" style={{ left: '25%' }} />
          <div className="hero-grid-line hero-grid-line-v" style={{ left: '50%' }} />
          <div className="hero-grid-line hero-grid-line-v" style={{ left: '75%' }} />
          <div className="hero-grid-line hero-grid-line-h" style={{ top: '33%' }} />
          <div className="hero-grid-line hero-grid-line-h" style={{ top: '66%' }} />
          <div className="hero-corner hero-corner-tl hidden md:block" />
          <div className="hero-corner hero-corner-br hidden md:block" />
        </div>

        <div className="relative z-10 max-w-[1200px] mx-auto container-px pb-18 md:pb-24 w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.04] mb-8 hero-reveal hero-reveal-1">
            <span className="text-[11px] tracking-[0.2em] uppercase text-white/60 font-medium">
              {t('hero.eyebrow', 'Parlons de votre projet')}
            </span>
          </div>
          <h1 className="text-[clamp(2.5rem,7vw,6rem)] font-light text-white tracking-[-0.02em] leading-[1] hero-reveal-3">
            {t('hero.title', 'Contact')}
          </h1>
          <p className="mt-7 text-base md:text-lg text-white/45 font-light max-w-xl hero-reveal hero-reveal-4">
            {t('hero.subtitle', 'Une idée, un projet, une question ? Nous sommes là pour vous accompagner.')}
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />
      </section>

      {/* ═══════ CONTACT FORM + INFO ═══════ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-[1200px] mx-auto container-px">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 lg:gap-24">

            {/* Left: Info */}
            <div className="lg:col-span-2">
              <ScrollReveal>
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-accent-subtle)] mb-8">
                    <span className="text-[11px] tracking-[0.15em] uppercase text-[var(--color-accent)] font-semibold">Informations</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-light tracking-tight mb-5 leading-snug">
                    {t('info.title', 'Discutons de votre vision')}
                  </h2>
                  <p className="text-gray-500 text-sm leading-relaxed mb-12">
                    {t('info.description', 'Chaque projet est unique. Partagez-nous votre vision et nous vous proposerons une approche sur-mesure.')}
                  </p>
                </div>

                <div className="space-y-5">
                  <div className="flex items-start gap-4 p-5 rounded-2xl bg-[var(--color-warm)] border border-gray-100">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-accent-subtle)] flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-[var(--color-accent)]" />
                    </div>
                    <div>
                      <p className="text-[11px] tracking-[0.15em] uppercase text-gray-400 mb-1 font-semibold">Email</p>
                      <a href={`mailto:${t('info.email', 'contact@flex-industry.fr')}`} className="text-sm text-gray-900 hover:text-[var(--color-accent)] transition-colors font-medium">
                        {t('info.email', 'contact@flex-industry.fr')}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-5 rounded-2xl bg-[var(--color-warm)] border border-gray-100">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-accent-subtle)] flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 text-[var(--color-accent)]" />
                    </div>
                    <div>
                      <p className="text-[11px] tracking-[0.15em] uppercase text-gray-400 mb-1 font-semibold">Téléphone</p>
                      <a href={`tel:${t('info.phone', '+33 6 50 98 65 76').replace(/\s/g, '')}`} className="text-sm text-gray-900 hover:text-[var(--color-accent)] transition-colors font-medium">
                        {t('info.phone', '+33 6 50 98 65 76')}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-5 rounded-2xl bg-[var(--color-warm)] border border-gray-100">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-accent-subtle)] flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-[var(--color-accent)]" />
                    </div>
                    <div>
                      <p className="text-[11px] tracking-[0.15em] uppercase text-gray-400 mb-1 font-semibold">Localisation</p>
                      <p className="text-sm text-gray-900 font-medium">{t('info.location', 'Partout en France')}</p>
                    </div>
                  </div>

                  <a
                    href={t('info.instagram-url', 'https://www.instagram.com/studiot2.9')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 p-5 rounded-2xl bg-[var(--color-warm)] border border-gray-100 hover:border-[var(--color-accent)]/30 transition-all duration-300 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-accent-subtle)] flex items-center justify-center flex-shrink-0">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[var(--color-accent)]">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[11px] tracking-[0.15em] uppercase text-gray-400 mb-1 font-semibold">Instagram</p>
                      <p className="text-sm text-gray-900 font-medium group-hover:text-[var(--color-accent)] transition-colors">{t('info.instagram', '@studiot2.9')}</p>
                    </div>
                  </a>
                </div>
              </ScrollReveal>
            </div>

            {/* Right: Form */}
            <div className="lg:col-span-3">
              <ScrollReveal delay={0.15}>
                {status === 'sent' ? (
                  <div className="bg-[var(--color-warm)] rounded-2xl p-10 md:p-14 border border-gray-100 text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Message envoyé !</h3>
                    <p className="text-gray-500 text-sm mb-6">Merci ! Nous reviendrons vers vous sous 24h.</p>
                    <button
                      onClick={() => setStatus('idle')}
                      className="text-sm font-medium text-[var(--color-accent)] hover:underline"
                    >
                      Envoyer un autre message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="bg-[var(--color-warm)] rounded-2xl p-9 md:p-12 border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                      <div>
                        <label className="block text-[11px] tracking-[0.12em] uppercase text-gray-500 mb-2 font-semibold">
                          Nom complet *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className={inputClass}
                          placeholder="Votre nom"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] tracking-[0.12em] uppercase text-gray-500 mb-2 font-semibold">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={inputClass}
                          placeholder="votre@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                      <div>
                        <label className="block text-[11px] tracking-[0.12em] uppercase text-gray-500 mb-2 font-semibold">
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className={inputClass}
                          placeholder="+33 6 00 00 00 00"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] tracking-[0.12em] uppercase text-gray-500 mb-2 font-semibold">
                          Entreprise
                        </label>
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className={inputClass}
                          placeholder="Nom de votre entreprise"
                        />
                      </div>
                    </div>

                    <div className="mb-5">
                      <label className="block text-[11px] tracking-[0.12em] uppercase text-gray-500 mb-2 font-semibold">
                        Type de projet *
                      </label>
                      <select
                        required
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className={`${inputClass} appearance-none`}
                      >
                        <option value="">Sélectionnez un domaine</option>
                        <option value="immobilier">Immobilier</option>
                        <option value="automobile">Automobile</option>
                        <option value="parfumerie">Parfumerie</option>
                        <option value="autre">Autre</option>
                      </select>
                    </div>

                    <div className="mb-8">
                      <label className="block text-[11px] tracking-[0.12em] uppercase text-gray-500 mb-2 font-semibold">
                        Votre message *
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className={`${inputClass} resize-none`}
                        placeholder="Décrivez votre projet, vos objectifs..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={status === 'sending' || status === 'error'}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gray-900 text-white text-sm px-8 py-3.5 rounded-full hover:bg-gray-800 transition-all duration-300 font-medium tracking-wide disabled:opacity-50"
                    >
                      {status === 'sending' ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Envoi en cours...
                        </>
                      ) : status === 'error' ? (
                        <span className="text-red-300">Erreur — réessayez</span>
                      ) : (
                        <>
                          Envoyer le message
                          <ArrowUpRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
      {/* ═══════ BOOKING / CALENDRIER ═══════ */}
      <section className="py-[var(--section-py)] bg-[var(--color-warm)]">
        <div className="max-w-[1200px] mx-auto container-px">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-accent-subtle)] mb-8">
                <span className="text-[11px] tracking-[0.15em] uppercase text-[var(--color-accent)] font-semibold">{t('booking.eyebrow', 'Rendez-vous')}</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight leading-[1.1]">
                {t('booking.title', 'Réservez un créneau')}
              </h2>
              <p className="mt-6 text-gray-500 text-[15px] leading-relaxed">
                {t('booking.subtitle', 'Préférez un échange en direct ? Réservez un appel de 30 minutes pour discuter de votre projet.')}
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/[0.03] overflow-hidden">
              <div className="p-10 md:p-14 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[var(--color-accent-subtle)] flex items-center justify-center mx-auto mb-8">
                  <Calendar className="w-7 h-7 text-[var(--color-accent)]" />
                </div>
                <h3 className="text-xl font-semibold tracking-tight mb-3">{t('booking.cta-title', 'Appel découverte — 30 min')}</h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-md mx-auto mb-10">
                  {t('booking.cta-description', 'Discutons de votre projet, de vos objectifs et de comment Flex.industry peut vous accompagner. Sans engagement.')}
                </p>
                <a
                  href={t('booking.cta-url', 'https://cal.eu/lucas-guerder-basj80/30min')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gray-900 text-white text-sm px-8 py-4 rounded-full hover:bg-gray-800 transition-all duration-300 font-medium tracking-wide"
                >
                  {t('booking.cta-label', 'Choisir un créneau')}
                  <ArrowUpRight className="w-4 h-4" />
                </a>
                <p className="mt-6 text-[12px] text-gray-400">
                  Powered by Cal.com — Gratuit, sans inscription requise
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════ AVIS GOOGLE (affiché uniquement si URL configurée) ═══════ */}
      {t('reviews.url') && (
        <section className="py-[var(--section-py)] bg-white">
          <div className="max-w-[1200px] mx-auto container-px">
            <ScrollReveal>
              <div className="bg-gradient-to-br from-[var(--color-warm)] to-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="p-10 md:p-14 text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-accent-subtle)] mb-8">
                    <span className="text-[11px] tracking-[0.15em] uppercase text-[var(--color-accent)] font-semibold">
                      {t('reviews.eyebrow', 'Avis clients')}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-1 mb-6">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-6 h-6 fill-[#fbbc04] text-[#fbbc04]" />
                    ))}
                  </div>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight leading-[1.1] mb-4">
                    {t('reviews.title', 'Donnez-nous votre avis')}
                  </h2>
                  <p className="text-gray-500 text-[15px] leading-relaxed max-w-md mx-auto mb-10">
                    {t('reviews.subtitle', 'Votre avis compte. Partagez votre expérience sur Google.')}
                  </p>
                  <a
                    href={t('reviews.url')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-900 text-sm px-7 py-3.5 rounded-full hover:border-gray-900 hover:shadow-sm transition-all duration-300 font-medium tracking-wide"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    {t('reviews.button', 'Laisser un avis Google')}
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}
    </>
  );
}
