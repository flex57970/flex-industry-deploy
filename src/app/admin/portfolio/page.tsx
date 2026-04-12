'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Plus, Trash2, Pencil, GripVertical, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { portfolioAPI, mediaAPI } from '@/lib/api';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  coverUrl: string;
  order: number;
  isActive: boolean;
}

interface MediaItem {
  _id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  url: string;
}

export default function AdminPortfolio() {
  const { token } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', slug: '', description: '', coverUrl: '' });
  const [saving, setSaving] = useState(false);

  // Media picker
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [mediaLibrary, setMediaLibrary] = useState<MediaItem[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);

  const fetchCategories = useCallback(async () => {
    if (!token) return;
    try {
      const data = (await portfolioAPI.getCategories(token)) as Category[];
      setCategories(data);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const fetchMedia = useCallback(async () => {
    if (!token) return;
    setLoadingMedia(true);
    try {
      const data = (await mediaAPI.getAll(token)) as MediaItem[];
      setMediaLibrary(data);
    } catch {
    } finally {
      setLoadingMedia(false);
    }
  }, [token]);

  const generateSlug = (name: string) =>
    name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const openCreate = () => {
    setEditId(null);
    setForm({ name: '', slug: '', description: '', coverUrl: '' });
    setShowModal(true);
  };

  const openEdit = (cat: Category) => {
    setEditId(cat._id);
    setForm({ name: cat.name, slug: cat.slug, description: cat.description, coverUrl: cat.coverUrl });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!token || !form.name.trim()) return;
    setSaving(true);
    try {
      const slug = form.slug || generateSlug(form.name);
      if (editId) {
        await portfolioAPI.updateCategory(editId, { ...form, slug }, token);
      } else {
        await portfolioAPI.createCategory({ ...form, slug, order: categories.length }, token);
      }
      await fetchCategories();
      setShowModal(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token || !confirm('Supprimer cette catégorie et toutes ses grilles ?')) return;
    try {
      await portfolioAPI.deleteCategory(id, token);
      await fetchCategories();
    } catch {}
  };

  const toggleActive = async (cat: Category) => {
    if (!token) return;
    try {
      await portfolioAPI.updateCategory(cat._id, { isActive: !cat.isActive }, token);
      await fetchCategories();
    } catch {}
  };

  return (
    <div className="max-w-[1100px]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Portfolio</h1>
          <p className="text-sm text-gray-400 mt-2">
            Gérez vos catégories de portfolio (ex: Audi, BMW, Drone...).
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-gray-900 text-white text-[13px] px-4 py-2.5 rounded-xl font-medium hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouvelle catégorie
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin" />
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-14 h-14 rounded-2xl bg-[var(--color-warm)] flex items-center justify-center mx-auto mb-5">
            <ImageIcon className="w-6 h-6 text-gray-300" />
          </div>
          <p className="text-[14px] text-gray-500 font-medium mb-2">Aucune catégorie</p>
          <p className="text-[13px] text-gray-400">Créez votre première catégorie de portfolio.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-5 group hover:border-gray-200 transition-all"
            >
              <GripVertical className="w-4 h-4 text-gray-200 shrink-0" />

              {/* Cover thumbnail */}
              <div className="w-16 h-16 rounded-xl bg-[var(--color-warm)] overflow-hidden shrink-0 flex items-center justify-center">
                {cat.coverUrl ? (
                  <img src={cat.coverUrl} alt={cat.name} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-5 h-5 text-gray-300" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-[15px] font-semibold text-gray-900 truncate">{cat.name}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-lg font-medium ${
                    cat.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {cat.isActive ? 'Actif' : 'Masqué'}
                  </span>
                </div>
                <p className="text-[12px] text-gray-400 mt-0.5">/{cat.slug}</p>
                {cat.description && (
                  <p className="text-[13px] text-gray-500 mt-1 truncate">{cat.description}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 shrink-0">
                <Link
                  href={`/admin/portfolio/${cat._id}`}
                  className="h-9 px-3 flex items-center gap-1.5 rounded-xl text-[12px] font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all"
                >
                  Gérer les grilles
                </Link>
                <button
                  onClick={() => toggleActive(cat)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:text-gray-600 hover:bg-gray-50 transition-all"
                  title={cat.isActive ? 'Masquer' : 'Afficher'}
                >
                  {cat.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => openEdit(cat)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:text-gray-600 hover:bg-gray-50 transition-all"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(cat._id)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold tracking-tight mb-6">
              {editId ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] tracking-[0.12em] uppercase text-gray-500 mb-2 font-semibold">Nom *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => {
                    setForm((f) => ({
                      ...f,
                      name: e.target.value,
                      slug: editId ? f.slug : generateSlug(e.target.value),
                    }));
                  }}
                  placeholder="Ex: Audi RS6"
                  className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all placeholder:text-gray-300"
                />
              </div>

              <div>
                <label className="block text-[11px] tracking-[0.12em] uppercase text-gray-500 mb-2 font-semibold">Slug</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  placeholder="audi-rs6"
                  className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all placeholder:text-gray-300"
                />
              </div>

              <div>
                <label className="block text-[11px] tracking-[0.12em] uppercase text-gray-500 mb-2 font-semibold">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all placeholder:text-gray-300 resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] tracking-[0.12em] uppercase text-gray-500 mb-2 font-semibold">Image de couverture</label>
                {form.coverUrl ? (
                  <div className="relative w-full h-32 rounded-xl overflow-hidden bg-[var(--color-warm)] group/cover">
                    <img src={form.coverUrl} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover/cover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover/cover:opacity-100">
                      <button
                        onClick={() => { fetchMedia(); setShowMediaPicker(true); }}
                        className="bg-white text-gray-900 text-[11px] px-3 py-1.5 rounded-lg font-medium"
                      >
                        Changer
                      </button>
                      <button
                        onClick={() => setForm((f) => ({ ...f, coverUrl: '' }))}
                        className="bg-red-500 text-white text-[11px] px-3 py-1.5 rounded-lg font-medium"
                      >
                        Retirer
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => { fetchMedia(); setShowMediaPicker(true); }}
                    className="w-full h-32 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-all"
                  >
                    <ImageIcon className="w-5 h-5" />
                    <span className="text-[12px] font-medium">Choisir depuis la bibliothèque</span>
                  </button>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 text-center text-[13px] py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={!form.name.trim() || saving}
                className="flex-1 text-center text-[13px] py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors disabled:opacity-40"
              >
                {saving ? 'Enregistrement...' : editId ? 'Mettre à jour' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media Picker for cover */}
      {showMediaPicker && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setShowMediaPicker(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-8 pt-8 pb-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold tracking-tight">Bibliothèque média</h3>
                <p className="text-[13px] text-gray-400 mt-1">Sélectionnez une image de couverture</p>
              </div>
              <button
                onClick={() => setShowMediaPicker(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8">
              {loadingMedia ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {mediaLibrary.filter((m) => !m.mimeType.startsWith('video/')).map((media) => (
                    <button
                      key={media._id}
                      onClick={() => {
                        setForm((f) => ({ ...f, coverUrl: media.url }));
                        setShowMediaPicker(false);
                      }}
                      className="group/media relative aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-gray-900 transition-all cursor-pointer bg-[var(--color-warm)]"
                    >
                      <img src={media.url} alt={media.originalName} className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/media:opacity-100 transition-opacity">
                        <p className="text-[10px] text-white font-medium truncate">{media.originalName}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
