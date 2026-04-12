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
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] flex items-end overflow-hidden">
        <div className="absolute inset-0 bg-[#1c1c22]">
          <div className="hero-bg-effects" />
          <div className="hero-grid-line hero-grid-line-v" style={{ left: '25%' }} />
          <div className="hero-grid-line hero-grid-line-v" style={{ left: '50%' }} />
          <div className="hero-grid-line hero-grid-line-v" style={{ left: '75%' }} />
          <div className="hero-grid-line hero-grid-line-h" style={{ top: '33%' }} />
          <div className="hero-grid-line hero-grid-line-h" style={{ top: '66%' }} />
        </div>

        <div className="relative z-10 max-w-[1200px] mx-auto container-px pb-20 md:pb-28 w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.04] mb-8">
            <span className="text-[11px] tracking-[0.2em] uppercase text-white/60 font-medium">
              Portfolio
            </span>
          </div>
          <h1 className="text-[clamp(2.5rem,7vw,6rem)] font-light text-white tracking-[-0.02em] leading-[1]">
            Nos <span className="font-semibold">réalisations</span>
          </h1>
          <p className="mt-8 text-base md:text-lg text-white/45 font-light max-w-xl">
            Découvrez nos projets à travers nos différentes catégories de production visuelle.
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />
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
