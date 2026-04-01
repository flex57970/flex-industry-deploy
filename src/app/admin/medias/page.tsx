'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Image as ImageIcon, Film, CloudUpload } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { mediaAPI } from '@/lib/api';

interface Media {
  _id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  category: string;
  createdAt: string;
}

const categories = ['general', 'immobilier', 'automobile', 'parfumerie'];

const categoryLabels: Record<string, string> = {
  all: 'Tous',
  general: 'Général',
  immobilier: 'Immobilier',
  automobile: 'Automobile',
  parfumerie: 'Parfumerie',
};

export default function AdminMedias() {
  const { token } = useAuth();
  const [medias, setMedias] = useState<Media[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);

  const fetchMedias = async () => {
    if (!token) return;
    try {
      const data = (await mediaAPI.getAll(token)) as Media[];
      setMedias(data);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedias();
  }, [token]);

  const filtered = selectedCategory === 'all' ? medias : medias.filter((m) => m.category === selectedCategory);

  const handleUpload = async (files: FileList | null) => {
    if (!files || !token) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        await mediaAPI.upload(file, selectedCategory === 'all' ? 'general' : selectedCategory, token);
      }
      await fetchMedias();
    } catch {
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token || !confirm('Supprimer ce média ?')) return;
    try {
      await mediaAPI.delete(id, token);
      await fetchMedias();
    } catch {}
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleUpload(e.dataTransfer.files);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const isVideo = (mimeType: string) => mimeType.startsWith('video/');

  return (
    <div className="max-w-[1100px]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Médias</h1>
          <p className="text-sm text-gray-400 mt-1">
            {medias.length} fichier{medias.length !== 1 ? 's' : ''} dans la bibliothèque
          </p>
        </div>
      </div>

      {/* Upload Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`mb-8 border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 ${
          dragActive
            ? 'border-[var(--color-accent)] bg-[var(--color-accent-subtle)]'
            : 'border-gray-200 hover:border-gray-300 bg-white'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={(e) => handleUpload(e.target.files)}
          className="hidden"
        />
        <div className={`w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
          dragActive ? 'bg-[var(--color-accent-muted)]' : 'bg-[var(--color-warm)]'
        }`}>
          <CloudUpload className={`w-5 h-5 ${dragActive ? 'text-[var(--color-accent)]' : 'text-gray-400'}`} />
        </div>
        <p className="text-[13px] text-gray-600 font-medium">
          {uploading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
              Upload en cours...
            </span>
          ) : (
            'Glissez vos fichiers ici ou cliquez pour parcourir'
          )}
        </p>
        <p className="text-[11px] text-gray-400 mt-1.5">JPG, PNG, SVG, MP4, MOV — Max 100MB</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1.5 mb-6 overflow-x-auto pb-1 -mx-1 px-1">
        {['all', ...categories].map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCategory(c)}
            className={`text-[13px] px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all duration-200 ${
              selectedCategory === c
                ? 'bg-gray-900 text-white shadow-sm'
                : 'bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900 border border-gray-100'
            }`}
          >
            {categoryLabels[c] || c}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-12 h-12 rounded-2xl bg-[var(--color-warm)] flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-5 h-5 text-gray-300" />
          </div>
          <p className="text-[13px] text-gray-400 font-medium">Aucun média trouvé</p>
          <p className="text-[11px] text-gray-300 mt-1">Uploadez des fichiers pour commencer</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((media, i) => (
            <motion.div
              key={media._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden"
            >
              <div className="aspect-square bg-[var(--color-warm)] flex items-center justify-center">
                {isVideo(media.mimeType) ? (
                  <div className="flex flex-col items-center gap-2">
                    <Film className="w-6 h-6 text-gray-300" />
                    <span className="text-[10px] text-gray-300 font-medium">Vidéo</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <ImageIcon className="w-6 h-6 text-gray-300" />
                    <span className="text-[10px] text-gray-300 font-medium">Image</span>
                  </div>
                )}
              </div>
              <div className="p-3.5">
                <p className="text-[12px] font-medium truncate text-gray-900">{media.originalName}</p>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[11px] text-gray-400">{formatSize(media.size)}</span>
                  <span className="text-[10px] text-gray-400 px-2 py-0.5 rounded-md bg-[var(--color-warm)] font-medium">
                    {categoryLabels[media.category] || media.category}
                  </span>
                </div>
              </div>
              {/* Delete button */}
              <button
                onClick={() => handleDelete(media._id)}
                className="absolute top-2.5 right-2.5 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-xl shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 text-gray-400 hover:text-red-500 hover:bg-red-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
