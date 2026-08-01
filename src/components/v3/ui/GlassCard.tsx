import React from 'react';
import { clsx } from 'clsx';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'light' | 'dark' | 'subtle';
  padding?: 'sm' | 'md' | 'lg';
}

const variantStyles = {
  light: 'glass',
  dark: 'glass-dark',
  subtle: 'glass-subtle',
};

const paddingStyles = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function GlassCard({
  children,
  className,
  variant = 'light',
  padding = 'md',
}: GlassCardProps) {
  return (
    <div
      className={clsx(
        'rounded-card-lg',
        variantStyles[variant],
        paddingStyles[padding],
        className
      )}
    >
      {children}
    </div>
  );
}
