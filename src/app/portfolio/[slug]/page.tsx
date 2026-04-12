'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ScrollReveal from '@/components/animations/ScrollReveal';
import MediaSlot from '@/components/ui/MediaSlot';
import { portfolioAPI } from '@/lib/api';

interface GridItem {
  _id: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  caption: string;
  order: number;
}

interface Grid {
  _id: string;
  name: string;
  slug: string;
  items: GridItem[];
}

interface PortfolioCategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  coverUrl: string;
  grids: Grid[];
}

export default function PortfolioCategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<PortfolioCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeGrid, setActiveGrid] = useState<string | null>(null);

  useEffect(() => {
    portfolioAPI
      .getPublic()
      .then((data) => {
        if (Array.isArray(data)) {
          const cat = (data as PortfolioCategory[]).find((c) => c.slug === slug);
          if (cat) {
            setCategory(cat);
            if (cat.grids.length > 0) setActiveGrid(cat.grids[0]._id);
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Catégorie introuvable.</p>
        <Link href="/portfolio" className="text-[13px] text-[var(--color-accent)] font-medium">
          Retour au portfolio
        </Link>
      </div>
    );
  }

  const currentGrid = category.grids.find((g) => g._id === activeGrid);

  return (
    <>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] flex items-end overflow-hidden">
        <div className="absolute inset-0 bg-[#1c1c22]">
          {category.coverUrl && (
            <img
              src={category.coverUrl}
              alt={category.name}
              className="w-full h-full object-cover opacity-40"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c22]/90 via-[#1c1c22]/40 to-[#1c1c22]/50" />
          <div className="hero-bg-effects" />
        </div>

        <div className="relative z-10 max-w-[1200px] mx-auto container-px pb-20 md:pb-28 w-full">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-[13px] font-medium">Portfolio</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.04] mb-8">
            <span className="text-[11px] tracking-[0.2em] uppercase text-white/60 font-medium">
              {category.grids.length} grille{category.grids.length > 1 ? 's' : ''}
            </span>
          </div>

          <h1 className="text-[clamp(2.5rem,7vw,5rem)] font-light text-white tracking-[-0.02em] leading-[1]">
            {category.name}
          </h1>
          {category.description && (
            <p className="mt-6 text-base md:text-lg text-white/45 font-light max-w-xl">
              {category.description}
            </p>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />
      </section>

      {/* Grid selector tabs */}
      {category.grids.length > 1 && (
        <section className="bg-white border-b border-gray-100 sticky top-16 md:top-[72px] z-20">
          <div className="max-w-[1200px] mx-auto container-px">
            <div className="flex gap-1 py-3 overflow-x-auto">
              {category.grids.map((grid) => (
                <button
                  key={grid._id}
                  onClick={() => setActiveGrid(grid._id)}
                  className={`text-[13px] px-5 py-2.5 rounded-full font-medium whitespace-nowrap transition-all duration-200 ${
                    activeGrid === grid._id
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {grid.name}
                  <span className="ml-1.5 text-[11px] opacity-60">{grid.items.length}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Grid content */}
      <section className="py-[var(--section-py)] bg-white">
        <div className="max-w-[1200px] mx-auto container-px">
          {currentGrid && currentGrid.items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {currentGrid.items
                .sort((a, b) => a.order - b.order)
                .map((item, i) => (
                  <ScrollReveal key={item._id} delay={i * 0.04}>
                    <MediaSlot
                      url={item.mediaUrl}
                      type={item.mediaType}
                      placeholder="Média"
                      className="aspect-[9/16] rounded-2xl"
                      alt={item.caption}
                    />
                    {item.caption && (
                      <p className="text-[12px] text-gray-400 mt-2 text-center">{item.caption}</p>
                    )}
                  </ScrollReveal>
                ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400">Aucun média dans cette grille pour le moment.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
