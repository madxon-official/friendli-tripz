import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  variant?: 'warm' | 'white' | 'soft-navy' | 'dark-navy' | 'soft-orange';
}

export const Section: React.FC<SectionProps> = ({
  children,
  id,
  className = '',
  variant = 'warm',
}) => {
  const variantStyles = {
    warm: 'bg-brand-warm text-brand-text',
    white: 'bg-brand-white text-brand-text',
    'soft-navy': 'bg-brand-soft-navy text-brand-text',
    'dark-navy': 'bg-brand-navy text-white',
    'soft-orange': 'bg-brand-soft-orange text-brand-text',
  };

  return (
    <section
      id={id}
      className={`py-12 sm:py-16 lg:py-20 ${variantStyles[variant]} ${className}`}
    >
      {children}
    </section>
  );
};
