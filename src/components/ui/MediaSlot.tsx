'use client';

import { useRef, useState, useEffect, useCallback } from 'react';

interface MediaSlotProps {
  url: string | null;
  type: 'image' | 'video' | null;
  placeholder?: string;
  className?: string;
  overlay?: boolean;
  alt?: string;
}

/**
 * Detect if the browser likely supports .mov (QuickTime) video.
 * Only Safari (macOS & iOS) reliably supports it.
 */
function canPlayMov(): boolean {
  if (typeof window === 'undefined') return false;
  const video = document.createElement('video');
  // canPlayType returns '', 'maybe', or 'probably'
  const result = video.canPlayType('video/quicktime');
  return result === 'probably' || result === 'maybe';
}

/**
 * Check if a URL points to a .mov file
 */
function isMovFile(url: string): boolean {
  return /\.mov(\?|$)/i.test(url);
}

export default function MediaSlot({
  url,
  type,
  placeholder = 'Ajouter un média',
  className = '',
  overlay = false,
  alt = '',
}: MediaSlotProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [movUnsupported, setMovUnsupported] = useState(false);

  // Reset errors when URL changes
  useEffect(() => {
    setVideoError(false);
    setImgError(false);
    setMovUnsupported(false);
  }, [url]);

  // Check .mov support on mount
  useEffect(() => {
    if (type === 'video' && url && isMovFile(url) && !canPlayMov()) {
      setMovUnsupported(true);
    }
  }, [type, url]);

  // Attempt to play video (with retry for mobile)
  const handleCanPlay = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.play().catch(() => {
      // Autoplay blocked — OK on mobile
    });
  }, []);

  useEffect(() => {
    if (type !== 'video' || !videoRef.current || videoError || movUnsupported) return;
    const video = videoRef.current;

    video.addEventListener('canplay', handleCanPlay);
    if (video.readyState >= 3) handleCanPlay();

    return () => video.removeEventListener('canplay', handleCanPlay);
  }, [type, url, videoError, movUnsupported, handleCanPlay]);

  if (!url) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 text-gray-400 text-sm ${className}`}>
        {placeholder}
      </div>
    );
  }

  // .mov not supported on this browser → show fallback
  if (type === 'video' && movUnsupported) {
    return (
      <div className={`relative overflow-hidden bg-gray-900 ${className}`}>
        <div className="w-full h-full flex flex-col items-center justify-center gap-3 px-4">
          {/* Play icon */}
          <svg className="w-12 h-12 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
          </svg>
          <span className="text-white/30 text-xs text-center">Vidéo disponible sur ordinateur</span>
        </div>
        {overlay && <div className="absolute inset-0 bg-black/40" />}
      </div>
    );
  }

  // Video error → show fallback
  if (type === 'video' && videoError) {
    return (
      <div className={`relative overflow-hidden bg-gray-900 ${className}`}>
        <div className="w-full h-full flex flex-col items-center justify-center gap-3 px-4">
          <svg className="w-12 h-12 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
          </svg>
          <span className="text-white/30 text-xs text-center">Vidéo non disponible</span>
        </div>
        {overlay && <div className="absolute inset-0 bg-black/40" />}
      </div>
    );
  }

  if (type === 'video') {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onError={() => setVideoError(true)}
          aria-label={alt || 'Vidéo'}
        >
          {/* Provide both source types for better compatibility */}
          <source src={url} type={isMovFile(url) ? 'video/quicktime' : 'video/mp4'} />
        </video>
        {overlay && <div className="absolute inset-0 bg-black/40" />}
      </div>
    );
  }

  // Image with error handling
  if (imgError) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
          Image non disponible
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={url}
        alt={alt || 'Image'}
        className="w-full h-full object-cover"
        loading="lazy"
        onError={() => setImgError(true)}
      />
      {overlay && <div className="absolute inset-0 bg-black/40" />}
    </div>
  );
}
