import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const iconSize = size === 'sm' ? 28 : size === 'lg' ? 46 : 36;

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Intertwined 'CA' Monogram SVG */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 hover:scale-105"
        id="cara-brand-logo-svg"
      >
        <defs>
          {/* Platinum / Silver Sheen Linear Gradient */}
          <linearGradient id="silverSheen" x1="10%" y1="0%" x2="90%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="25%" stopColor="#c8c8cf" />
            <stop offset="50%" stopColor="#e8e8ed" />
            <stop offset="75%" stopColor="#9a9aa5" />
            <stop offset="100%" stopColor="#f4f4f7" />
          </linearGradient>
          {/* Subtle Outer Glow */}
          <filter id="silverGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#ffffff" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Outer Circular Ring Accent (Hairline) */}
        <circle
          cx="50"
          cy="50"
          r="46"
          stroke="url(#silverSheen)"
          strokeWidth="1.2"
          strokeDasharray="2 4"
          opacity="0.4"
        />

        {/* Geometric Interlocking C & A */}
        {/* The 'C' Arc wrapping around */}
        <path
          d="M 66 26 C 36 14, 18 32, 18 50 C 18 68, 36 86, 66 74"
          stroke="url(#silverSheen)"
          strokeWidth="6.5"
          strokeLinecap="round"
          filter="url(#silverGlow)"
        />

        {/* The 'A' Apex & Crossbar intertwined with 'C' */}
        {/* Left leg of A */}
        <path
          d="M 50 18 L 32 80"
          stroke="url(#silverSheen)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Right leg of A */}
        <path
          d="M 50 18 L 68 80"
          stroke="url(#silverSheen)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Crossbar of A weaving under and over */}
        <path
          d="M 38 56 L 62 56"
          stroke="#ffffff"
          strokeWidth="4.5"
          strokeLinecap="round"
        />

        {/* Center Diamond / Star Accent */}
        <polygon points="50,14 52,18 50,22 48,18" fill="#ffffff" opacity="0.9" />
      </svg>

      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className={`font-brand font-bold tracking-[0.25em] text-white ${
              size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-lg'
            }`}
          >
            CARA
          </span>
          <span
            className={`tracking-[0.35em] text-zinc-400 uppercase font-light ${
              size === 'sm' ? 'text-[9px]' : size === 'lg' ? 'text-[11px]' : 'text-[10px]'
            }`}
          >
            Silver Jewelry
          </span>
        </div>
      )}
    </div>
  );
};
