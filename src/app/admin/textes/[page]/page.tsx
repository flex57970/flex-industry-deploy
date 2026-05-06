'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, RotateCcw, Eye, ExternalLink } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { pageTextsAPI } from '@/lib/api';

interface PageTextEntry {
  _id: string;
  page: string;
  key: string;
  label: string;
  value: string;
  type: 'text' | 'textarea' | 'html' | 'list';
  group: string;
  order: number;
}

const PAGE_LABELS: Record<string, string> = {
  home: 'Accueil',
  contact: 'Contact',
  'mentions-legales': 'Mentions légales',
  confidentialite: 'Confidentialité',
  footer: 'Pied de page',
};

export default function AdminTextesEdit() {
  const { page } = useParams<{ page: string }>();
  const router = useRouter();
  const { token } = useAuth();
  const [entries, setEntries] = useState<PageTextEntry[]>([]);
  const [originalValues, setOriginalValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  const fetchTexts = useCallback(async () => {
    if (!page) return;
    try {
      const data = (await pageTextsAPI.getPageTexts(page)) as PageTextEntry[];
      setEntries(data);
      const map: Record<string, string> = {};
      for (const e of data) map[e.key] = e.value;
      setOriginalValues(map);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchTexts(); }, [fetchTexts]);

  const handleChange = (key: string, value: string) => {
    setEntries((prev) => prev.map((e) => (e.key === key ? { ...e, value } : e)));
  };

  const handleSave = async () => {
    if (!token) return;
    setSaving(true);
    try {
      const texts = entries.map((e) => ({ key: e.key, value: e.value }));
      await pageTextsAPI.updatePageTexts(page, texts, token);
      const map: Record<string, string> = {};
      for (const e of entries) map[e.key] = e.value;
      setOriginalValues(map);
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2000);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!token || !confirm('Réinitialiser cette page aux valeurs par défaut ? Toutes vos modifications seront perdues.')) return;
    try {
      await pageTextsAPI.resetPage(page, token);
      await fetchTexts();
    } catch {}
  };

  const hasChanges = entries.some((e) => e.value !== originalValues[e.key]);

  // Group entries by group field
  const groupedEntries = entries.reduce((acc, e) => {
    if (!acc[e.group]) acc[e.group] = [];
    acc[e.group].push(e);
    return acc;
  }, {} as Record<string, PageTextEntry[]>);

  const previewUrl = page === 'home' ? '/' : `/${page}`;

  return (
    <div className="max-w-[900px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <button
            onClick={() => router.push('/admin/textes')}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight truncate">{PAGE_LABELS[page] || page}</h1>
            <p className="text-sm text-gray-400 mt-0.5">Éditez les textes de cette page.</p>
          </div>
        </div>
        <a
          href={previewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[12px] text-gray-500 hover:text-gray-900 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50 shrink-0"
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Voir la page</span>
          <ExternalLink className="w-3 h-3 opacity-60" />
        </a>
      </div>

      {/* Save bar (sticky) */}
      <div className="sticky top-0 z-30 bg-[var(--color-warm)] -mx-4 lg:-mx-8 px-4 lg:px-8 py-3 mb-6 border-b border-gray-100 flex items-center justify-between gap-3">
        <div className="text-[12px] text-gray-500">
          {hasChanges ? (
            <span className="text-amber-600 font-medium">● Modifications non enregistrées</span>
          ) : savedFlash ? (
            <span className="text-emerald-600 font-medium">✓ Enregistré</span>
          ) : (
            <span>Tout est à jour</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 text-[12px] px-3 py-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Réinitialiser</span>
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className="inline-flex items-center gap-2 bg-gray-900 text-white text-[13px] px-4 py-2 rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-40"
          >
            {saving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                Enregistrer
              </>
            )}
          </button>
        </div>
      </div>

      {/* Entries by group */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin" />
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-[14px] text-gray-500 font-medium">Aucun texte configuré pour cette page.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedEntries).map(([groupName, groupEntries]) => (
            <div key={groupName} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/30">
                <h2 className="text-[13px] font-semibold text-gray-900">{groupName}</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {groupEntries.map((entry) => (
                  <div key={entry._id} className="px-6 py-5">
                    <label className="block text-[11px] tracking-[0.12em] uppercase text-gray-500 mb-2 font-semibold">
                      {entry.label}
                    </label>
                    {entry.type === 'textarea' ? (
                      <textarea
                        value={entry.value}
                        onChange={(e) => handleChange(entry.key, e.target.value)}
                        rows={Math.min(8, Math.max(3, entry.value.split('\n').length + 1))}
                        className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 focus:bg-white transition-all resize-none"
                      />
                    ) : (
                      <input
                        type="text"
                        value={entry.value}
                        onChange={(e) => handleChange(entry.key, e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 focus:bg-white transition-all"
                      />
                    )}
                    <p className="text-[10px] text-gray-300 mt-1.5 font-mono">{entry.key}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
