'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Composant invisible qui track chaque navigation côté client.
 * RGPD-friendly : pas de cookies, IP hashée par jour, bots ignorés, /admin exclu.
 */
export default function Tracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    // Skip admin et auth pages
    if (
      pathname.startsWith('/admin') ||
      pathname.startsWith('/api') ||
      pathname.startsWith('/connexion') ||
      pathname.startsWith('/inscription')
    ) {
      return;
    }

    // Session ID en sessionStorage (efface à la fermeture de l'onglet)
    let sessionId = '';
    try {
      sessionId = sessionStorage.getItem('flex-session') || '';
      if (!sessionId) {
        sessionId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
        sessionStorage.setItem('flex-session', sessionId);
      }
    } catch {
      // Mode privé : sessionStorage indisponible, on continue sans
    }

    // Délai léger pour éviter de tracker les rebonds instantanés
    const timeout = setTimeout(() => {
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: pathname,
          referrer: document.referrer,
          sessionId,
        }),
        keepalive: true,
      }).catch(() => {
        // Silencieux - ne casse jamais le site
      });
    }, 1500);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return null;
}
