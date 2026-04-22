'use client';

import { useState, useEffect, useCallback } from 'react';
import { Zap, Play, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { automationsAPI, aiAPI } from '@/lib/api';

interface Automation {
  _id: string;
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  lastRunAt?: string;
  lastRunStatus?: 'success' | 'error';
  lastRunMessage?: string;
}

const RUNNABLE = ['daily_backup', 'weekly_report', 'lead_followup', 'check_failed_logins'];

export default function AdminAutomations() {
  const { token } = useAuth();
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);
  const [running, setRunning] = useState<string | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const fetchAutomations = useCallback(async () => {
    if (!token) return;
    try {
      const data = (await automationsAPI.getAll(token)) as Automation[];
      setAutomations(data);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchAutomations(); }, [fetchAutomations]);

  const handleToggle = async (key: string, enabled: boolean) => {
    if (!token) return;
    setToggling(key);
    try {
      await automationsAPI.toggle(key, enabled, token);
      await fetchAutomations();
    } catch {
    } finally {
      setToggling(null);
    }
  };

  const handleRun = async (key: string) => {
    if (!token) return;
    setRunning(key);
    try {
      const result = (await automationsAPI.run(key, token)) as { status: string; message: string };
      alert(`${result.status === 'success' ? '✓' : '✗'} ${result.message}`);
      await fetchAutomations();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setRunning(null);
    }
  };

  const loadSuggestions = async () => {
    if (!token) return;
    setLoadingSuggestions(true);
    try {
      const result = (await aiAPI.getSuggestions(token)) as { suggestions: string[] };
      setAiSuggestions(result.suggestions);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur IA');
    } finally {
      setLoadingSuggestions(false);
    }
  };

  return (
    <div className="max-w-[1100px]">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-3">
            <Zap className="w-6 h-6 text-gray-400" />
            Automations
          </h1>
          <p className="text-sm text-gray-400 mt-2">Activez ou désactivez les agents automatiques. Testez-les manuellement.</p>
        </div>
      </div>

      {/* AI Suggestions card */}
      <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 rounded-2xl border border-amber-100 p-6 mb-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-[15px] font-semibold tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              Suggestions IA de la semaine
            </h2>
            <p className="text-[12px] text-gray-500 mt-1">Analyse de votre site par Claude + suggestions concrètes.</p>
          </div>
          <button
            onClick={loadSuggestions}
            disabled={loadingSuggestions}
            className="text-[12px] px-4 py-2 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors disabled:opacity-40 flex items-center gap-1.5 shrink-0"
          >
            {loadingSuggestions ? (
              <>
                <div className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Analyse...
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3" />
                Générer
              </>
            )}
          </button>
        </div>
        {aiSuggestions.length > 0 ? (
          <ul className="space-y-2">
            {aiSuggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-[13px] text-gray-700">
                <span className="text-amber-600 shrink-0 mt-0.5">→</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[12px] text-gray-400 italic">Cliquez sur &quot;Générer&quot; pour obtenir vos suggestions SEO personnalisées.</p>
        )}
      </div>

      {/* Automations list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {automations.map((auto) => (
            <div key={auto._id} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1.5">
                    <h3 className="text-[14px] font-semibold text-gray-900">{auto.name}</h3>
                    {auto.enabled ? (
                      <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-lg font-medium">Actif</span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-400 rounded-lg font-medium">Désactivé</span>
                    )}
                  </div>
                  <p className="text-[12px] text-gray-500 mb-3">{auto.description}</p>
                  {auto.lastRunAt && (
                    <div className="flex items-center gap-2 text-[11px] text-gray-400">
                      {auto.lastRunStatus === 'success' ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <XCircle className="w-3 h-3 text-red-500" />
                      )}
                      <span>
                        Dernière exécution : {new Date(auto.lastRunAt).toLocaleString('fr-FR')}
                        {auto.lastRunMessage && ` — ${auto.lastRunMessage}`}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {RUNNABLE.includes(auto.key) && (
                    <button
                      onClick={() => handleRun(auto.key)}
                      disabled={running === auto.key}
                      className="h-9 px-3 flex items-center gap-1.5 rounded-xl text-[12px] font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors disabled:opacity-40"
                    >
                      {running === auto.key ? (
                        <>
                          <div className="w-3 h-3 border-2 border-gray-400 border-t-gray-700 rounded-full animate-spin" />
                          Exécution...
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3" />
                          Tester
                        </>
                      )}
                    </button>
                  )}
                  <button
                    onClick={() => handleToggle(auto.key, !auto.enabled)}
                    disabled={toggling === auto.key}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      auto.enabled ? 'bg-gray-900' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block w-4 h-4 transform rounded-full bg-white transition-transform ${
                      auto.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Config help */}
      <div className="mt-10 bg-gray-50 rounded-2xl p-6">
        <h3 className="text-[13px] font-semibold text-gray-900 mb-2">⚙️ Configuration requise</h3>
        <p className="text-[12px] text-gray-500 mb-3">Pour que toutes les automations fonctionnent, configurez ces variables d&apos;environnement sur Hostinger :</p>
        <ul className="text-[11px] text-gray-500 space-y-1 font-mono">
          <li>• <strong>CRON_SECRET</strong> : secret pour le endpoint /api/cron (obligatoire)</li>
          <li>• <strong>ADMIN_EMAIL</strong> : flex.industris@gmail.com (destinataire des rapports)</li>
          <li>• <strong>RESEND_API_KEY</strong> : pour l&apos;envoi d&apos;emails (déjà configuré)</li>
          <li>• <strong>ANTHROPIC_API_KEY</strong> : pour les fonctionnalités IA (optionnel)</li>
          <li>• <strong>NOTION_API_KEY</strong> + <strong>NOTION_LEADS_DATABASE_ID</strong> : sync Notion (optionnel)</li>
        </ul>
        <p className="text-[11px] text-gray-400 mt-3">
          Puis créez un cron Hostinger qui appelle <code className="bg-white px-1.5 py-0.5 rounded">curl -H &quot;x-cron-secret: VOTRE_SECRET&quot; https://flex-industry.fr/api/cron?task=all</code> toutes les heures.
        </p>
      </div>
    </div>
  );
}
