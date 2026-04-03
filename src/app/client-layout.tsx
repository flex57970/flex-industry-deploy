'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/lib/auth-context';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Loader from '@/components/animations/Loader';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const [ready, setReady] = useState(false);

  // Signal that client JS is loaded — enables CSS animations safely
  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <AuthProvider>
      <Loader />
      <div className={ready ? 'app-ready' : ''}>
        {!isAdmin && <Navbar />}
        <main className="min-h-screen">{children}</main>
        {!isAdmin && <Footer />}
      </div>
    </AuthProvider>
  );
}
