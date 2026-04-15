'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, Pencil, Image as ImageIcon, Film, X, FolderOpen, Upload } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { portfolioAPI, mediaAPI } from '@/lib/api';

interface Category {
  _id: string;
  name: string;
  slug: string;
}

type AspectRatio = '9:16' | '16:9' | '1:1' | '4:5';

interface GridItem {
  _id: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  aspectRatio: AspectRatio;
  caption: string;
  order: number;
}

const ASPECT_OPTIONS: { value: AspectRatio; label: string; cssClass: string }[] = [
  { value: '9:16', label: '9:16', cssClass: 'aspect-[9/16]' },
  { value: '16:9', label: '16:9', cssClass: 'aspect-video' },
  { value: '1:1', label: '1:1', cssClass: 'aspect-square' },
  { value: '4:5', label: '4:5', cssClass: 'aspect-[4/5]' },
];

interface Grid {
  _id: string;
  categoryId: string;
  name: string;
  slug: string;
  order: number;
  isActive: boolean;
  items: GridItem[];
}

interface MediaItem {
  _id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
}

export default function AdminPortfolioGrids() {
  const { id: categoryId } = useParams<{ id: string }>();
  const router = useRouter();
  const { token } = useAuth();
  const [category, setCategory] = useState<Category | null>(null);
  const [grids, setGrids] = useState<Grid[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGrid, setSelectedGrid] = useState<string | null>(null);

  // Grid modal
  const [showGridModal, setShowGridModal] = useState(false);
  const [editGridId, setEditGridId] = useState<string | null>(null);
  const [gridForm, setGridForm] = useState({ name: '', slug: '' });
  const [savingGrid, setSavingGrid] = useState(false);

  // Media picker for items
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [mediaLibrary, setMediaLibrary] = useState<MediaItem[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [addingItem, setAddingItem] = useState(false);
  const [selectedAspect, setSelectedAspect] = useState<AspectRatio>('9:16');

  // Direct upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const fetchCategory = useCallback(async () => {
    if (!token) return;
    try {
      const cats = (await portfolioAPI.getCategories(token)) as Category[];
      const cat = cats.find((c) => c._id === categoryId);
      if (cat) setCategory(cat);
      else router.push('/admin/portfolio');
    } catch {}
  }, [token, categoryId, router]);

  const fetchGrids = useCallback(async () => {
    if (!token || !categoryId) return;
    try {
      const data = (await portfolioAPI.getGrids(categoryId, token)) as Grid[];
      setGrids(data);
      if (data.length > 0 && !selectedGrid) {
        setSelectedGrid(data[0]._id);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }, [token, categoryId, selectedGrid]);

  useEffect(() => { fetchCategory(); fetchGrids(); }, [fetchCategory, fetchGrids]);

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

  const currentGrid = grids.find((g) => g._id === selectedGrid);

  // Grid CRUD
  const openCreateGrid = () => {
    setEditGridId(null);
    setGridForm({ name: '', slug: '' });
    setShowGridModal(true);
  };

  const openEditGrid = (grid: Grid) => {
    setEditGridId(grid._id);
    setGridForm({ name: grid.name, slug: grid.slug });
    setShowGridModal(true);
  };

  const handleSaveGrid = async () => {
    if (!token || !gridForm.name.trim()) return;
    setSavingGrid(true);
    try {
      const slug = gridForm.slug || generateSlug(gridForm.name);
      if (editGridId) {
        await portfolioAPI.updateGrid(editGridId, { name: gridForm.name, slug }, token);
      } else {
        await portfolioAPI.createGrid({ categoryId, name: gridForm.name, slug, order: grids.length }, token);
      }
      await fetchGrids();
      setShowGridModal(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setSavingGrid(false);
    }
  };

  const handleDeleteGrid = async (gridId: string) => {
    if (!token || !confirm('Supprimer cette grille et tous ses médias ?')) return;
    try {
      await portfolioAPI.deleteGrid(gridId, token);
      if (selectedGrid === gridId) setSelectedGrid(null);
      await fetchGrids();
    } catch {}
  };

  // Item management
  const handleAddMediaFromLibrary = async (media: MediaItem) => {
    if (!token || !selectedGrid) return;
    setAddingItem(true);
    try {
      const isVideo = media.mimeType.startsWith('video/');
      await portfolioAPI.addItem(
        selectedGrid,
        { mediaUrl: media.url, mediaType: isVideo ? 'video' : 'image', aspectRatio: selectedAspect, caption: '' },
        token
      );
      await fetchGrids();
      setShowMediaPicker(false);
    } catch {
    } finally {
      setAddingItem(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token || !selectedGrid) return;
    setUploading(true);
    try {
      const result = await mediaAPI.upload(file, 'portfolio', token);
      const media = result as { url: string; mimeType: string };
      const isVideo = media.mimeType.startsWith('video/');
      await portfolioAPI.addItem(
        selectedGrid,
        { mediaUrl: media.url, mediaType: isVideo ? 'video' : 'image', aspectRatio: selectedAspect, caption: '' },
        token
      );
      await fetchGrids();
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleChangeAspect = async (itemId: string, newAspect: AspectRatio) => {
    if (!token || !selectedGrid || !currentGrid) return;
    try {
      const updatedItems = currentGrid.items.map((item) =>
        item._id === itemId ? { ...item, aspectRatio: newAspect } : item
      );
      await portfolioAPI.updateItems(selectedGrid, updatedItems, token);
      await fetchGrids();
    } catch {}
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!token || !selectedGrid || !confirm('Retirer ce média ?')) return;
    try {
      await portfolioAPI.deleteItem(selectedGrid, itemId, token);
      await fetchGrids();
    } catch {}
  };

  if (!category) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-[1100px]">
      <input ref={fileInputRef} type="file" accept="image/*,video/*" onChange={handleFileUpload} className="hidden" />

      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <button
          onClick={() => router.push('/admin/portfolio')}
          className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold tracking-tight">{category.name}</h1>
          <p className="text-sm text-gray-400 mt-1">Gérez les grilles et médias de cette catégorie.</p>
        </div>
      </div>

      {/* Grid tabs */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1">
        {grids.map((grid) => (
          <button
            key={grid._id}
            onClick={() => setSelectedGrid(grid._id)}
            className={`flex items-center gap-2 text-[13px] px-4 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all duration-200 ${
              selectedGrid === grid._id
                ? 'bg-gray-900 text-white shadow-sm'
                : 'bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900 border border-gray-100'
            }`}
          >
            {grid.name}
            <span className="text-[10px] opacity-60">{grid.items.length}</span>
          </button>
        ))}
        <button
          onClick={openCreateGrid}
          className="flex items-center gap-1.5 text-[13px] px-4 py-2.5 rounded-xl font-medium text-gray-400 hover:text-gray-900 hover:bg-gray-50 border border-dashed border-gray-200 hover:border-gray-300 transition-all whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          Nouvelle grille
        </button>
      </div>

      {/* Grid actions bar */}
      {currentGrid && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-[15px] font-semibold">{currentGrid.name}</h2>
            <span className="text-[11px] text-gray-400">{currentGrid.items.length} média(s)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => openEditGrid(currentGrid)}
              className="h-8 px-3 flex items-center gap-1.5 rounded-lg text-[12px] font-medium text-gray-500 hover:bg-gray-50 transition-all"
            >
              <Pencil className="w-3 h-3" />
              Renommer
            </button>
            <button
              onClick={() => handleDeleteGrid(currentGrid._id)}
              className="h-8 px-3 flex items-center gap-1.5 rounded-lg text-[12px] font-medium text-red-400 hover:bg-red-50 hover:text-red-600 transition-all"
            >
              <Trash2 className="w-3 h-3" />
              Supprimer
            </button>
          </div>
        </div>
      )}

      {/* Grid items */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin" />
        </div>
      ) : !currentGrid ? (
        <div className="text-center py-20">
          <div className="w-14 h-14 rounded-2xl bg-[var(--color-warm)] flex items-center justify-center mx-auto mb-5">
            <ImageIcon className="w-6 h-6 text-gray-300" />
          </div>
          <p className="text-[14px] text-gray-500 font-medium mb-2">
            {grids.length === 0 ? 'Aucune grille' : 'Sélectionnez une grille'}
          </p>
          <p className="text-[13px] text-gray-400">
            {grids.length === 0
              ? 'Créez une grille (Photos, Vidéos, Drone...) pour commencer.'
              : 'Cliquez sur un onglet ci-dessus.'}
          </p>
        </div>
      ) : (
        <>
        <div className="flex items-center gap-3 mb-5">
          <span className="text-[11px] tracking-[0.12em] uppercase text-gray-400 font-semibold">Format :</span>
          <div className="flex gap-1.5">
            {ASPECT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSelectedAspect(opt.value)}
                className={`text-[12px] px-3 py-1.5 rounded-lg font-medium transition-all ${
                  selectedAspect === opt.value
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-400 border border-gray-200 hover:bg-gray-50 hover:text-gray-600'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentGrid.items
            .sort((a, b) => a.order - b.order)
            .map((item) => {
              const aspect = ASPECT_OPTIONS.find((o) => o.value === (item.aspectRatio || '9:16'));
              return (
                <div
                  key={item._id}
                  className={`relative ${aspect?.cssClass || 'aspect-[9/16]'} rounded-xl overflow-hidden bg-[var(--color-warm)] group`}
                >
                  {item.mediaType === 'video' ? (
                    <video
                      src={item.mediaUrl}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                      onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
                      onMouseOut={(e) => { const v = e.target as HTMLVideoElement; v.pause(); v.currentTime = 0; }}
                    />
                  ) : (
                    <img src={item.mediaUrl} alt={item.caption || ''} className="w-full h-full object-cover" />
                  )}

                  {/* Badges: type + aspect */}
                  <div className="absolute top-2 right-2 flex items-center gap-1">
                    <div className="bg-black/40 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
                      {item.mediaType === 'video' ? <Film className="w-3 h-3 text-white" /> : <ImageIcon className="w-3 h-3 text-white" />}
                    </div>
                    <div className="bg-black/40 backdrop-blur-sm rounded-lg px-2 py-1">
                      <span className="text-[10px] text-white font-medium">{item.aspectRatio || '9:16'}</span>
                    </div>
                  </div>

                  {/* Hover overlay with actions */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    {/* Aspect ratio quick switch */}
                    <div className="flex gap-1">
                      {ASPECT_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => handleChangeAspect(item._id, opt.value)}
                          className={`text-[10px] px-2 py-1 rounded font-medium transition-colors ${
                            (item.aspectRatio || '9:16') === opt.value
                              ? 'bg-white text-gray-900'
                              : 'bg-white/20 text-white hover:bg-white/40'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => handleDeleteItem(item._id)}
                      className="bg-red-500 text-white text-[11px] px-3.5 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center gap-1.5"
                    >
                      <X className="w-3 h-3" />
                      Retirer
                    </button>
                  </div>
                </div>
              );
            })}

          {/* Add item buttons */}
          <div className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-3 hover:border-gray-300 transition-all">
            {uploading || addingItem ? (
              <div className="flex flex-col items-center gap-2 text-gray-400">
                <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                <span className="text-[11px] font-medium">Ajout...</span>
              </div>
            ) : (
              <>
                <button
                  onClick={() => { fetchMedia(); setShowMediaPicker(true); }}
                  className="flex flex-col items-center gap-1.5 text-gray-300 hover:text-gray-500 transition-all cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl border-2 border-dashed border-gray-200 hover:border-gray-300 flex items-center justify-center transition-colors">
                    <FolderOpen className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-medium">Bibliothèque</span>
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center gap-1.5 text-gray-300 hover:text-gray-500 transition-all cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl border-2 border-dashed border-gray-200 hover:border-gray-300 flex items-center justify-center transition-colors">
                    <Upload className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-medium">Upload</span>
                </button>
              </>
            )}
          </div>
        </div>
        </>
      )}

      {/* Grid Create/Edit Modal */}
      {showGridModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setShowGridModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold tracking-tight mb-6">
              {editGridId ? 'Modifier la grille' : 'Nouvelle grille'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] tracking-[0.12em] uppercase text-gray-500 mb-2 font-semibold">Nom *</label>
                <input
                  type="text"
                  value={gridForm.name}
                  onChange={(e) => setGridForm((f) => ({
                    ...f,
                    name: e.target.value,
                    slug: editGridId ? f.slug : generateSlug(e.target.value),
                  }))}
                  placeholder="Ex: Photos, Vidéos, Drone..."
                  className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all placeholder:text-gray-300"
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveGrid()}
                />
              </div>
              <div>
                <label className="block text-[11px] tracking-[0.12em] uppercase text-gray-500 mb-2 font-semibold">Slug</label>
                <input
                  type="text"
                  value={gridForm.slug}
                  onChange={(e) => setGridForm((f) => ({ ...f, slug: e.target.value }))}
                  placeholder="photos"
                  className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all placeholder:text-gray-300"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowGridModal(false)}
                className="flex-1 text-center text-[13px] py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveGrid}
                disabled={!gridForm.name.trim() || savingGrid}
                className="flex-1 text-center text-[13px] py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors disabled:opacity-40"
              >
                {savingGrid ? 'Enregistrement...' : editGridId ? 'Mettre à jour' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media Picker */}
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
                <p className="text-[13px] text-gray-400 mt-1">Sélectionnez un média à ajouter</p>
              </div>
              <button
                onClick={() => setShowMediaPicker(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8">
              {loadingMedia ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {mediaLibrary.map((media) => (
                    <button
                      key={media._id}
                      onClick={() => handleAddMediaFromLibrary(media)}
                      className="group/media relative aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-gray-900 transition-all cursor-pointer bg-[var(--color-warm)]"
                    >
                      {media.mimeType.startsWith('video/') ? (
                        <video src={media.url} className="w-full h-full object-cover" muted />
                      ) : (
                        <img src={media.url} alt={media.originalName} className="w-full h-full object-cover" />
                      )}
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/media:opacity-100 transition-opacity">
                        <p className="text-[10px] text-white font-medium truncate">{media.originalName}</p>
                      </div>
                      <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-sm rounded px-1.5 py-0.5">
                        {media.mimeType.startsWith('video/') ? (
                          <Film className="w-3 h-3 text-white" />
                        ) : (
                          <ImageIcon className="w-3 h-3 text-white" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="px-8 py-4 border-t border-gray-100 flex justify-between items-center">
              <p className="text-[12px] text-gray-400">{mediaLibrary.length} média(s)</p>
              <button
                onClick={() => setShowMediaPicker(false)}
                className="text-[13px] px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
