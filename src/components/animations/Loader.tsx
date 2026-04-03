'use client';

import { useEffect, useState } from 'react';

export default function Loader() {
  const [mounted, setMounted] = useState(false);
  const [hidden, setHidden] = useState(false);

  // Only show loader after client mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Safety timeout: remove loader after 3s no matter what
  useEffect(() => {
    if (!mounted) return;
    const timer = setTimeout(() => setHidden(true), 3000);
    return () => clearTimeout(timer);
  }, [mounted]);

  if (!mounted || hidden) return null;

  return (
    <div
      className="loader-overlay"
      onAnimationEnd={(e) => {
        if (e.animationName === 'loaderFadeOut') setHidden(true);
      }}
    >
      <div className="loader-logo" style={{ marginBottom: 40 }}>
        <span style={{ fontSize: '1.5rem', letterSpacing: '-0.02em', color: 'white' }}>
          <span style={{ fontWeight: 600 }}>Flex</span>
          <span style={{ color: '#b8956a' }}>.</span>
          <span style={{ fontWeight: 300 }}>industry</span>
        </span>
      </div>

      <div style={{ width: 120, height: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden', borderRadius: 1 }}>
        <div className="loader-bar" />
      </div>
    </div>
  );
}
