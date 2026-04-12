'use client';

import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Play } from 'lucide-react';
import ScrollReveal from '@/components/animations/ScrollReveal';
import MediaSlot from '@/components/ui/MediaSlot';
import HeroIllustration from '@/components/ui/HeroIllustration';
import { usePageContent } from '@/hooks/usePageContent';

const categories = [
  {
    title: 'Immobilier',
    subtitle: 'Propriétés d\'exception',
    description: 'Des vidéos immersives qui subliment chaque bien immobilier de prestige.',
    href: '/immobilier',
    index: '01',
  },
  {
    title: 'Automobile',
    subtitle: 'Performance & Design',
    description: 'Du contenu cinématographique qui capture l\'essence de chaque véhicule.',
    href: '/automobile',
    index: '02',
  },
  {
    title: 'Parfumerie',
    subtitle: 'L\'art de la séduction',
    description: 'Des créations visuelles qui éveillent les sens et subliment chaque fragrance.',
    href: '/parfumerie',
    index: '03',
  },
  {
    title: 'Portfolio',
    subtitle: 'Nos réalisations',
    description: 'Découvrez l\'ensemble de nos projets et réalisations à travers nos catégories.',
    href: '/portfolio',
    index: '04',
  },
];

const stats = [
  { value: '25', label: 'Projets réalisés' },
  { value: '11+', label: 'Clients' },
  { value: '3', label: 'Secteurs d\'expertise' },
  { value: '99%', label: 'Satisfaction' },
];

const process_steps = [
  {
    step: '01',
    title: 'Découverte',
    desc: 'Nous analysons votre marque, votre vision et vos objectifs pour construire une stratégie sur-mesure.',
  },
  {
    step: '02',
    title: 'Création',
    desc: 'Notre équipe conçoit et produit du contenu cinématographique qui sublime votre identité.',
  },
  {
    step: '03',
    title: 'Livraison',
    desc: 'Des livrables premium, optimisés pour chaque plateforme, prêts à captiver votre audience.',
  },
];

