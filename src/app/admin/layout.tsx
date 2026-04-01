'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import {
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  Users,
  LogOut,
  ArrowLeft,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';

const sidebarLinks = [
  { name: 'Vue d\'ensemble', href: '/admin', icon: LayoutDashboard },
  { name: 'Contenus', href: '/admin/contenus', icon: FileText },
  { name: 'Médias', href: '/admin/medias', icon: ImageIcon },
  { name: 'Utilisateurs', href: '/admin/utilisateurs', icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/connexion');
    }
  }, [user, loading, isAdmin, router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-warm)]">
        <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  const currentPage = sidebarLinks.find((l) => l.href === pathname)?.name || 'Dashboard';

  return (
    <div className="min-h-screen bg-[var(--color-warm)]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        data-open={sidebarOpen}
        className="fixed inset-y-0 left-0 z-50 w-[260px] bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] -translate-x-full data-[open=true]:translate-x-0 lg:translate-x-0"
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-5 shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg tracking-tight">
              <span className="font-semibold">Flex</span>
              <span className="text-[var(--color-accent)]">.</span>
              <span className="font-light">industry</span>
            </span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-50">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          <p className="px-3 text-[10px] tracking-[0.15em] uppercase text-gray-300 mb-3 font-semibold">Menu</p>
          <ul className="space-y-0.5">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-gray-900 text-white shadow-sm'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-[18px] h-[18px] shrink-0" />
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User + Actions */}
        <div className="p-3 border-t border-gray-100 shrink-0 space-y-0.5">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-all duration-200 rounded-xl hover:bg-gray-50"
          >
            <ArrowLeft className="w-[18px] h-[18px] shrink-0" />
            Retour au site
          </Link>
          <button
            onClick={() => { logout(); router.push('/'); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium text-gray-500 hover:text-red-600 transition-all duration-200 rounded-xl hover:bg-red-50"
          >
            <LogOut className="w-[18px] h-[18px] shrink-0" />
            Déconnexion
          </button>

          <div className="mt-2 p-3 rounded-xl bg-[var(--color-warm)] flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gray-900 flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-semibold">
                {user.firstName[0]}{user.lastName[0]}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium text-gray-900 truncate">{user.firstName} {user.lastName}</p>
              <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="min-h-screen flex flex-col" style={{ marginLeft: 'var(--sidebar-width, 0px)' }}>
        {/* Top bar */}
        <header className="h-14 bg-white/80 backdrop-blur-xl border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-[18px] h-[18px]" />
            </button>
            <div className="flex items-center gap-2 text-[13px]">
              <span className="text-gray-400 hidden sm:inline">Admin</span>
              <ChevronRight className="w-3 h-3 text-gray-300 hidden sm:block" />
              <span className="text-gray-900 font-medium">{currentPage}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
