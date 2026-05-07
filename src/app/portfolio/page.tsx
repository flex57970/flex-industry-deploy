'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { portfolioAPI } from '@/lib/api';

interface PortfolioCategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  coverUrl: string;
  grids: { _id: string; name: string; items: { mediaUrl: string }[] }[];
}

export default function PortfolioPage() {
  const [categories, setCategories] = useState<PortfolioCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    portfolioAPI
      .getPublic()
      .then((data) => {
        if (Array.isArray(data)) setCategories(data as PortfolioCategory[]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalMedia = categories.reduce(
    (sum, cat) => sum + cat.grids.reduce((gs, g) => gs + g.items.length, 0),
    0
  );

  return (
    <>
      {/* ═══════ HERO (Editorial Index) ═══════ */}
      <section className="relative min-h-[100dvh] flex flex-col justify-end overflow-hidden">
        <div className="absolute inset-0 bg-[#0f0e10]">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f0e10]/70 via-[#0f0e10]/10 to-[#0f0e10]/95" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,transparent_0%,rgba(15,14,16,0.4)_70%)]" />
          <div className="hero-bg-effects" />
        </div>

        {/* Top metadata bar */}
        <div className="absolute top-0 left-0 right-0 z-20 pt-28 md:pt-32 hidden md:block pointer-events-none">
          <div className="max-w-[1280px] mx-auto container-px flex items-start justify-between text-white/40 text-[11px] tracking-[0.2em] uppercase font-mono">
            <span>Flex.industry · Index</span>
            <span>Selected works · 2024–2026</span>
          </div>
        </div>

        {/* Vertical mark */}
        <div className="absolute top-0 bottom-0 left-6 md:left-8 z-20 hidden md:flex flex-col items-center justify-center pointer-events-none">
          <div className="serif-accent text-white/20 text-[clamp(8rem,18vw,14rem)] leading-none select-none italic" aria-hidden>
            №
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-10 max-w-[1280px] mx-auto container-px pb-16 md:pb-24 w-full">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-end">
            <div className="md:col-span-8 md:col-start-3 lg:col-span-7 lg:col-start-3">
              <span className="eyebrow eyebrow-dark mb-7 inline-flex">Portfolio</span>
              <h1 className="heading-display text-[clamp(3rem,9vw,8rem)] text-white text-balance leading-[0.92]">
                Nos
              </h1>
              <p className="serif-accent text-[clamp(1.5rem,3.5vw,2.75rem)] text-[var(--color-accent-light)] mt-3 leading-tight">
                réalisations
              </p>
              <p className="mt-9 text-base md:text-lg text-white/55 font-light max-w-lg text-pretty leading-relaxed">
                Découvrez nos projets à travers nos différentes catégories de production visuelle.
              </p>
            </div>

            <div className="md:col-span-2 md:col-start-11 lg:col-start-11 hidden md:flex flex-col items-end justify-end gap-3 pb-1">
              <span className="text-[10px] tracking-[0.25em] uppercase text-white/35 font-mono">
                Explorer
              </span>
              <div className="w-px h-16 bg-gradient-to-b from-white/30 to-transparent" />
            </div>
          </div>
        </div>

        {/* Bottom stats bar (live data) */}
        <div className="relative z-10 border-t border-white/[0.06] bg-[#0a0a0b]/40 backdrop-blur-md">
          <div className="max-w-[1280px] mx-auto container-px py-4 md:py-5">
            <div className="flex items-center gap-3 md:gap-5 flex-wrap text-white/55">
              <span className="text-[9px] md:text-[10px] tracking-[0.25em] uppercase text-white/35 font-mono shrink-0">
                Sommaire
              </span>
              <div className="w-px h-3 bg-white/10 hidden md:block" />
              <div className="flex items-center gap-3 md:gap-5 flex-wrap">
                <span className="text-[11px] md:text-[12px] tracking-wide text-white/65 font-light">
                  <span className="font-mono text-white/45">{String(categories.length).padStart(2, '0')}</span> Catégories
                </span>
                <span className="text-white/20 text-[10px]" aria-hidden>·</span>
                <span className="text-[11px] md:text-[12px] tracking-wide text-white/65 font-light">
                  <span className="font-mono text-white/45">{String(totalMedia).padStart(2, '0')}</span> Réalisations
                </span>
                {categories.slice(0, 3).map((cat) => (
                  <span key={cat._id} className="flex items-center gap-3 md:gap-5">
                    <span className="text-white/20 text-[10px]" aria-hidden>·</span>
                    <span className="text-[11px] md:text-[12px] tracking-wide text-white/65 font-light">
                      {cat.name}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto container-px">
          <div className="flex items-center justify-center gap-12 text-center">
            <div>
              <p className="text-3xl font-semibold tracking-tight">{categories.length}</p>
              <p className="text-[12px] text-gray-400 mt-1 uppercase tracking-wider font-medium">Catégories</p>
            </div>
            <div className="w-px h-10 bg-gray-100" />
            <div>
              <p className="text-3xl font-semibold tracking-tight">{totalMedia}</p>
              <p className="text-[12px] text-gray-400 mt-1 uppercase tracking-wider font-medium">Réalisations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-[var(--section-py)] bg-white">
        <div className="max-w-[1200px] mx-auto container-px">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin" />
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400">Aucun projet pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat, i) => {
                const itemCount = cat.grids.reduce((s, g) => s + g.items.length, 0);
                const coverImg = cat.coverUrl || cat.grids[0]?.items[0]?.mediaUrl;

                return (
                  <ScrollReveal key={cat._id} delay={i * 0.06}>
                    <Link
                      href={`/portfolio/${cat.slug}`}
                      className="group block bg-white rounded-2xl border border-gray-100 overflow-hidden card-hover"
                    >
                      <div className="aspect-[4/3] bg-[var(--color-warm)] relative overflow-hidden">
                        {coverImg ? (
                          <img
                            src={coverImg}
                            alt={cat.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                            </svg>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      <div className="p-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-[17px] font-semibold tracking-tight group-hover:text-[var(--color-accent)] transition-colors">
                            {cat.name}
                          </h3>
                          <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-[var(--color-accent)] transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                        {cat.description && (
                          <p className="text-[13px] text-gray-500 mt-2 line-clamp-2">{cat.description}</p>
                        )}
                        <div className="flex items-center gap-3 mt-4">
                          <span className="text-[11px] text-gray-400 font-medium">
                            {cat.grids.length} grille{cat.grids.length > 1 ? 's' : ''}
                          </span>
                          <span className="text-[11px] text-gray-300">&bull;</span>
                          <span className="text-[11px] text-gray-400 font-medium">
                            {itemCount} média{itemCount > 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </ScrollReveal>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
