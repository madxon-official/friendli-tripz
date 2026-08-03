import React from 'react';
import Image from 'next/image';

interface BrandWordmarkProps {
  /** 'dark' = white Friendli for dark bgs, 'light' = navy Friendli for light bgs */
  theme?: 'dark' | 'light' | 'auto';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showTagline?: boolean;
  tagline?: string;
  badge?: string;
  badgePosition?: 'inline' | 'below';
}

export function BrandWordmark({
  theme = 'light',
  size = 'md',
  className = '',
  showTagline = false,
  tagline = 'Travel. Vibe. Repeat.',
  badge,
  badgePosition = 'inline',
}: BrandWordmarkProps) {
  // Height classes precisely calibrated to SVG aspect ratio ~5:1
  // xs: ~18px high (90px wide) - compact headers
  // sm: ~22px high (110px wide) - sidebars & mobile menus
  // md: ~25px high (125px wide) - navbars
  // lg: ~30px high (150px wide) - footers & login cards
  // xl: ~36px high (180px wide) - prominent headers
  const heightClasses = {
    xs: 'h-[16px] sm:h-[18px]',
    sm: 'h-[20px] sm:h-[22px]',
    md: 'h-[22px] sm:h-[25px]',
    lg: 'h-[26px] sm:h-[30px]',
    xl: 'h-[32px] sm:h-[36px]',
  };

  const src = theme === 'dark' ? '/friendli/wordmark-light.svg' : '/friendli/wordmark.svg';

  return (
    <div className={`flex flex-col justify-center min-w-0 ${className}`}>
      <div className="flex items-center gap-2 max-w-full">
        <div className={`relative ${heightClasses[size]} w-auto shrink-0 flex items-center`}>
          <Image
            src={src}
            alt="Friendli Tripz"
            width={200}
            height={50}
            priority
            className="h-full w-auto object-contain"
          />
        </div>
        {badge && badgePosition === 'inline' && (
          <span className="text-[9px] sm:text-[10px] font-extrabold bg-brand-orange/15 text-brand-orange px-2 py-0.5 rounded-full uppercase tracking-wider border border-brand-orange/30 font-sans shrink-0">
            {badge}
          </span>
        )}
      </div>

      {badge && badgePosition === 'below' && (
        <span className="text-[9px] font-extrabold text-brand-orange uppercase tracking-wider mt-0.5 leading-none font-mono">
          {badge}
        </span>
      )}

      {showTagline && !badge && (
        <span className="text-[8px] sm:text-[9px] font-extrabold text-brand-orange uppercase tracking-wider mt-0.5 leading-none font-mono">
          {tagline}
        </span>
      )}
    </div>
  );
}
