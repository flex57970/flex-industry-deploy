'use client';

interface MediaSlotProps {
  url: string | null;
  type: 'image' | 'video' | null;
  placeholder?: string;
  className?: string;
  overlay?: boolean;
  alt?: string;
}

export default function MediaSlot({
  url,
  type,
  placeholder = 'Ajouter un média',
  className = '',
  overlay = false,
  alt = '',
}: MediaSlotProps) {
  if (!url) {
    return (
      <div className={`media-placeholder ${className}`}>
        {placeholder}
      </div>
    );
  }

  if (type === 'video') {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <video
          src={url}
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          aria-label={alt || undefined}
        />
        {overlay && <div className="absolute inset-0 bg-black/40" />}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={url}
        alt={alt}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      {overlay && <div className="absolute inset-0 bg-black/40" />}
    </div>
  );
}
