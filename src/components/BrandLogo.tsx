import React, { useState, useId } from 'react';
import defaultLogoAsset from '../assets/images/siam_logo_icon_1791292751153.jpg';

export type BrandLogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface BrandLogoProps {
  className?: string;
  size?: BrandLogoSize;
  showGlow?: boolean;
  alt?: string;
  forceSvg?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showGlow = false,
  alt = 'Siam Downloader Logo',
  forceSvg = false,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [srcIndex, setSrcIndex] = useState(0);

  // Fallback candidate URLs for image loading
  const imageCandidates = [
    defaultLogoAsset,
    '/app-icon.png',
    '/app-icon.jpg',
  ];

  // Unique ID per instance so SVG gradient and filter IDs never collide
  const rawId = useId();
  const id = rawId.replace(/[^a-zA-Z0-9_-]/g, '_');

  // Size configurations
  const dimensions: Record<BrandLogoSize, string> = {
    xs: 'w-7 h-7 rounded-lg',
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-12 h-12 rounded-xl',
    xl: 'w-16 h-16 sm:w-20 sm:h-20 rounded-2xl',
    '2xl': 'w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl',
  };

  const handleImageError = () => {
    if (srcIndex < imageCandidates.length - 1) {
      // Try next candidate image path
      setSrcIndex((prev) => prev + 1);
    } else {
      // All image candidates failed; seamlessly switch to styled SVG
      setHasError(true);
    }
  };

  // Styled SVG Vector Fallback (Emerald jade & gold chrome 'S' with high-speed download arrow)
  const renderSvgFallback = () => (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-full drop-shadow-md select-none pointer-events-none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={alt}
    >
      <defs>
        {/* Squircle gradient */}
        <linearGradient id={`bgGrad_${id}`} x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#064E3B" />
          <stop offset="50%" stopColor="#022C22" />
          <stop offset="100%" stopColor="#091122" />
        </linearGradient>

        {/* Gold chrome trim for 'S' */}
        <linearGradient id={`goldTrim_${id}`} x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="50%" stopColor="#CA8A04" />
          <stop offset="100%" stopColor="#EAB308" />
        </linearGradient>

        {/* Emerald core for 'S' */}
        <linearGradient id={`emeraldBody_${id}`} x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="50%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>

        {/* Arrow glow gradient */}
        <linearGradient id={`arrowGlow_${id}`} x1="50" y1="45" x2="50" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6EE7B7" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>

        <filter id={`neonBlur_${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Rounded squircle background */}
      <rect
        x="2"
        y="2"
        width="96"
        height="96"
        rx="24"
        fill={`url(#bgGrad_${id})`}
        stroke="#10B981"
        strokeWidth="2.5"
        strokeOpacity="0.8"
      />

      {/* Subtle orbital glowing ring */}
      <ellipse
        cx="50"
        cy="50"
        rx="40"
        ry="24"
        transform="rotate(-25 50 50)"
        stroke="#34D399"
        strokeWidth="1.5"
        strokeDasharray="8 6"
        strokeOpacity="0.6"
        filter={`url(#neonBlur_${id})`}
      />

      {/* Gold 3D shadow for 'S' */}
      <path
        d="M68 34 C68 25 59 20 48 20 C36 20 28 27 28 36 C28 46 36 50 49 53 C62 56 68 62 68 70 C68 81 57 87 45 87 C31 87 24 79 24 71"
        stroke={`url(#goldTrim_${id})`}
        strokeWidth="13"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />

      {/* Emerald core for 'S' */}
      <path
        d="M68 34 C68 25 59 20 48 20 C36 20 28 27 28 36 C28 46 36 50 49 53 C62 56 68 62 68 70 C68 81 57 87 45 87 C31 87 24 79 24 71"
        stroke={`url(#emeraldBody_${id})`}
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
      />

      {/* Glowing Download Arrow & Base */}
      <g filter={`url(#neonBlur_${id})`}>
        {/* Downward Arrow Stem & Head */}
        <path
          d="M50 47 L50 67 M42 61 L50 68 L58 61"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M50 47 L50 67 M42 61 L50 68 L58 61"
          stroke={`url(#arrowGlow_${id})`}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Download Tray Bracket */}
        <path
          d="M36 71 L36 77 C36 79 38 81 40 81 L60 81 C62 81 64 79 64 77 L64 71"
          stroke="#FDE047"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1="43"
          y1="75"
          x2="57"
          y2="75"
          stroke="#34D399"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );

  return (
    <div
      className={`relative overflow-hidden bg-slate-900 border border-emerald-400/40 shadow-lg shadow-emerald-500/20 flex items-center justify-center shrink-0 ${
        showGlow ? 'shadow-emerald-500/40' : ''
      } ${dimensions[size]} ${className}`}
    >
      {/* If forcing SVG, or image failed, or while loading: render SVG fallback cleanly */}
      {(forceSvg || hasError || !isLoaded) && (
        <div className="absolute inset-0 w-full h-full flex items-center justify-center">
          {renderSvgFallback()}
        </div>
      )}

      {/* Render <img> tag only if not forcing SVG and hasn't errored out */}
      {!forceSvg && !hasError && (
        <img
          key={imageCandidates[srcIndex]}
          src={imageCandidates[srcIndex]}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setIsLoaded(true)}
          onError={handleImageError}
          referrerPolicy="no-referrer"
          loading="eager"
        />
      )}
    </div>
  );
};
