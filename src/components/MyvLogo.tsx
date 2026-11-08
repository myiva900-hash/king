import React from 'react';

interface MyvLogoProps {
  className?: string;
  size?: number;
  monochrome?: boolean;
}

export const MyvLogo: React.FC<MyvLogoProps> = ({ className = '', size = 36, monochrome = false }) => {
  return (
    <div 
      className={`relative flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
      aria-label="Mutiganda Yvan VPN Logo"
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm select-none"
      >
        <defs>
          <linearGradient id="myvRoyalGrad" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
            <stop stopColor={monochrome ? '#ffffff' : '#0284c7'} />
            <stop offset="1" stopColor={monochrome ? '#ffffff' : '#1e3a8a'} />
          </linearGradient>
        </defs>

        {/* Shield base */}
        <path
          d="M50 6 L86 20 C86 58 50 88 50 88 C50 88 14 58 14 20 L50 6 Z"
          fill={monochrome ? 'transparent' : 'url(#myvRoyalGrad)'}
          stroke={monochrome ? '#ffffff' : '#0369a1'}
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Inner shield highlight */}
        <path
          d="M50 14 L78 25 C78 54 50 78 50 78 C50 78 22 54 22 25 L50 14 Z"
          fill={monochrome ? 'rgba(255,255,255,0.15)' : '#ffffff'}
          opacity={monochrome ? 0.3 : 0.96}
        />

        {/* Stylized MYV Monogram in Royal Blue */}
        <g fill={monochrome ? '#ffffff' : '#1e3a8a'}>
          {/* Letter M */}
          <path
            d="M30 35 L35 35 L43 51 L51 35 L56 35 L56 59 L51.5 59 L51.5 44 L44.8 57 L41.2 57 L34.5 44 L34.5 59 L30 59 Z"
            fillRule="evenodd"
          />
          {/* Subtle Y & V dynamic accent wings */}
          <path
            d="M50 56 L62 38 L68 38 L54 62 L46 62 L50 56 Z"
            opacity={0.9}
          />
          <path
            d="M60 48 L65 40 L70 40 L62 53 Z"
            opacity={0.8}
          />
        </g>

        {/* Sun Gold Center Lock / Spark (Rwanda sun motif) */}
        <circle cx="50" cy="70" r="3.5" fill={monochrome ? '#ffffff' : '#f59e0b'} />
      </svg>
    </div>
  );
};
