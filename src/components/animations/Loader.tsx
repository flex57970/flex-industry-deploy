'use client';

import { useEffect, useState } from 'react';

export default function Loader() {
  const [hidden, setHidden] = useState(false);

  // Safety timeout: remove loader after 3s no matter what
  useEffect(() => {
    const timer = setTimeout(() => setHidden(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (hidden) return null;

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
