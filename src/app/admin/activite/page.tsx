'use client';

import { useState, useEffect, useCallback } from 'react';
import { Activity, AlertTriangle, AlertCircle, Info, RefreshCw } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { activityAPI } from '@/lib/api';

type Severity = 'info' | 'warning' | 'critical';

interface Log {
  _id: string;
  type: string;
  severity: Severity;
  userEmail?: string;
  ip?: string;
  description: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

const SEVERITY_CONFIG: Record<Severity, { icon: typeof Info; color: string; bg: string; label: string }> = {
  info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-50', label: 'Info' },
  warning: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50', label: 'Warning' },
  critical: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50', label: 'Critique' },
};

export default function AdminActivity() {
  const { token } = useAuth();
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | Severity>('all');

  const fetchLogs = useCallback(async (opts?: { refresh?: boolean }) => {
    if (!token) return;
    if (opts?.refresh) setRefreshing(true);
    try {
      const data = (await activityAPI.getAll(token, {
        severity: filter === 'all' ? undefined : filter,
        limit: 200,
      })) as Log[];
      setLogs(data);
    } catch {
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token, filter]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  // Auto-refresh every 30s
  useEffect(() => {
    const interval = setInterval(() => fetchLogs({ refresh: true }), 30000);
    return () => clearInterval(interval);
  }, [fetchLogs]);

  const counts = {
    all: logs.length,
    info: logs.filter((l) => l.severity === 'info').length,
    warning: logs.filter((l) => l.severity === 'warning').length,
    critical: logs.filter((l) => l.severity === 'critical').length,
  };

  return (
    <div className="max-w-[1100px]">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-3">
            <Activity className="w-6 h-6 text-gray-400" />
            Journal d&apos;activité
          </h1>
          <p className="text-sm text-gray-400 mt-2">Toutes les actions et événements des 90 derniers jours.</p>
        </div>
        <button
          onClick={() => fetchLogs({ refresh: true })}
          disabled={refreshing}
          className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 text-[13px] px-4 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-40"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          Actualiser
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto">
        {(['all', 'info', 'warning', 'critical'] as const).map((key) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`text-[12px] px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
              filter === key
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'
            }`}
          >
            {key === 'all' ? `Tout (${counts.all})` : `${SEVERITY_CONFIG[key as Severity].label} (${counts[key as Severity]})`}
          </button>
        ))}
      </div>

      {/* Log list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin" />
        </div>
      ) : logs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 text-center py-20">
          <p className="text-[14px] text-gray-500 font-medium mb-2">Aucune activité</p>
          <p className="text-[13px] text-gray-400">Le journal est vide pour ce filtre.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-50">
            {logs.map((log) => {
              const cfg = SEVERITY_CONFIG[log.severity];
              const Icon = cfg.icon;
              return (
                <div key={log._id} className="px-5 py-3.5 flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-xl ${cfg.bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-4 h-4 ${cfg.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-gray-900">{log.description}</p>
                    <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-400">
                      <span>{new Date(log.createdAt).toLocaleString('fr-FR')}</span>
                      <span className="font-mono">{log.type}</span>
                      {log.userEmail && <span>{log.userEmail}</span>}
                      {log.ip && <span className="font-mono">{log.ip}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
