'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FileText, Image as ImageIcon, Users, Activity, ArrowRight, ArrowUpRight } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { usersAPI, contentAPI, mediaAPI } from '@/lib/api';

interface DashboardStats {
  users: number;
  content: number;
  media: number;
}

export default function AdminDashboard() {
  const { token, user: currentUser } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({ users: 0, content: 0, media: 0 });
  const [recentUsers, setRecentUsers] = useState<Array<{ _id: string; firstName: string; lastName: string; email: string; role: string; createdAt: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    Promise.all([
      usersAPI.getAll(token),
      contentAPI.getAll(token),
      mediaAPI.getAll(token),
    ]).then(([users, content, media]) => {
      const usersArr = users as Array<{ _id: string; firstName: string; lastName: string; email: string; role: string; createdAt: string }>;
      const contentArr = content as Array<unknown>;
      const mediaArr = media as Array<unknown>;
      setStats({
        users: usersArr.length,
        content: contentArr.length,
        media: mediaArr.length,
      });
      setRecentUsers(usersArr.slice(0, 5));
    }).catch(() => {}).finally(() => setLoading(false));
  }, [token]);

  const statCards = [
    { label: 'Utilisateurs', value: stats.users, icon: Users, color: 'bg-blue-50 text-blue-600', href: '/admin/utilisateurs' },
    { label: 'Contenus', value: stats.content, icon: FileText, color: 'bg-violet-50 text-violet-600', href: '/admin/contenus' },
    { label: 'Médias', value: stats.media, icon: ImageIcon, color: 'bg-emerald-50 text-emerald-600', href: '/admin/medias' },
    { label: 'Pages actives', value: 4, icon: Activity, color: 'bg-amber-50 text-amber-600', href: '/admin/contenus' },
  ];

  const quickActions = [
    { label: 'Gérer les contenus', desc: 'Ajouter ou modifier les médias des pages', href: '/admin/contenus', icon: FileText },
    { label: 'Bibliothèque médias', desc: 'Uploader et organiser vos fichiers', href: '/admin/medias', icon: ImageIcon },
    { label: 'Gérer les utilisateurs', desc: 'Rôles, permissions et accès', href: '/admin/utilisateurs', icon: Users },
  ];

  return (
    <div className="max-w-[1100px]">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10"
      >
        <h1 className="text-2xl font-semibold tracking-tight">
          Bonjour, {currentUser?.firstName}
        </h1>
        <p className="text-sm text-gray-400 mt-2">Voici un aperçu de votre espace.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
            >
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
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="lg:col-span-2"
        >
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-[13px] font-semibold text-gray-900 mb-5">Actions rapides</h2>
            <div className="space-y-2.5">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--color-warm)] transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[var(--color-warm)] flex items-center justify-center shrink-0 group-hover:bg-white transition-colors">
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
        </motion.div>

        {/* Recent Users */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="lg:col-span-3"
        >
          <div className="bg-white rounded-2xl border border-gray-100">
            <div className="px-5 py-4 flex items-center justify-between border-b border-gray-50">
              <h2 className="text-[13px] font-semibold text-gray-900">Derniers inscrits</h2>
              <Link href="/admin/utilisateurs" className="text-[12px] text-gray-400 hover:text-gray-600 transition-colors font-medium">
                Voir tout
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {loading ? (
                <div className="px-5 py-10 text-center">
                  <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin mx-auto" />
                </div>
              ) : recentUsers.length === 0 ? (
                <div className="px-5 py-10 text-center text-[13px] text-gray-400">
                  Aucun utilisateur inscrit.
                </div>
              ) : (
                recentUsers.map((user) => (
                  <div key={user._id} className="px-5 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-[var(--color-warm)] flex items-center justify-center shrink-0">
                        <span className="text-[11px] font-semibold text-gray-600">
                          {user.firstName[0]}{user.lastName[0]}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium text-gray-900 truncate">{user.firstName} {user.lastName}</p>
                        <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
                      </div>
                    </div>
                    <span className={`text-[11px] px-2.5 py-1 rounded-lg font-medium shrink-0 ${
                      user.role === 'admin'
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
