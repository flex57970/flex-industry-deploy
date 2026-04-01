'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, ShieldOff, Trash2, Search, Users } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { usersAPI } from '@/lib/api';

interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export default function AdminUsers() {
  const { token, user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    if (!token) return;
    try {
      const data = (await usersAPI.getAll(token)) as UserData[];
      setUsers(data);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const filtered = users.filter(
    (u) =>
      u.firstName.toLowerCase().includes(search.toLowerCase()) ||
      u.lastName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleRole = async (userId: string, currentRole: string) => {
    if (!token || userId === currentUser?._id) return;
    try {
      await usersAPI.updateRole(userId, currentRole === 'admin' ? 'user' : 'admin', token);
      await fetchUsers();
    } catch {}
  };

  const handleDelete = async (userId: string) => {
    if (!token || userId === currentUser?._id || !confirm('Supprimer cet utilisateur ?')) return;
    try {
      await usersAPI.delete(userId, token);
      await fetchUsers();
    } catch {}
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

  const adminCount = users.filter(u => u.role === 'admin').length;

  return (
    <div className="max-w-[1100px]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Utilisateurs</h1>
          <p className="text-sm text-gray-400 mt-1">
            {users.length} compte{users.length !== 1 ? 's' : ''} — {adminCount} admin{adminCount !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par nom ou email..."
          className="w-full md:w-96 bg-white border border-gray-100 rounded-xl pl-11 pr-4 py-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-gray-900/5 focus:border-gray-200 transition-all"
        />
      </div>

      {/* User list */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Header - Desktop */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 border-b border-gray-50">
          <div className="col-span-4 text-[10px] tracking-[0.12em] uppercase text-gray-300 font-semibold">Utilisateur</div>
          <div className="col-span-3 text-[10px] tracking-[0.12em] uppercase text-gray-300 font-semibold">Email</div>
          <div className="col-span-2 text-[10px] tracking-[0.12em] uppercase text-gray-300 font-semibold">Rôle</div>
          <div className="col-span-2 text-[10px] tracking-[0.12em] uppercase text-gray-300 font-semibold">Inscription</div>
          <div className="col-span-1 text-right text-[10px] tracking-[0.12em] uppercase text-gray-300 font-semibold">Actions</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-gray-50">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-warm)] flex items-center justify-center mx-auto mb-4">
                <Users className="w-5 h-5 text-gray-300" />
              </div>
              <p className="text-[13px] text-gray-400 font-medium">Aucun utilisateur trouvé</p>
            </div>
          ) : (
            filtered.map((user, i) => {
              const isSelf = user._id === currentUser?._id;
              return (
                <motion.div
                  key={user._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="px-5 py-3.5 hover:bg-[var(--color-warm)]/50 transition-colors"
                >
                  {/* Desktop */}
                  <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-4 flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-[var(--color-warm)] flex items-center justify-center shrink-0">
                        <span className="text-[11px] font-semibold text-gray-600">
                          {user.firstName[0]}{user.lastName[0]}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium text-gray-900 truncate">
                          {user.firstName} {user.lastName}
                          {isSelf && <span className="text-[10px] text-gray-300 ml-1.5">(vous)</span>}
                        </p>
                      </div>
                    </div>
                    <div className="col-span-3 text-[13px] text-gray-500 truncate">{user.email}</div>
                    <div className="col-span-2">
                      <span className={`text-[11px] px-2.5 py-1 rounded-lg font-medium ${
                        user.role === 'admin'
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {user.role === 'admin' ? 'Admin' : 'Utilisateur'}
                      </span>
                    </div>
                    <div className="col-span-2 text-[13px] text-gray-400">{formatDate(user.createdAt)}</div>
                    <div className="col-span-1 flex items-center justify-end gap-1">
                      {!isSelf && (
                        <>
                          <button
                            onClick={() => toggleRole(user._id, user.role)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all"
                            title={user.role === 'admin' ? 'Retirer admin' : 'Promouvoir admin'}
                          >
                            {user.role === 'admin' ? <ShieldOff className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Mobile */}
                  <div className="md:hidden flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-9 h-9 rounded-xl bg-[var(--color-warm)] flex items-center justify-center shrink-0">
                        <span className="text-[11px] font-semibold text-gray-600">
                          {user.firstName[0]}{user.lastName[0]}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium text-gray-900 truncate">{user.firstName} {user.lastName}</p>
                        <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] px-2 py-0.5 rounded-lg font-medium ${
                        user.role === 'admin' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {user.role === 'admin' ? 'Admin' : 'User'}
                      </span>
                      {!isSelf && (
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
