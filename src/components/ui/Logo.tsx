'use client';

interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Logo({ variant = 'dark', size = 'md', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const color = variant === 'dark' ? 'text-[#09090b]' : 'text-white';

  return (
    <span className={`${sizeClasses[size]} tracking-tight select-none ${color} ${className}`}>
      <span className="font-bold">Flex</span>
      <span className="text-[#c8a97e]">.</span>
      <span className="font-light">industry</span>
    </span>
  );
}
