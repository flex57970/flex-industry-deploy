'use client';

import ScrollReveal from '@/components/animations/ScrollReveal';
import MediaSlot from '@/components/ui/MediaSlot';
import HeroIllustration from '@/components/ui/HeroIllustration';
import { usePageContent } from '@/hooks/usePageContent';

interface CategoryPageProps {
  title: string;
  subtitle: string;
  description: string;
  heroLabel: string;
  pageSlug: string;
  services: { title: string; description: string }[];
}

export default function CategoryPage({
  title,
  subtitle,
  description,
  heroLabel,
  pageSlug,
  services,
}: CategoryPageProps) {
  const { content, getMediaUrl, getMediaType } = usePageContent(pageSlug);

  // Dynamically get gallery items from DB content
  const galleryItems = content
    .filter((c) => c.section.startsWith('gallery-') && c.mediaUrl)
    .sort((a, b) => a.order - b.order || a.section.localeCompare(b.section));

  // Also get showcase items
  const showcaseItems = content
    .filter((c) => c.section.startsWith('showcase-') && c.mediaUrl)
    .sort((a, b) => a.order - b.order || a.section.localeCompare(b.section));

  const allPortfolioItems = [...showcaseItems, ...galleryItems];

  return (
    <>
      {/* ═══════ HERO ═══════ */}
      <section className="relative h-[80vh] min-h-[500px] flex items-end overflow-hidden">
        <div className="absolute inset-0 bg-[#1c1c22]">
          {getMediaUrl('hero') && (
            <MediaSlot
              url={getMediaUrl('hero')}
              type={getMediaType('hero')}
              className="absolute inset-0"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c22]/90 via-[#1c1c22]/30 to-[#1c1c22]/40" />

          <HeroIllustration slug={pageSlug} />
          <div className="hero-bg-effects" />
          <div className="hero-grid-line hero-grid-line-v" style={{ left: '25%' }} />
          <div className="hero-grid-line hero-grid-line-v" style={{ left: '50%' }} />
          <div className="hero-grid-line hero-grid-line-v" style={{ left: '75%' }} />
          <div className="hero-grid-line hero-grid-line-h" style={{ top: '33%' }} />
          <div className="hero-grid-line hero-grid-line-h" style={{ top: '66%' }} />
          <div className="hero-corner hero-corner-tl hidden md:block" />
          <div className="hero-corner hero-corner-br hidden md:block" />
        </div>

        <div className="relative z-10 max-w-[1200px] mx-auto container-px pb-20 md:pb-28 w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.04] mb-8 hero-reveal hero-reveal-1">
            <span className="text-[11px] tracking-[0.2em] uppercase text-white/60 font-medium">
              {heroLabel}
            </span>
          </div>
          <h1 className="text-[clamp(2.5rem,7vw,6rem)] font-light text-white tracking-[-0.02em] leading-[1] hero-reveal-3">
            {title}
          </h1>
          <p className="mt-8 text-base md:text-lg text-white/45 font-light max-w-xl hero-reveal hero-reveal-4">
            {subtitle}
          </p>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />
      </section>

      {/* ═══════ INTRO ═══════ */}
      <section className="py-[var(--section-py)] bg-white">
        <div className="max-w-[1200px] mx-auto container-px">
          <div className="max-w-3xl mx-auto text-center">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-accent-subtle)] mb-8">
                <span className="text-[11px] tracking-[0.15em] uppercase text-[var(--color-accent)] font-semibold">Notre approche</span>
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight leading-snug">
                {description}
              </h2>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══════ SERVICES ═══════ */}
      <section className="py-[var(--section-py)] bg-[var(--color-warm)]">
        <div className="max-w-[1200px] mx-auto container-px">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-20">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-accent-subtle)] mb-8">
                  <span className="text-[11px] tracking-[0.15em] uppercase text-[var(--color-accent)] font-semibold">Nos services</span>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight leading-[1.1]">
                  Ce que nous <span className="font-semibold">proposons</span>
                </h2>
              </div>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <ScrollReveal key={service.title} delay={i * 0.06}>
                <div className="bg-white p-9 rounded-2xl border border-gray-100 hover:border-gray-200 card-hover group">
                  <div className="w-12 h-12 rounded-xl bg-[var(--color-accent-subtle)] flex items-center justify-center mb-7">
                    <span className="text-xs font-bold text-[var(--color-accent)]">0{i + 1}</span>
                  </div>
                  <h3 className="text-[15px] font-semibold tracking-tight">{service.title}</h3>
                  <p className="mt-3.5 text-gray-500 text-sm leading-relaxed">{service.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ GALLERY / PORTFOLIO ═══════ */}
      {allPortfolioItems.length > 0 && (
        <section className="py-[var(--section-py)] bg-white">
          <div className="max-w-[1200px] mx-auto container-px">
            <ScrollReveal>
              <div className="text-center mb-20">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-accent-subtle)] mb-8">
                  <span className="text-[11px] tracking-[0.15em] uppercase text-[var(--color-accent)] font-semibold">Portfolio</span>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight leading-[1.1]">
                  Nos <span className="font-semibold">réalisations</span>
                </h2>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {allPortfolioItems.map((item, i) => (
                <ScrollReveal key={item.section} delay={i * 0.06}>
                  <MediaSlot
                    url={getMediaUrl(item.section)}
                    type={getMediaType(item.section)}
                    placeholder="Média"
                    className="aspect-[9/16] rounded-2xl"
                  />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
