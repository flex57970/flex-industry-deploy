'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Type, FileText, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { pageTextsAPI } from '@/lib/api';

interface PageInfo {
  page: string;
  label: string;
  count: number;
  lastUpdated?: string;
}

export default function AdminTextes() {
  const { token } = useAuth();
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPages = useCallback(async () => {
    if (!token) return;
    try {
      const data = (await pageTextsAPI.getPages(token)) as PageInfo[];
      setPages(data);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchPages(); }, [fetchPages]);

  return (
    <div className="max-w-[1100px]">
      <div className="mb-10">
        <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-3">
          <Type className="w-6 h-6 text-gray-400" />
          Textes des pages
        </h1>
        <p className="text-sm text-gray-400 mt-2">Modifiez tous les textes de votre site sans toucher au code.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin" />
        </div>
      ) : pages.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-[14px] text-gray-500 font-medium">Aucune page configurée.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pages.map((p) => (
            <Link
              key={p.page}
              href={`/admin/textes/${p.page}`}
              className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-gray-200 hover:shadow-sm transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-violet-600" />
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all" />
              </div>
              <h3 className="text-[15px] font-semibold text-gray-900">{p.label}</h3>
              <p className="text-[12px] text-gray-400 mt-1">/{p.page === 'home' ? '' : p.page}</p>
              <div className="flex items-center gap-3 mt-4">
                <span className="text-[11px] text-gray-400">
                  <span className="font-semibold text-gray-700">{p.count}</span> texte{p.count > 1 ? 's' : ''}
                </span>
                {p.lastUpdated && (
                  <>
                    <span className="text-[11px] text-gray-300">·</span>
                    <span className="text-[11px] text-gray-400">
                      MAJ {new Date(p.lastUpdated).toLocaleDateString('fr-FR')}
                    </span>
                  </>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
