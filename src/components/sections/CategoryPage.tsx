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

// Editorial chapter numbering — référence à un livre / magazine premium
const CHAPTER_NUMBERS: Record<string, string> = {
  immobilier: '01',
  automobile: '02',
  parfumerie: '03',
};

// Mots clés affichés discrètement en bas du hero
const CHAPTER_TAGS: Record<string, string[]> = {
  immobilier: ['Vidéo drone', 'Visite virtuelle', 'Photographie', '4K cinéma'],
  automobile: ['Studio mobile', 'Tracking', 'Color grading', 'Drone'],
  parfumerie: ['Macro', 'Slow motion', 'Direction artistique', 'Lumière naturelle'],
};

// Mot italic serif à mettre en accent sous le titre
const CHAPTER_ACCENTS: Record<string, string> = {
  immobilier: 'de prestige',
  automobile: 'en mouvement',
  parfumerie: 'sensorielle',
};

export default function CategoryPage({
  title,
  subtitle,
  description,
  heroLabel,
  pageSlug,
  services,
}: CategoryPageProps) {
  const { content, getMediaUrl, getMediaType } = usePageContent(pageSlug);
  const chapterNumber = CHAPTER_NUMBERS[pageSlug] || '01';
  const chapterTags = CHAPTER_TAGS[pageSlug] || [];
  const chapterAccent = CHAPTER_ACCENTS[pageSlug] || '';

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
      {/* ═══════ HERO (Editorial Chapter) ═══════ */}
      <section className="relative min-h-[100dvh] flex flex-col justify-end overflow-hidden">
        {/* Background media + overlays */}
        <div className="absolute inset-0 bg-[#0f0e10]">
          {getMediaUrl('hero') && (
            <MediaSlot
              url={getMediaUrl('hero')}
              type={getMediaType('hero')}
              className="absolute inset-0"
            />
          )}
          {/* Dual gradient : top dark for navbar, vignette + bottom darker */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f0e10]/70 via-[#0f0e10]/10 to-[#0f0e10]/95" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,transparent_0%,rgba(15,14,16,0.4)_70%)]" />

          <HeroIllustration slug={pageSlug} />
          <div className="hero-bg-effects" />
        </div>

        {/* Top metadata bar (chapter number + serial) */}
        <div className="absolute top-0 left-0 right-0 z-20 pt-28 md:pt-32 hidden md:block pointer-events-none">
          <div className="max-w-[1280px] mx-auto container-px flex items-start justify-between text-white/40 text-[11px] tracking-[0.2em] uppercase font-mono">
            <span>Flex.industry · Studio</span>
            <span>{`Chapitre ${chapterNumber} / 03`}</span>
          </div>
        </div>

        {/* Vertical chapter mark — left edge */}
        <div className="absolute top-0 bottom-0 left-6 md:left-8 z-20 hidden md:flex flex-col items-center justify-center pointer-events-none">
          <div className="serif-accent text-white/25 text-[clamp(8rem,18vw,14rem)] leading-none select-none" aria-hidden>
            {chapterNumber}
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-10 max-w-[1280px] mx-auto container-px pb-16 md:pb-24 w-full">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-end">
            {/* Left column: title block */}
            <div className="md:col-span-8 md:col-start-3 lg:col-span-7 lg:col-start-3">
              <span className="eyebrow eyebrow-dark mb-7 inline-flex hero-reveal hero-reveal-1">
                {heroLabel}
              </span>
              <h1 className="heading-display text-[clamp(3rem,9vw,8rem)] text-white text-balance hero-reveal-3 leading-[0.92]">
                {title}
              </h1>
              {chapterAccent && (
                <p className="serif-accent text-[clamp(1.5rem,3.5vw,2.75rem)] text-[var(--color-accent-light)] mt-3 leading-tight">
                  {chapterAccent}
                </p>
              )}
              <p className="mt-9 text-base md:text-lg text-white/55 font-light max-w-lg hero-reveal hero-reveal-4 text-pretty leading-relaxed">
                {subtitle}
              </p>
            </div>

            {/* Right column: scroll indicator + meta */}
            <div className="md:col-span-2 md:col-start-11 lg:col-start-11 hidden md:flex flex-col items-end justify-end gap-3 pb-1">
              <span className="text-[10px] tracking-[0.25em] uppercase text-white/35 font-mono">
                Découvrir
              </span>
              <div className="w-px h-16 bg-gradient-to-b from-white/30 to-transparent" />
            </div>
          </div>
        </div>

        {/* Bottom tag row — techniques */}
        {chapterTags.length > 0 && (
          <div className="relative z-10 border-t border-white/[0.06] bg-[#0a0a0b]/40 backdrop-blur-md">
            <div className="max-w-[1280px] mx-auto container-px py-4 md:py-5">
              <div className="flex items-center gap-3 md:gap-5 flex-wrap text-white/55">
                <span className="text-[9px] md:text-[10px] tracking-[0.25em] uppercase text-white/35 font-mono shrink-0">
                  Techniques
                </span>
                <div className="w-px h-3 bg-white/10 hidden md:block" />
                <div className="flex items-center gap-3 md:gap-5 flex-wrap">
                  {chapterTags.map((tag, i) => (
                    <span key={tag} className="flex items-center gap-3 md:gap-5">
                      <span className="text-[11px] md:text-[12px] tracking-wide text-white/65 font-light">
                        {tag}
                      </span>
                      {i < chapterTags.length - 1 && (
                        <span className="text-white/20 text-[10px]" aria-hidden>·</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
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
