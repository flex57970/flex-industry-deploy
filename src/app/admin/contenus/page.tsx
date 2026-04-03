'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image as ImageIcon, Film, X, RefreshCw, Plus, Trash2, GripVertical, FolderOpen } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { contentAPI, mediaAPI } from '@/lib/api';

interface Content {
  _id: string;
  section: string;
  page: string;
  title: string;
  subtitle: string;
  description: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  order: number;
  isActive: boolean;
}

interface MediaItem {
  _id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  category: string;
}

const pages = ['home', 'immobilier', 'automobile', 'parfumerie'];

const pageLabels: Record<string, string> = {
  home: 'Accueil',
  immobilier: 'Immobilier',
  automobile: 'Automobile',
  parfumerie: 'Parfumerie',
};

// Default sections per page (can be extended dynamically)
const defaultSections: Record<string, { section: string; label: string; mediaLabel: string }[]> = {
  home: [
    { section: 'hero', label: 'Hero principal', mediaLabel: 'Vidéo hero cinématographique' },
    { section: 'about', label: 'À propos', mediaLabel: 'Image à propos' },
    { section: 'showcase-1', label: 'Réalisation 1', mediaLabel: 'Image ou vidéo' },
    { section: 'showcase-2', label: 'Réalisation 2', mediaLabel: 'Image ou vidéo' },
    { section: 'showcase-3', label: 'Réalisation 3', mediaLabel: 'Image ou vidéo' },
    { section: 'showcase-4', label: 'Réalisation 4', mediaLabel: 'Image ou vidéo' },
  ],
  immobilier: [
    { section: 'hero', label: 'Hero Immobilier', mediaLabel: 'Vidéo hero immobilier' },
  ],
  automobile: [
    { section: 'hero', label: 'Hero Automobile', mediaLabel: 'Vidéo hero automobile' },
  ],
  parfumerie: [
    { section: 'hero', label: 'Hero Parfumerie', mediaLabel: 'Vidéo hero parfumerie' },
  ],
};

