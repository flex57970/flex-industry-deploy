'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Inbox, Mail, Phone, Building2, Calendar, Sparkles, ExternalLink, Trash2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { leadsAPI, aiAPI } from '@/lib/api';

type LeadStatus = 'nouveau' | 'contacte' | 'devis' | 'gagne' | 'perdu';

interface Lead {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service: string;
  message: string;
  status: LeadStatus;
  source: string;
  notes: string;
  createdAt: string;
  followUp3SentAt?: string;
  followUp7SentAt?: string;
}

const STATUS_COLUMNS: { key: LeadStatus; label: string; color: string }[] = [
  { key: 'nouveau', label: 'Nouveau', color: 'bg-blue-50 text-blue-600 border-blue-100' },
  { key: 'contacte', label: 'Contacté', color: 'bg-amber-50 text-amber-600 border-amber-100' },
  { key: 'devis', label: 'Devis envoyé', color: 'bg-violet-50 text-violet-600 border-violet-100' },
  { key: 'gagne', label: 'Gagné', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  { key: 'perdu', label: 'Perdu', color: 'bg-gray-100 text-gray-400 border-gray-100' },
];

export default function AdminLeads() {
  const { token } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [notesDraft, setNotesDraft] = useState('');
  const [saving, setSaving] = useState(false);
  const [aiReply, setAiReply] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const fetchLeads = useCallback(async () => {
    if (!token) return;
    try {
      const data = (await leadsAPI.getAll(token)) as Lead[];
      setLeads(data);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const handleStatusChange = async (lead: Lead, newStatus: LeadStatus) => {
    if (!token) return;
    setSaving(true);
    try {
      await leadsAPI.update(lead._id, { status: newStatus }, token);
      await fetchLeads();
      if (selectedLead?._id === lead._id) {
        setSelectedLead({ ...lead, status: newStatus });
      }
    } catch {
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!token || !selectedLead) return;
    setSaving(true);
    try {
      await leadsAPI.update(selectedLead._id, { notes: notesDraft }, token);
      await fetchLeads();
      setSelectedLead({ ...selectedLead, notes: notesDraft });
    } catch {
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (lead: Lead) => {
    if (!token || !confirm(`Supprimer le lead de ${lead.name} ?`)) return;
    try {
      await leadsAPI.delete(lead._id, token);
      if (selectedLead?._id === lead._id) setSelectedLead(null);
      await fetchLeads();
    } catch {}
  };

  const handleGenerateAiReply = async () => {
    if (!token || !selectedLead) return;
    setAiLoading(true);
    setAiReply(null);
    try {
      const result = (await aiAPI.draftReply(selectedLead._id, token)) as { reply: string };
      setAiReply(result.reply);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur IA');
    } finally {
      setAiLoading(false);
    }
  };

  const openLead = (lead: Lead) => {
    setSelectedLead(lead);
    setNotesDraft(lead.notes || '');
    setAiReply(null);
  };

  const leadsByStatus = STATUS_COLUMNS.reduce((acc, col) => {
    acc[col.key] = leads.filter((l) => l.status === col.key);
    return acc;
  }, {} as Record<LeadStatus, Lead[]>);

  return (
    <div className="max-w-[1400px]">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-3">
            <Inbox className="w-6 h-6 text-gray-400" />
            Leads
          </h1>
          <p className="text-sm text-gray-400 mt-2">Gérez vos prospects du premier contact à la signature.</p>
        </div>
        <div className="text-[13px] text-gray-400">
          <span className="font-semibold text-gray-900">{leads.length}</span> leads au total
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {STATUS_COLUMNS.map((col) => (
            <div key={col.key} className="bg-gray-50/50 rounded-2xl p-3 min-h-[400px]">
              <div className="flex items-center justify-between px-2 py-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] px-2 py-1 rounded-lg font-medium border ${col.color}`}>
                    {col.label}
                  </span>
                </div>
                <span className="text-[11px] text-gray-400 font-semibold">{leadsByStatus[col.key].length}</span>
              </div>
              <div className="space-y-2">
                {leadsByStatus[col.key].map((lead) => (
                  <button
                    key={lead._id}
                    onClick={() => openLead(lead)}
                    className="w-full text-left bg-white rounded-xl border border-gray-100 p-3 hover:border-gray-300 hover:shadow-sm transition-all"
                  >
                    <p className="text-[13px] font-semibold text-gray-900 truncate">{lead.name}</p>
                    <p className="text-[11px] text-gray-400 truncate mt-0.5">{lead.service}</p>
                    <div className="flex items-center gap-1 mt-2 text-[10px] text-gray-400">
                      <Calendar className="w-3 h-3" />
                      {new Date(lead.createdAt).toLocaleDateString('fr-FR')}
                    </div>
                    {(lead.followUp3SentAt || lead.followUp7SentAt) && (
                      <div className="mt-2 flex gap-1">
                        {lead.followUp3SentAt && <span className="text-[9px] px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded">Relance J+3</span>}
                        {lead.followUp7SentAt && <span className="text-[9px] px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded">Relance J+7</span>}
                      </div>
                    )}
                  </button>
                ))}
                {leadsByStatus[col.key].length === 0 && (
                  <p className="text-[11px] text-gray-300 text-center py-6">Aucun lead</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lead detail drawer */}
      {selectedLead && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm"
          onClick={() => setSelectedLead(null)}
        >
          <div
            className="w-full max-w-xl bg-white h-full overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-8 py-6 border-b border-gray-100 flex items-start justify-between gap-4 sticky top-0 bg-white z-10">
              <div className="min-w-0">
                <h2 className="text-xl font-semibold truncate">{selectedLead.name}</h2>
                <p className="text-[13px] text-gray-400 mt-0.5 truncate">{selectedLead.service}</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => handleDelete(selectedLead)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="px-8 py-6 space-y-6">
              {/* Status */}
              <div>
                <p className="text-[10px] tracking-[0.12em] uppercase text-gray-400 font-semibold mb-2">Statut</p>
                <div className="flex flex-wrap gap-1.5">
                  {STATUS_COLUMNS.map((col) => (
                    <button
                      key={col.key}
                      onClick={() => handleStatusChange(selectedLead, col.key)}
                      disabled={saving}
                      className={`text-[12px] px-3 py-1.5 rounded-lg font-medium border transition-all ${
                        selectedLead.status === col.key
                          ? col.color
                          : 'bg-white text-gray-400 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {col.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-2">
                <p className="text-[10px] tracking-[0.12em] uppercase text-gray-400 font-semibold mb-2">Contact</p>
                <a href={`mailto:${selectedLead.email}`} className="flex items-center gap-2.5 text-[13px] text-gray-600 hover:text-gray-900 transition-colors">
                  <Mail className="w-3.5 h-3.5 text-gray-300" />
                  {selectedLead.email}
                </a>
                {selectedLead.phone && (
                  <a href={`tel:${selectedLead.phone}`} className="flex items-center gap-2.5 text-[13px] text-gray-600 hover:text-gray-900 transition-colors">
                    <Phone className="w-3.5 h-3.5 text-gray-300" />
                    {selectedLead.phone}
                  </a>
                )}
                {selectedLead.company && (
                  <div className="flex items-center gap-2.5 text-[13px] text-gray-600">
                    <Building2 className="w-3.5 h-3.5 text-gray-300" />
                    {selectedLead.company}
                  </div>
                )}
                <div className="flex items-center gap-2.5 text-[12px] text-gray-400">
                  <Calendar className="w-3.5 h-3.5 text-gray-300" />
                  Reçu le {new Date(selectedLead.createdAt).toLocaleString('fr-FR')}
                </div>
              </div>

              {/* Message */}
              <div>
                <p className="text-[10px] tracking-[0.12em] uppercase text-gray-400 font-semibold mb-2">Message</p>
                <div className="p-4 bg-gray-50 rounded-xl text-[13px] text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedLead.message}
                </div>
              </div>

              {/* AI Reply */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] tracking-[0.12em] uppercase text-gray-400 font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    Réponse suggérée par IA
                  </p>
                  <button
                    onClick={handleGenerateAiReply}
                    disabled={aiLoading}
                    className="text-[11px] px-3 py-1.5 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors disabled:opacity-40 flex items-center gap-1.5"
                  >
                    {aiLoading ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Génération...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3" />
                        {aiReply ? 'Régénérer' : 'Générer'}
                      </>
                    )}
                  </button>
                </div>
                {aiReply ? (
                  <>
                    <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100 text-[13px] text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {aiReply}
                    </div>
                    <a
                      href={`mailto:${selectedLead.email}?subject=Re: Votre projet&body=${encodeURIComponent(aiReply)}`}
                      className="mt-2 inline-flex items-center gap-1.5 text-[12px] text-[var(--color-accent)] hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Ouvrir dans votre messagerie
                    </a>
                  </>
                ) : (
                  <p className="text-[12px] text-gray-400 italic">Cliquez sur &quot;Générer&quot; pour obtenir une suggestion de réponse personnalisée.</p>
                )}
              </div>

              {/* Notes */}
              <div>
                <p className="text-[10px] tracking-[0.12em] uppercase text-gray-400 font-semibold mb-2">Notes internes</p>
                <textarea
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  placeholder="Ajoutez vos notes..."
                  rows={4}
                  className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 resize-none placeholder:text-gray-300"
                />
                <button
                  onClick={handleSaveNotes}
                  disabled={saving || notesDraft === selectedLead.notes}
                  className="mt-2 text-[12px] px-4 py-2 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors disabled:opacity-40"
                >
                  {saving ? 'Enregistrement...' : 'Enregistrer les notes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden link reference (ts-unused avoidance) */}
      <Link href="/admin" className="sr-only">back</Link>
    </div>
  );
}
