'use client';

import { useState, useEffect, useCallback } from 'react';
import { BarChart3, TrendingUp, Users, Eye, Smartphone, Monitor, Globe, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { analyticsAPI } from '@/lib/api';

interface Stats {
  summary: {
    totalVisits: number;
    uniqueVisitors: number;
    todayVisits: number;
    yesterdayVisits: number;
    avgPerDay: number;
  };
  visitsByDay: { date: string; visits: number; uniqueVisitors: number }[];
  topPages: { path: string; visits: number; unique: number }[];
  topReferrers: { domain: string; visits: number; unique: number }[];
  deviceBreakdown: { device: string; count: number }[];
}

export default function AdminAnalytics() {
  const { token } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState(30);

  const fetchStats = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = (await analyticsAPI.getStats(token, range)) as Stats;
      setStats(data);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [token, range]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  // Auto-refresh every 60s
  useEffect(() => {
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  const dayDelta = stats
    ? stats.summary.todayVisits - stats.summary.yesterdayVisits
    : 0;
  const dayDeltaPercent = stats && stats.summary.yesterdayVisits > 0
    ? Math.round(((stats.summary.todayVisits - stats.summary.yesterdayVisits) / stats.summary.yesterdayVisits) * 100)
    : 0;

  // Compute max for chart scaling
  const maxVisits = stats && stats.visitsByDay.length > 0
    ? Math.max(...stats.visitsByDay.map((d) => d.visits))
    : 1;

  const totalDevices = stats?.deviceBreakdown.reduce((s, d) => s + d.count, 0) || 1;

  return (
    <div className="max-w-[1200px]">
      <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-gray-400" />
            Statistiques
          </h1>
          <p className="text-sm text-gray-400 mt-2">Visiteurs anonymisés (RGPD-compliant) — pas de cookies, pas de tracking externe.</p>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-100 p-1">
          {[7, 30, 90, 365].map((d) => (
            <button
              key={d}
              onClick={() => setRange(d)}
              className={`text-[12px] px-3 py-1.5 rounded-lg font-medium transition-all ${
                range === d ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {d === 7 ? '7 jours' : d === 30 ? '30 jours' : d === 90 ? '3 mois' : '1 an'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin" />
        </div>
      ) : !stats || stats.summary.totalVisits === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 text-center py-20 px-6">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-5">
            <Eye className="w-6 h-6 text-gray-300" />
          </div>
          <p className="text-[14px] text-gray-500 font-medium mb-2">Aucune visite enregistrée</p>
          <p className="text-[13px] text-gray-400 max-w-md mx-auto">
            Les statistiques se rempliront automatiquement à chaque visite sur le site public.
            Patientez quelques minutes ou ouvrez votre site dans un onglet privé pour tester.
          </p>
        </div>
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Eye className="w-3.5 h-3.5 text-blue-600" />
                </div>
              </div>
              <p className="text-2xl font-semibold tracking-tight">{stats.summary.totalVisits.toLocaleString('fr-FR')}</p>
              <p className="text-[12px] text-gray-400 mt-0.5">Visites totales</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                </div>
              </div>
              <p className="text-2xl font-semibold tracking-tight">{stats.summary.uniqueVisitors.toLocaleString('fr-FR')}</p>
              <p className="text-[12px] text-gray-400 mt-0.5">Visiteurs uniques</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                </div>
                {dayDelta !== 0 && (
                  <span className={`text-[10px] font-semibold flex items-center gap-0.5 ${
                    dayDelta > 0 ? 'text-emerald-600' : 'text-red-500'
                  }`}>
                    {dayDelta > 0 ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                    {Math.abs(dayDeltaPercent)}%
                  </span>
                )}
              </div>
              <p className="text-2xl font-semibold tracking-tight">{stats.summary.todayVisits}</p>
              <p className="text-[12px] text-gray-400 mt-0.5">Aujourd&apos;hui</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center">
                  <BarChart3 className="w-3.5 h-3.5 text-violet-600" />
                </div>
              </div>
              <p className="text-2xl font-semibold tracking-tight">{stats.summary.avgPerDay}</p>
              <p className="text-[12px] text-gray-400 mt-0.5">Moyenne / jour</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center">
                  <Globe className="w-3.5 h-3.5 text-gray-600" />
                </div>
              </div>
              <p className="text-2xl font-semibold tracking-tight">{stats.summary.yesterdayVisits}</p>
              <p className="text-[12px] text-gray-400 mt-0.5">Hier</p>
            </div>
          </div>

          {/* Daily chart */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[13px] font-semibold text-gray-900">Visites quotidiennes</h2>
              <div className="flex items-center gap-3 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-gray-900" />
                  <span className="text-gray-500">Visites</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-gray-500">Uniques</span>
                </div>
              </div>
            </div>
            <div className="flex items-end gap-1 h-48 overflow-x-auto">
              {stats.visitsByDay.map((d) => {
                const visitHeight = (d.visits / maxVisits) * 100;
                const uniqueHeight = (d.uniqueVisitors / maxVisits) * 100;
                const date = new Date(d.date);
                return (
                  <div key={d.date} className="flex-1 min-w-[20px] flex flex-col items-center gap-1 group relative">
                    <div className="absolute -top-12 hidden group-hover:block bg-gray-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
                      <p className="font-semibold">{d.visits} visites</p>
                      <p className="opacity-75">{d.uniqueVisitors} unique{d.uniqueVisitors > 1 ? 's' : ''}</p>
                    </div>
                    <div className="w-full flex items-end justify-center gap-0.5 h-40">
                      <div
                        className="w-1/2 bg-gray-900 rounded-t hover:bg-gray-700 transition-colors min-h-[2px]"
                        style={{ height: `${visitHeight}%` }}
                      />
                      <div
                        className="w-1/2 bg-emerald-500 rounded-t hover:bg-emerald-400 transition-colors min-h-[2px]"
                        style={{ height: `${uniqueHeight}%` }}
                      />
                    </div>
                    <span className="text-[9px] text-gray-300 font-mono">
                      {date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top pages */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50">
                <h2 className="text-[13px] font-semibold text-gray-900">Pages les plus visitées</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {stats.topPages.length === 0 ? (
                  <p className="px-5 py-8 text-[13px] text-gray-400 text-center">Aucune donnée</p>
                ) : (
                  stats.topPages.map((p) => {
                    const max = Math.max(...stats.topPages.map((tp) => tp.visits));
                    const pct = (p.visits / max) * 100;
                    return (
                      <div key={p.path} className="px-5 py-3.5 relative">
                        <div className="absolute inset-0 bg-blue-50/40" style={{ width: `${pct}%` }} />
                        <div className="relative flex items-center justify-between">
                          <p className="text-[13px] font-medium text-gray-900 truncate flex-1 pr-3">{p.path}</p>
                          <div className="flex items-center gap-3 shrink-0 text-[11px] text-gray-500">
                            <span><strong className="text-gray-900">{p.visits}</strong> vues</span>
                            <span><strong className="text-gray-700">{p.unique}</strong> unique{p.unique > 1 ? 's' : ''}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Top referrers */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50">
                <h2 className="text-[13px] font-semibold text-gray-900">Sources de trafic</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {stats.topReferrers.length === 0 ? (
                  <p className="px-5 py-8 text-[13px] text-gray-400 text-center">Aucun referrer enregistré (trafic direct uniquement)</p>
                ) : (
                  stats.topReferrers.map((r) => {
                    const max = Math.max(...stats.topReferrers.map((tr) => tr.visits));
                    const pct = (r.visits / max) * 100;
                    return (
                      <div key={r.domain} className="px-5 py-3.5 relative">
                        <div className="absolute inset-0 bg-emerald-50/40" style={{ width: `${pct}%` }} />
                        <div className="relative flex items-center justify-between">
                          <p className="text-[13px] font-medium text-gray-900 truncate flex-1 pr-3">{r.domain}</p>
                          <div className="flex items-center gap-3 shrink-0 text-[11px] text-gray-500">
                            <span><strong className="text-gray-900">{r.visits}</strong></span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Devices */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-[13px] font-semibold text-gray-900 mb-4">Appareils</h2>
              <div className="space-y-3">
                {stats.deviceBreakdown.map((d) => {
                  const pct = Math.round((d.count / totalDevices) * 100);
                  const Icon = d.device === 'mobile' ? Smartphone : d.device === 'tablet' ? Smartphone : d.device === 'bot' ? Globe : Monitor;
                  return (
                    <div key={d.device}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <Icon className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-[13px] text-gray-700 capitalize">{d.device}</span>
                        </div>
                        <span className="text-[11px] text-gray-500">{d.count} ({pct}%)</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${
                          d.device === 'mobile' ? 'bg-blue-500' :
                          d.device === 'tablet' ? 'bg-violet-500' :
                          d.device === 'desktop' ? 'bg-emerald-500' :
                          'bg-gray-300'
                        }`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Privacy info */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 p-6">
              <h2 className="text-[13px] font-semibold text-gray-900 mb-2">🔒 Respect de la vie privée</h2>
              <ul className="text-[12px] text-gray-600 space-y-1.5">
                <li>✓ Aucun cookie de tracking</li>
                <li>✓ IP anonymisée (hash quotidien irréversible)</li>
                <li>✓ Pas de service externe (Google Analytics etc.)</li>
                <li>✓ Conservation 1 an max (auto-suppression)</li>
                <li>✓ Bots automatiquement filtrés</li>
                <li>✓ Pages /admin exclues</li>
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
