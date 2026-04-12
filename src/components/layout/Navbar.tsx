'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, ArrowUpRight } from 'lucide-react';
import Logo from '../ui/Logo';
import { useAuth } from '@/lib/auth-context';

const categories = [
  { name: 'Immobilier', href: '/immobilier', desc: 'Propriétés de prestige' },
  { name: 'Automobile', href: '/automobile', desc: 'Performance & design' },
  { name: 'Parfumerie', href: '/parfumerie', desc: 'L\'art de la séduction' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout, isAdmin } = useAuth();

  const isHeroPage = pathname === '/' || ['/immobilier', '/automobile', '/parfumerie', '/contact', '/portfolio'].includes(pathname) || pathname.startsWith('/portfolio/');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  const showLight = isHeroPage && !isScrolled;
  const textColor = showLight ? 'text-white/90' : 'text-gray-700';
  const textActiveColor = showLight ? 'text-white' : 'text-gray-900';
  const logoVariant = showLight ? 'light' : 'dark';

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/80 backdrop-blur-2xl border-b border-gray-100 shadow-[0_1px_2px_rgba(0,0,0,0.03)]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1200px] mx-auto container-px">
          <div className="flex items-center justify-between h-16 md:h-[72px]">
            <Link href="/" className="relative z-10">
              <Logo variant={logoVariant} size="md" />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              <Link
                href="/"
                className={`px-4 py-2 text-[13px] font-medium rounded-full transition-all duration-300 ${
                  pathname === '/' ? textActiveColor : `${textColor} hover:${textActiveColor}`
                }`}
              >
                Accueil
              </Link>

              <div
                className="relative"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <button
                  className={`flex items-center gap-1 px-4 py-2 text-[13px] font-medium rounded-full transition-all duration-300 ${
                    categories.some(c => pathname === c.href) ? textActiveColor : textColor
                  }`}
                >
                  Expertises
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <div
                  className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 transition-all duration-200 ${
                    isDropdownOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-1 pointer-events-none'
                  }`}
                >
                  <div className="bg-white rounded-2xl shadow-xl shadow-black/[0.06] border border-gray-100 p-2 min-w-[240px]">
                    {categories.map((cat) => (
                      <Link
                        key={cat.href}
                        href={cat.href}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                          pathname === cat.href
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <div>
                          <div className="text-[13px] font-medium">{cat.name}</div>
                          <div className="text-[11px] mt-0.5 text-gray-400">
                            {cat.desc}
                          </div>
                        </div>
                        <ArrowUpRight className={`w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0 transition-all ${
                          pathname === cat.href ? 'text-white' : ''
                        }`} />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <Link
                href="/portfolio"
                className={`px-4 py-2 text-[13px] font-medium rounded-full transition-all duration-300 ${
                  pathname.startsWith('/portfolio') ? textActiveColor : textColor
                }`}
              >
                Portfolio
              </Link>

              <Link
                href="/contact"
                className={`px-4 py-2 text-[13px] font-medium rounded-full transition-all duration-300 ${
                  pathname === '/contact' ? textActiveColor : textColor
                }`}
              >
                Contact
              </Link>

              <div className="w-[1px] h-5 bg-current opacity-10 mx-2" />

              {user ? (
                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className={`px-4 py-2 text-[13px] font-medium rounded-full transition-all duration-300 ${textColor}`}
                    >
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className={`px-4 py-2 text-[13px] font-medium rounded-full transition-all duration-300 ${textColor}`}
                  >
                    Déconnexion
                  </button>
                  <div className="w-8 h-8 rounded-full bg-[var(--color-accent)] flex items-center justify-center ml-1">
                    <span className="text-white text-[11px] font-semibold">
                      {(user.firstName || '')[0]}{(user.lastName || '')[0]}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/connexion"
                    className={`px-4 py-2 text-[13px] font-medium rounded-full transition-all duration-300 ${textColor}`}
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/contact"
                    className="bg-gray-900 text-white text-[13px] px-5 py-2.5 rounded-full hover:bg-gray-800 transition-all duration-300 font-medium"
                  >
                    Nous contacter
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-label={isMobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={isMobileOpen}
              className={`lg:hidden relative z-10 w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
                isMobileOpen ? 'text-gray-900 bg-gray-100' : `${textColor}`
              }`}
            >
              {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu — pure CSS transition, no Framer Motion */}
      <div
        className={`fixed inset-0 z-40 bg-white transition-all duration-300 ${
          isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col h-full pt-24 pb-10 px-8">
          <div className="flex-1 flex flex-col gap-1">
            <Link href="/" className="text-3xl font-light text-gray-900 py-3 border-b border-gray-100">
              Accueil
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="flex items-center justify-between text-3xl font-light text-gray-900 py-3 border-b border-gray-100 group"
              >
                {cat.name}
                <ArrowUpRight className="w-5 h-5 text-gray-300 group-hover:text-[var(--color-accent)] transition-colors" />
              </Link>
            ))}
            <Link href="/portfolio" className="text-3xl font-light text-gray-900 py-3 border-b border-gray-100 block">
              Portfolio
            </Link>
            <Link href="/contact" className="text-3xl font-light text-gray-900 py-3 border-b border-gray-100 block">
              Contact
            </Link>
          </div>

          <div className="pt-6 border-t border-gray-100">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--color-accent)] flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">{(user.firstName || '')[0]}{(user.lastName || '')[0]}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
                {isAdmin && (
                  <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                    Dashboard
                  </Link>
                )}
                <button onClick={logout} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link href="/connexion" className="flex-1 text-center text-sm py-3 rounded-full border border-gray-200 text-gray-700 font-medium">
                  Connexion
                </Link>
                <Link href="/contact" className="flex-1 text-center text-sm py-3 rounded-full bg-gray-900 text-white font-medium">
                  Nous contacter
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
