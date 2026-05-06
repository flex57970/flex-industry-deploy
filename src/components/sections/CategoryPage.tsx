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
          <span className="eyebrow eyebrow-dark mb-8 hero-reveal hero-reveal-1">{heroLabel}</span>
          <h1 className="heading-display text-[clamp(2.5rem,7vw,6.5rem)] text-white mt-8 hero-reveal-3 text-balance">
            {title}
          </h1>
          <p className="mt-8 text-base md:text-lg text-white/55 font-light max-w-xl hero-reveal hero-reveal-4 text-pretty">
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
              <span className="eyebrow eyebrow-dot mb-8">Notre approche</span>
              <h2 className="heading-display text-2xl md:text-3xl lg:text-4xl text-[var(--color-ink)] mt-8 text-balance leading-[1.15]">
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
                <span className="eyebrow eyebrow-dot mb-8">Nos services</span>
                <h2 className="heading-display text-3xl md:text-4xl lg:text-5xl text-[var(--color-ink)] mt-8 text-balance">
                  Ce que nous <span className="serif-accent text-[var(--color-accent)]">proposons</span>
                </h2>
              </div>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <ScrollReveal key={service.title} delay={i * 0.06}>
                <div className="card-premium p-9 group h-full">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--color-accent-subtle)] flex items-center justify-center mb-7 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110">
                    <span className="text-[11px] font-bold tracking-wider text-[var(--color-accent)]">0{i + 1}</span>
                  </div>
                  <h3 className="text-[15.5px] font-semibold tracking-tight text-[var(--color-ink)]">{service.title}</h3>
                  <p className="mt-3.5 text-gray-500 text-sm leading-relaxed text-pretty">{service.description}</p>
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
                <span className="eyebrow eyebrow-dot mb-8">Portfolio</span>
                <h2 className="heading-display text-3xl md:text-4xl lg:text-5xl text-[var(--color-ink)] mt-8 text-balance">
                  Nos <span className="serif-accent text-[var(--color-accent)]">réalisations</span>
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