export default function AdminContents() {
  const { token } = useAuth();
  const [contents, setContents] = useState<Content[]>([]);
  const [selectedPage, setSelectedPage] = useState('home');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSlotLabel, setNewSlotLabel] = useState('');
  const [newSlotType, setNewSlotType] = useState<'gallery' | 'showcase' | 'custom'>('gallery');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadTargetRef = useRef<{ page: string; section: string } | null>(null);

  // Media picker state
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState<{ page: string; section: string } | null>(null);
  const [mediaLibrary, setMediaLibrary] = useState<MediaItem[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);

  const fetchContents = useCallback(async () => {
    if (!token) return;
    try {
      const data = (await contentAPI.getAll(token)) as Content[];
      setContents(data);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchContents();
  }, [fetchContents]);

  const fetchMediaLibrary = useCallback(async () => {
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

  // Build sections list: merge defaults with dynamic content from DB
  const getSections = (page: string) => {
    const defaults = defaultSections[page] || [];
    const pageContents = contents.filter((c) => c.page === page);
    const defaultSectionIds = defaults.map((d) => d.section);

    // Add any DB content sections not in defaults
    const extraSections = pageContents
      .filter((c) => !defaultSectionIds.includes(c.section))
      .map((c) => ({
        section: c.section,
        label: c.title || c.section.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        mediaLabel: 'Image ou vidéo',
      }));

    return [...defaults, ...extraSections];
  };

  const sections = getSections(selectedPage);

  const getContentForSection = (page: string, section: string): Content | undefined => {
    return contents.find((c) => c.page === page && c.section === section);
  };

  const handleUploadClick = (page: string, section: string) => {
    uploadTargetRef.current = { page, section };
    fileInputRef.current?.click();
  };

  const openMediaPicker = (page: string, section: string) => {
    setMediaPickerTarget({ page, section });
    setShowMediaPicker(true);
    fetchMediaLibrary();
  };

  const handleSelectMedia = async (media: MediaItem) => {
    if (!token || !mediaPickerTarget) return;
    const { page, section } = mediaPickerTarget;
    setSaving(`${page}-${section}`);
    setShowMediaPicker(false);

    try {
      const existing = getContentForSection(page, section);
      const isVideo = media.mimeType.startsWith('video/');

      if (existing) {
        await contentAPI.update(
          existing._id,
          { mediaUrl: media.url, mediaType: isVideo ? 'video' : 'image' },
          token
        );
      } else {
        await contentAPI.create(
          {
            page,
            section,
            title: section.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
            mediaUrl: media.url,
            mediaType: isVideo ? 'video' : 'image',
            isActive: true,
            order: sections.length,
          },
          token
        );
      }
      await fetchContents();
    } catch (err) {
      console.error('Select media failed:', err);
    } finally {
      setSaving(null);
      setMediaPickerTarget(null);
    }
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const target = uploadTargetRef.current;
    if (!file || !token || !target) return;

    setSaving(`${target.page}-${target.section}`);

    try {
      const mediaResult = await mediaAPI.upload(file, target.page, token);
      const media = mediaResult as { url: string; mimeType: string };
      const existing = getContentForSection(target.page, target.section);
      const isVideo = media.mimeType.startsWith('video/');

      if (existing) {
        await contentAPI.update(
          existing._id,
          { mediaUrl: media.url, mediaType: isVideo ? 'video' : 'image' },
          token
        );
      } else {
        await contentAPI.create(
          {
            page: target.page,
            section: target.section,
            title: target.section.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
            mediaUrl: media.url,
            mediaType: isVideo ? 'video' : 'image',
            isActive: true,
            order: sections.length,
          },
          token
        );
      }
      await fetchContents();
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setSaving(null);
      uploadTargetRef.current = null;
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveMedia = async (contentId: string) => {
    if (!token || !confirm('Retirer ce média de cet emplacement ?')) return;
    try {
      await contentAPI.update(contentId, { mediaUrl: '', mediaType: 'image' }, token);
      await fetchContents();
    } catch {}
  };

  const handleDeleteSlot = async (page: string, section: string) => {
    if (!token || !confirm('Supprimer définitivement cet emplacement et son contenu ?')) return;
    const content = getContentForSection(page, section);
    if (content) {
      try {
        await contentAPI.delete(content._id, token);
        await fetchContents();
      } catch {}
    }
  };

  const handleAddSlot = async () => {
    if (!token || !newSlotLabel.trim()) return;

    const sectionId = newSlotType === 'custom'
      ? newSlotLabel.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      : `${newSlotType}-${sections.filter(s => s.section.startsWith(newSlotType)).length + 1}`;

    try {
      await contentAPI.create(
        {
          page: selectedPage,
          section: sectionId,
          title: newSlotLabel,
          mediaUrl: '',
          mediaType: 'image',
          isActive: true,
          order: sections.length,
        },
        token
      );
      await fetchContents();
      setShowAddModal(false);
      setNewSlotLabel('');
    } catch {}
  };

  const isVideoMime = (mimeType: string) => mimeType.startsWith('video/');

  const filledCount = sections.filter(s => getContentForSection(selectedPage, s.section)?.mediaUrl).length;
  const isDefaultSection = (section: string) => {
    const defaults = defaultSections[selectedPage] || [];
    return defaults.some((d) => d.section === section);
  };

  return (
    <div className="max-w-[1100px]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Contenus</h1>
          <p className="text-sm text-gray-400 mt-2">
            Assignez vos médias aux emplacements de chaque page.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[13px] text-gray-400">
            <span className="font-medium text-gray-900">{filledCount}</span>
            <span>/</span>
            <span>{sections.length} emplacements</span>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 bg-gray-900 text-white text-[13px] px-4 py-2.5 rounded-xl font-medium hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Ajouter un emplacement
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleFileSelected}
        className="hidden"
      />

      {/* Page tabs */}
      <div className="flex gap-2 mb-10 overflow-x-auto pb-1 -mx-1 px-1">
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => setSelectedPage(p)}
            className={`text-[13px] px-5 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all duration-200 ${
              selectedPage === p
                ? 'bg-gray-900 text-white shadow-sm'
                : 'bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900 border border-gray-100'
            }`}
          >
            {pageLabels[p]}
          </button>
        ))}
      </div>

      {/* Sections grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin" />
        </div>
      ) : sections.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-14 h-14 rounded-2xl bg-[var(--color-warm)] flex items-center justify-center mx-auto mb-5">
            <ImageIcon className="w-6 h-6 text-gray-300" />
          </div>
          <p className="text-[14px] text-gray-500 font-medium mb-2">Aucun emplacement</p>
          <p className="text-[13px] text-gray-400">Cliquez sur &quot;Ajouter un emplacement&quot; pour commencer.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sections.map((sec, i) => {
            const content = getContentForSection(selectedPage, sec.section);
            const hasMedia = content?.mediaUrl;
            const isSaving = saving === `${selectedPage}-${sec.section}`;
            const isVideo = content?.mediaType === 'video';
            const canDelete = !isDefaultSection(sec.section);

            return (
              <motion.div
                key={sec.section}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden group"
              >
                {/* Preview zone */}
                <div className="aspect-video bg-[var(--color-warm)] relative flex items-center justify-center overflow-hidden">
                  {isSaving ? (
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                      <span className="text-[11px] font-medium">Upload...</span>
                    </div>
                  ) : hasMedia ? (
                    <>
                      {isVideo ? (
                        <video
                          src={content.mediaUrl}
                          className="w-full h-full object-cover"
                          muted
                          playsInline
                          onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
                          onMouseOut={(e) => { const v = e.target as HTMLVideoElement; v.pause(); v.currentTime = 0; }}
                        />
                      ) : (
                        <img src={content.mediaUrl} alt={sec.label} className="w-full h-full object-cover" />
                      )}
                      {/* Overlay actions */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                        <button
                          onClick={() => openMediaPicker(selectedPage, sec.section)}
                          className="bg-white text-gray-900 text-[11px] px-3.5 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-1.5"
                        >
                          <RefreshCw className="w-3 h-3" />
                          Remplacer
                        </button>
                        <button
                          onClick={() => content && handleRemoveMedia(content._id)}
                          className="bg-red-500 text-white text-[11px] px-3.5 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center gap-1.5"
                        >
                          <X className="w-3 h-3" />
                          Retirer
                        </button>
                      </div>
                      {/* Type badge */}
                      <div className="absolute top-2.5 right-2.5 bg-black/40 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
                        {isVideo ? <Film className="w-3 h-3 text-white" /> : <ImageIcon className="w-3 h-3 text-white" />}
                        <span className="text-[10px] text-white font-medium">{isVideo ? 'Vidéo' : 'Image'}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-3 w-full h-full justify-center">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openMediaPicker(selectedPage, sec.section)}
                          className="flex flex-col items-center gap-1.5 text-gray-300 hover:text-gray-500 transition-all duration-200 cursor-pointer group/pick px-4 py-2"
                        >
                          <div className="w-9 h-9 rounded-xl border-2 border-dashed border-gray-200 group-hover/pick:border-gray-300 flex items-center justify-center transition-colors">
                            <FolderOpen className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] font-medium">Bibliothèque</span>
                        </button>
                        <button
                          onClick={() => handleUploadClick(selectedPage, sec.section)}
                          className="flex flex-col items-center gap-1.5 text-gray-300 hover:text-gray-500 transition-all duration-200 cursor-pointer group/upload px-4 py-2"
                        >
                          <div className="w-9 h-9 rounded-xl border-2 border-dashed border-gray-200 group-hover/upload:border-gray-300 flex items-center justify-center transition-colors">
                            <Upload className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] font-medium">Upload</span>
                        </button>
                      </div>
                      <span className="text-[10px] text-gray-300">{sec.mediaLabel}</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="px-4 py-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <GripVertical className="w-3.5 h-3.5 text-gray-200 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium text-gray-900 truncate">{sec.label}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {pageLabels[selectedPage]} / {sec.section}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] px-2 py-0.5 rounded-lg font-medium ${
                        hasMedia
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {hasMedia ? 'Actif' : 'Vide'}
                      </span>
                      {canDelete && (
                        <button
                          onClick={() => handleDeleteSlot(selectedPage, sec.section)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
                          title="Supprimer cet emplacement"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Add slot card */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sections.length * 0.03 }}
            onClick={() => setShowAddModal(true)}
            className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-3 min-h-[220px] text-gray-400 hover:text-gray-600 hover:border-gray-300 hover:bg-gray-50/50 transition-all duration-200 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-[13px] font-medium">Ajouter un emplacement</span>
          </motion.button>
        </div>
      )}

      {/* Media Picker Modal */}
      <AnimatePresence>
        {showMediaPicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => { setShowMediaPicker(false); setMediaPickerTarget(null); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-8 pt-8 pb-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight">Bibliothèque média</h3>
                    <p className="text-[13px] text-gray-400 mt-1">Sélectionnez un média à assigner à cet emplacement</p>
                  </div>
                  <button
                    onClick={() => { setShowMediaPicker(false); setMediaPickerTarget(null); }}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                {loadingMedia ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin" />
                  </div>
                ) : mediaLibrary.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="w-14 h-14 rounded-2xl bg-[var(--color-warm)] flex items-center justify-center mx-auto mb-5">
                      <ImageIcon className="w-6 h-6 text-gray-300" />
                    </div>
                    <p className="text-[14px] text-gray-500 font-medium mb-2">Aucun média</p>
                    <p className="text-[13px] text-gray-400">Uploadez d&apos;abord des médias dans la section Médias.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {mediaLibrary.map((media) => (
                      <button
                        key={media._id}
                        onClick={() => handleSelectMedia(media)}
                        className="group/media relative aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-gray-900 transition-all duration-200 cursor-pointer bg-[var(--color-warm)]"
                      >
                        {isVideoMime(media.mimeType) ? (
                          <video src={media.url} className="w-full h-full object-cover" muted />
                        ) : (
                          <img src={media.url} alt={media.originalName} className="w-full h-full object-cover" />
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover/media:bg-black/30 transition-all duration-200" />
                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/media:opacity-100 transition-opacity">
                          <p className="text-[10px] text-white font-medium truncate">{media.originalName}</p>
                        </div>
                        <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-sm rounded px-1.5 py-0.5">
                          {isVideoMime(media.mimeType) ? (
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
                <p className="text-[12px] text-gray-400">{mediaLibrary.length} média(s) disponible(s)</p>
                <button
                  onClick={() => { setShowMediaPicker(false); setMediaPickerTarget(null); }}
                  className="text-[13px] px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Slot Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold tracking-tight mb-6">Nouvel emplacement</h3>

              <div className="mb-5">
                <label className="block text-[11px] tracking-[0.12em] uppercase text-gray-500 mb-2 font-semibold">
                  Type
                </label>
                <div className="flex gap-2">
                  {[
                    { value: 'gallery', label: 'Galerie' },
                    { value: 'showcase', label: 'Showcase' },
                    { value: 'custom', label: 'Personnalisé' },
                  ].map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setNewSlotType(t.value as 'gallery' | 'showcase' | 'custom')}
                      className={`text-[13px] px-4 py-2 rounded-xl font-medium transition-all ${
                        newSlotType === t.value
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-[11px] tracking-[0.12em] uppercase text-gray-500 mb-2 font-semibold">
                  Nom de l&apos;emplacement *
                </label>
                <input
                  type="text"
                  value={newSlotLabel}
                  onChange={(e) => setNewSlotLabel(e.target.value)}
                  placeholder={newSlotType === 'gallery' ? 'Ex: Galerie 7' : 'Ex: Vidéo making-of'}
                  className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all placeholder:text-gray-300"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSlot()}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 text-center text-[13px] py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAddSlot}
                  disabled={!newSlotLabel.trim()}
                  className="flex-1 text-center text-[13px] py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors disabled:opacity-40"
                >
                  Créer l&apos;emplacement
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
