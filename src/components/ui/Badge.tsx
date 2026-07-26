import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'navy' | 'orange' | 'outline' | 'white';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'orange',
  className = '',
}) => {
  const variantStyles = {
    navy: 'bg-brand-navy text-white',
    orange: 'bg-brand-soft-orange text-brand-orange font-semibold border border-brand-orange/20',
    outline: 'border border-brand-navy/20 text-brand-navy bg-white/50 backdrop-blur-sm',
    white: 'bg-white text-brand-navy font-semibold shadow-sm',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-xs sm:text-sm tracking-wide rounded-full font-medium ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