export default function Home() {
  const { getMediaUrl, getMediaType } = usePageContent('home');

  return (
    <>
      {/* ═══════ HERO ═══════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[#1c1c22]">
          {getMediaUrl('hero') && (
            <MediaSlot
              url={getMediaUrl('hero')}
              type={getMediaType('hero')}
              className="absolute inset-0"
              overlay
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1c1c22]/50 via-[#1c1c22]/20 to-[#1c1c22]/70" />

          <HeroIllustration slug="home" />
          <div className="hero-bg-effects" />
          <div className="hero-grid-line hero-grid-line-v" style={{ left: '25%' }} />
          <div className="hero-grid-line hero-grid-line-v" style={{ left: '50%' }} />
          <div className="hero-grid-line hero-grid-line-v" style={{ left: '75%' }} />
          <div className="hero-grid-line hero-grid-line-h" style={{ top: '33%' }} />
          <div className="hero-grid-line hero-grid-line-h" style={{ top: '66%' }} />
          <div className="hero-corner hero-corner-tl hidden md:block" />
          <div className="hero-corner hero-corner-br hidden md:block" />
        </div>

        <div className="relative z-10 max-w-[1200px] mx-auto container-px text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.04] mb-10 hero-reveal hero-reveal-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
            <span className="text-[11px] tracking-[0.2em] uppercase text-white/60 font-medium">
              Agence de communication visuelle
            </span>
          </div>

          <h1 className="text-[clamp(2.5rem,7vw,6.5rem)] font-light text-white tracking-[-0.02em] leading-[1] hero-reveal-3">
            Nous créons
            <br />
            <span className="font-semibold">l&apos;extraordinaire</span>
          </h1>

          <p className="mt-8 md:mt-10 text-base md:text-lg text-white/50 font-light max-w-lg mx-auto leading-relaxed hero-reveal hero-reveal-4">
            Contenu cinématographique haut de gamme pour les marques qui refusent l&apos;ordinaire.
          </p>

          <div className="mt-12 md:mt-14 flex flex-col sm:flex-row items-center justify-center gap-4 hero-reveal hero-reveal-5">
            <Link
              href="/contact"
              className="bg-[var(--color-accent)] text-white text-sm px-7 py-3.5 rounded-full hover:bg-[var(--color-accent-dark)] transition-all duration-300 font-medium tracking-wide inline-flex items-center gap-2 group"
            >
              Démarrer un projet
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="#expertises"
              className="text-white/60 text-sm px-7 py-3.5 rounded-full border border-white/10 hover:bg-white/[0.04] hover:text-white/80 transition-all duration-300 font-medium inline-flex items-center gap-2"
            >
              <Play className="w-3.5 h-3.5" />
              Découvrir
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hero-reveal hero-reveal-6">
          <div className="w-[1px] h-10 bg-gradient-to-b from-white/30 to-transparent" style={{ animation: 'scrollBounce 2s ease-in-out infinite' }} />
        </div>
      </section>

      {/* ═══════ STATS BANNER ═══════ */}
      <section className="relative z-10 my-16 md:my-24">
        <div className="max-w-[1200px] mx-auto container-px">
          <div className="bg-white rounded-3xl shadow-xl shadow-black/[0.04] border border-gray-100 p-14 md:p-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-14 md:gap-10">
              {stats.map((stat, i) => (
                <ScrollReveal key={stat.label} delay={i * 0.08}>
                  <div className="text-center">
                    <p className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-gray-900">{stat.value}</p>
                    <p className="mt-3 text-sm md:text-base text-gray-400 font-medium">{stat.label}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ ABOUT ═══════ */}
      <section className="py-[var(--section-py)] bg-white">
        <div className="max-w-[1200px] mx-auto container-px">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-28 items-center">
            <ScrollReveal>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-accent-subtle)] mb-8">
                  <span className="text-[11px] tracking-[0.15em] uppercase text-[var(--color-accent)] font-semibold">À propos</span>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight leading-[1.1]">
                  Une vision
                  <br />
                  <span className="font-semibold">cinématographique</span>
                </h2>
                <p className="mt-8 text-gray-500 leading-relaxed text-[15px]">
                  Flex.industry est une agence de communication visuelle premium. Nous créons du contenu
                  cinématographique sur-mesure pour les marques qui exigent l&apos;excellence. Notre approche
                  allie créativité, technique et vision stratégique.
                </p>
                <Link
                  href="#expertises"
                  className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-gray-900 group"
                >
                  <span className="link-underline">En savoir plus</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <div className="grid grid-cols-2 gap-4">
                <MediaSlot
                  url={getMediaUrl('about')}
                  type={getMediaType('about')}
                  placeholder="Photo agence"
                  className="aspect-[9/16] rounded-2xl col-span-2"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══════ EXPERTISES ═══════ */}
      <section id="expertises" className="py-[var(--section-py)] bg-[var(--color-warm)]">
        <div className="max-w-[1200px] mx-auto container-px">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-20">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-accent-subtle)] mb-8">
                  <span className="text-[11px] tracking-[0.15em] uppercase text-[var(--color-accent)] font-semibold">Nos expertises</span>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight leading-[1.1]">
                  Des univers <span className="font-semibold">uniques</span>
                </h2>
              </div>
              <Link
                href="/contact"
                className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors inline-flex items-center gap-1.5 group"
              >
                Voir tout
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </ScrollReveal>

          <div className="space-y-0 border-t border-gray-200">
            {categories.map((cat, i) => (
              <ScrollReveal key={cat.href} delay={i * 0.08}>
                <Link href={cat.href} className="group block">
                  <div className="py-10 md:py-12 border-b border-gray-200 flex flex-col md:flex-row md:items-center gap-4 md:gap-10 transition-all duration-300">
                    <span className="text-[11px] text-[var(--color-accent)] font-mono font-semibold tracking-wider">{cat.index}</span>
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight flex-1 group-hover:translate-x-3 transition-transform duration-300">
                      {cat.title}
                    </h3>
                    <p className="text-sm text-gray-400 max-w-xs hidden lg:block">{cat.description}</p>
                    <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-gray-900 group-hover:border-gray-900 transition-all duration-300">
                      <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ SHOWCASE / PORTFOLIO ═══════ */}
      <section className="py-[var(--section-py)] bg-[#0f0f12] grain-overlay relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto container-px relative z-10">
          <ScrollReveal>
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] mb-8">
                <span className="text-[11px] tracking-[0.15em] uppercase text-white/50 font-semibold">Portfolio</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-white leading-[1.1]">
                Nos dernières <span className="font-semibold">créations</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((item, i) => (
              <ScrollReveal key={item} delay={i * 0.1}>
                <MediaSlot
                  url={getMediaUrl(`showcase-${item}`)}
                  type={getMediaType(`showcase-${item}`)}
                  placeholder="Ajouter média"
                  className="aspect-[9/16] rounded-2xl border-white/[0.06] bg-white/[0.03] text-white/30"
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ TESTIMONIALS ═══════ */}
      <section className="py-[var(--section-py)] bg-white">
        <div className="max-w-[1200px] mx-auto container-px">
          <ScrollReveal>
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-accent-subtle)] mb-8">
                <span className="text-[11px] tracking-[0.15em] uppercase text-[var(--color-accent)] font-semibold">Témoignages</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight leading-[1.1]">
                Ce qu&apos;ils <span className="font-semibold">en disent</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "Flex.industry a transformé notre image de marque. Le contenu cinématographique qu'ils ont produit a dépassé toutes nos attentes.",
                name: 'Sophie Laurent',
                role: 'Directrice Marketing',
                company: 'Immobilier Prestige',
              },
              {
                quote: "Un professionnalisme rare. L'équipe comprend parfaitement les codes du luxe et sait les retranscrire en images.",
                name: 'Marc Dubois',
                role: 'CEO',
                company: 'Auto Premium Paris',
              },
              {
                quote: "Nos vidéos produit ont généré un engagement 3x supérieur. La qualité visuelle fait toute la différence.",
                name: 'Camille Moreau',
                role: 'Brand Manager',
                company: 'Maison de Parfum',
              },
            ].map((testimonial, i) => (
              <ScrollReveal key={testimonial.name} delay={i * 0.1}>
                <div className="p-10 lg:p-12 rounded-2xl bg-[var(--color-warm)] border border-gray-100 h-full flex flex-col">
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, j) => (
                      <svg key={j} className="w-4 h-4 text-[var(--color-accent)]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <blockquote className="text-[15px] text-gray-700 leading-relaxed flex-1">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>
                  <div className="mt-8 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--color-accent-subtle)] flex items-center justify-center">
                      <span className="text-[11px] font-semibold text-[var(--color-accent)]">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-gray-900">{testimonial.name}</p>
                      <p className="text-[11px] text-gray-400">{testimonial.role}, {testimonial.company}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ PROCESS ═══════ */}
      <section className="py-[var(--section-py)] bg-white">
        <div className="max-w-[1200px] mx-auto container-px">
          <ScrollReveal>
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-accent-subtle)] mb-8">
                <span className="text-[11px] tracking-[0.15em] uppercase text-[var(--color-accent)] font-semibold">Notre processus</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight leading-[1.1]">
                Simple. <span className="font-semibold">Efficace.</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {process_steps.map((item, i) => (
              <ScrollReveal key={item.step} delay={i * 0.1}>
                <div className="group p-10 lg:p-12 rounded-2xl border border-gray-100 hover:border-gray-200 card-hover bg-white">
                  <div className="w-14 h-14 rounded-xl bg-[var(--color-accent-subtle)] flex items-center justify-center mb-8">
                    <span className="text-sm font-bold text-[var(--color-accent)]">{item.step}</span>
                  </div>
                  <h3 className="text-lg font-semibold tracking-tight">{item.title}</h3>
                  <p className="mt-4 text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
