'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Inbox, Mail, Image as ImageIcon, FileText, Activity, Zap, FolderOpen, Users,
  ArrowUpRight, ArrowRight, TrendingUp, AlertTriangle, Sparkles, CheckCircle2, Clock
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { leadsAPI, subscribersAPI, activityAPI, automationsAPI, mediaAPI } from '@/lib/api';

interface Lead {
  _id: string;
  name: string;
  email: string;
  service: string;
  status: string;
  createdAt: string;
}
interface Log {
  _id: string;
  type: string;
  severity: 'info' | 'warning' | 'critical';
  description: string;
  createdAt: string;
}
interface Automation {
  _id: string;
  key: string;
  name: string;
  enabled: boolean;
  lastRunAt?: string;
  lastRunStatus?: 'success' | 'error';
}

export default function AdminDashboard() {
  const { token, user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [mediaCount, setMediaCount] = useState(0);
  const [recentLogs, setRecentLogs] = useState<Log[]>([]);
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    Promise.all([
      leadsAPI.getAll(token),
      subscribersAPI.getAll(token),
      mediaAPI.getAll(token),
      activityAPI.getAll(token, { limit: 8 }),
      automationsAPI.getAll(token),
    ]).then(([l, s, m, a, auto]) => {
      setLeads(l as Lead[]);
      setSubscribersCount((s as Array<unknown>).length);
      setMediaCount((m as Array<unknown>).length);
      setRecentLogs(a as Log[]);
      setAutomations(auto as Automation[]);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [token]);

  // Auto-refresh every 30s
  useEffect(() => {
    if (!token) return;
    const interval = setInterval(() => {
      Promise.all([
        leadsAPI.getAll(token),
        activityAPI.getAll(token, { limit: 8 }),
      ]).then(([l, a]) => {
        setLeads(l as Lead[]);
        setRecentLogs(a as Log[]);
      }).catch(() => {});
    }, 30000);
    return () => clearInterval(interval);
  }, [token]);

  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const newLeads7 = leads.filter((l) => new Date(l.createdAt).getTime() > sevenDaysAgo).length;
  const newLeadsStatus = leads.filter((l) => l.status === 'nouveau').length;
  const criticalAlerts = recentLogs.filter((l) => l.severity === 'critical' || l.severity === 'warning').length;
  const activeAutomations = automations.filter((a) => a.enabled).length;

  const stats = [
    {
      label: 'Leads cette semaine',
      value: newLeads7,
      sublabel: `${newLeadsStatus} à traiter`,
      icon: Inbox,
      color: 'bg-blue-50 text-blue-600',
      href: '/admin/leads',
    },
    {
      label: 'Abonnés newsletter',
      value: subscribersCount,
      sublabel: 'Actifs',
      icon: Mail,
      color: 'bg-emerald-50 text-emerald-600',
      href: '/admin/abonnes',
    },
    {
      label: 'Médias',
      value: mediaCount,
      sublabel: 'Bibliothèque',
      icon: ImageIcon,
      color: 'bg-violet-50 text-violet-600',
      href: '/admin/medias',
    },
    {
      label: 'Automations actives',
      value: activeAutomations,
      sublabel: `${automations.length - activeAutomations} désactivées`,
      icon: Zap,
      color: 'bg-amber-50 text-amber-600',
      href: '/admin/automations',
    },
  ];

  const quickActions = [
    { label: 'Nouvelle catégorie portfolio', desc: 'Créer un projet — notif auto aux abonnés', href: '/admin/portfolio', icon: FolderOpen },
    { label: 'Modifier les contenus', desc: 'Mettre à jour les médias des pages', href: '/admin/contenus', icon: FileText },
    { label: 'Gérer les utilisateurs', desc: 'Rôles et permissions', href: '/admin/utilisateurs', icon: Users },
  ];

  return (
    <div className="max-w-[1200px]">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-10">
        <h1 className="text-2xl font-semibold tracking-tight">
          Bonjour {user?.firstName || ''} 👋
        </h1>
        <p className="text-sm text-gray-400 mt-2">
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} · Voici l&apos;état de votre écosystème.
        </p>
      </motion.div>

      {/* Critical alerts banner */}
      {criticalAlerts > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-semibold text-red-900">{criticalAlerts} alerte{criticalAlerts > 1 ? 's' : ''} à examiner</p>
            <p className="text-[12px] text-red-700 mt-0.5">Consultez le journal d&apos;activité pour plus de détails.</p>
          </div>
          <Link href="/admin/activite" className="text-[12px] font-medium text-red-600 hover:text-red-800 shrink-0 flex items-center gap-1">
            Voir <ArrowRight className="w-3 h-3" />
          </Link>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06, duration: 0.4 }}>
              <Link href={card.href} className="block bg-white rounded-2xl border border-gray-100 p-6 hover:border-gray-200 hover:shadow-sm transition-all duration-200 group">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-9 h-9 rounded-xl ${card.color} flex items-center justify-center`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className={`text-2xl font-semibold tracking-tight ${loading ? 'text-gray-200' : ''}`}>
                  {loading ? '—' : card.value}
                </p>
                <p className="text-[13px] text-gray-400 mt-0.5">{card.label}</p>
                <p className="text-[11px] text-gray-300 mt-1">{card.sublabel}</p>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent Leads */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }} className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 flex items-center justify-between border-b border-gray-50">
              <h2 className="text-[13px] font-semibold text-gray-900 flex items-center gap-2">
                <Inbox className="w-3.5 h-3.5 text-gray-400" />
                Derniers leads
              </h2>
              <Link href="/admin/leads" className="text-[12px] text-gray-400 hover:text-gray-600 transition-colors font-medium flex items-center gap-1">
                Tout voir <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {loading ? (
                <div className="px-5 py-10 text-center">
                  <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin mx-auto" />
                </div>
              ) : leads.length === 0 ? (
                <div className="px-5 py-10 text-center text-[13px] text-gray-400">
                  Aucun lead pour le moment.
                </div>
              ) : (
                leads.slice(0, 6).map((lead) => (
                  <Link key={lead._id} href={`/admin/leads`} className="px-5 py-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-medium text-gray-900 truncate">{lead.name}</p>
                      <p className="text-[11px] text-gray-400 truncate">{lead.service} · {lead.email}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-3">
                      <span className="text-[11px] text-gray-400">{new Date(lead.createdAt).toLocaleDateString('fr-FR')}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-lg font-medium ${
                        lead.status === 'nouveau' ? 'bg-blue-50 text-blue-600' :
                        lead.status === 'contacte' ? 'bg-amber-50 text-amber-600' :
                        lead.status === 'devis' ? 'bg-violet-50 text-violet-600' :
                        lead.status === 'gagne' ? 'bg-emerald-50 text-emerald-600' :
                        'bg-gray-100 text-gray-400'
                      }`}>
                        {lead.status}
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </motion.div>

        {/* Live activity */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.4 }} className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden h-full">
            <div className="px-5 py-4 flex items-center justify-between border-b border-gray-50">
              <h2 className="text-[13px] font-semibold text-gray-900 flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-gray-400" />
                Activité en temps réel
              </h2>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="divide-y divide-gray-50 max-h-[340px] overflow-y-auto">
              {loading ? (
                <div className="px-5 py-10 text-center">
                  <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin mx-auto" />
                </div>
              ) : recentLogs.length === 0 ? (
                <div className="px-5 py-10 text-center text-[13px] text-gray-400">
                  Aucune activité récente.
                </div>
              ) : (
                recentLogs.map((log) => (
                  <div key={log._id} className="px-5 py-3">
                    <div className="flex items-start gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                        log.severity === 'critical' ? 'bg-red-500' :
                        log.severity === 'warning' ? 'bg-amber-500' :
                        'bg-gray-300'
                      }`} />
                      <div className="min-w-0 flex-1">
                        <p className="text-[12px] text-gray-700 leading-snug">{log.description}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {new Date(log.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Automations + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4 }} className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 flex items-center justify-between border-b border-gray-50">
              <h2 className="text-[13px] font-semibold text-gray-900 flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-gray-400" />
                Agents automatiques
              </h2>
              <Link href="/admin/automations" className="text-[12px] text-gray-400 hover:text-gray-600 transition-colors font-medium flex items-center gap-1">
                Gérer <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {automations.slice(0, 5).map((auto) => (
                <div key={auto._id} className="px-5 py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-2 h-2 rounded-full ${auto.enabled ? 'bg-emerald-500' : 'bg-gray-300'} shrink-0`} />
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-gray-900">{auto.name}</p>
                      {auto.lastRunAt && (
                        <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                          {auto.lastRunStatus === 'success' ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Clock className="w-3 h-3 text-gray-300" />}
                          Dernière exécution : {new Date(auto.lastRunAt).toLocaleString('fr-FR')}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-lg font-medium shrink-0 ml-3 ${
                    auto.enabled ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {auto.enabled ? 'Actif' : 'Off'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.4 }} className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="text-[13px] font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-gray-400" />
              Actions rapides
            </h2>
            <div className="space-y-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 group-hover:bg-white transition-colors">
                      <Icon className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-gray-900">{action.label}</p>
                      <p className="text-[11px] text-gray-400 truncate">{action.desc}</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100 p-5 mt-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <h3 className="text-[13px] font-semibold">Agent IA</h3>
            </div>
            <p className="text-[12px] text-gray-600 mb-3">Obtenez des suggestions SEO personnalisées par Claude pour booster votre référencement.</p>
            <Link href="/admin/automations" className="text-[11px] font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-1">
              Consulter <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
