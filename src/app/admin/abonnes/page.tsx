'use client';

import { useState, useEffect, useCallback } from 'react';
import { Mail, Trash2, Download } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { subscribersAPI } from '@/lib/api';

interface Subscriber {
  _id: string;
  email: string;
  name?: string;
  isActive: boolean;
  source: string;
  createdAt: string;
}

export default function AdminSubscribers() {
  const { token } = useAuth();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubscribers = useCallback(async () => {
    if (!token) return;
    try {
      const data = (await subscribersAPI.getAll(token)) as Subscriber[];
      setSubscribers(data);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchSubscribers(); }, [fetchSubscribers]);

  const handleDelete = async (id: string, email: string) => {
    if (!token || !confirm(`Supprimer l'abonné ${email} ?`)) return;
    try {
      await subscribersAPI.delete(id, token);
      await fetchSubscribers();
    } catch {}
  };

  const handleExport = () => {
    const csv = ['email,name,source,isActive,createdAt']
      .concat(subscribers.map((s) => `${s.email},"${s.name || ''}",${s.source},${s.isActive},${s.createdAt}`))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `abonnes-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const active = subscribers.filter((s) => s.isActive).length;
  const inactive = subscribers.length - active;

  return (
    <div className="max-w-[1100px]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-3">
            <Mail className="w-6 h-6 text-gray-400" />
            Abonnés newsletter
          </h1>
          <p className="text-sm text-gray-400 mt-2">Liste des personnes inscrites à votre newsletter.</p>
        </div>
        <button
          onClick={handleExport}
          disabled={subscribers.length === 0}
          className="inline-flex items-center gap-2 bg-gray-900 text-white text-[13px] px-4 py-2.5 rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-40"
        >
          <Download className="w-4 h-4" />
          Exporter CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <p className="text-[12px] text-gray-400 mb-1">Abonnés actifs</p>
          <p className="text-3xl font-semibold tracking-tight">{active}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <p className="text-[12px] text-gray-400 mb-1">Désabonnés</p>
          <p className="text-3xl font-semibold tracking-tight text-gray-300">{inactive}</p>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin" />
          </div>
        ) : subscribers.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[14px] text-gray-500 font-medium mb-2">Aucun abonné</p>
            <p className="text-[13px] text-gray-400">Ajoutez un formulaire newsletter sur votre site pour commencer.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {subscribers.map((sub) => (
              <div key={sub._id} className="px-5 py-3.5 flex items-center justify-between group">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-2 h-2 rounded-full ${sub.isActive ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-gray-900 truncate">{sub.email}</p>
                    {sub.name && <p className="text-[11px] text-gray-400 truncate">{sub.name}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-gray-400">{new Date(sub.createdAt).toLocaleDateString('fr-FR')}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-lg bg-gray-100 text-gray-500">{sub.source}</span>
                  <button
                    onClick={() => handleDelete(sub._id, sub.email)}
                    className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
