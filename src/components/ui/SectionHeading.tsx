import React from 'react';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  darkTheme?: boolean;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  darkTheme = false,
  className = '',
}) => {
  const alignmentClass = align === 'center' ? 'text-center mx-auto' : 'text-left';

  return (
    <div className={`max-w-3xl mb-10 sm:mb-14 ${alignmentClass} ${className}`}>
      {eyebrow && (
        <span className="inline-block px-3 py-1 mb-3 text-xs sm:text-sm font-bold tracking-wider uppercase text-brand-orange bg-brand-soft-orange rounded-full border border-brand-orange/20">
          {eyebrow}
        </span>
      )}
      <h2
        className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight ${
          darkTheme ? 'text-white' : 'text-brand-navy'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-3 text-base sm:text-lg leading-relaxed ${
            darkTheme ? 'text-slate-300' : 'text-brand-muted'
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
