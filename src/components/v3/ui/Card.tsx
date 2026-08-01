import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'glass' | 'outline' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  as?: React.ElementType;
  href?: string;
}

const variantStyles = {
  default: 'bg-white border border-surface-200/80 shadow-subtle',
  elevated: 'bg-white border border-surface-200/60 shadow-card',
  glass: 'glass',
  outline: 'bg-transparent border-2 border-surface-200',
  interactive: 'bg-white border border-surface-200/80 shadow-subtle card-interactive cursor-pointer',
};

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({
  children,
  className,
  variant = 'default',
  padding = 'md',
  as: Component = 'div',
}: CardProps) {
  return (
    <Component
      className={clsx(
        'rounded-card overflow-hidden',
        variantStyles[variant],
        paddingStyles[padding],
        className
      )}
    >
      {children}
    </Component>
  );
}

/* Sub-components for Card composition */
export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={clsx('border-b border-surface-200/60 pb-4 mb-4', className)}>
      {children}
    </div>
  );
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={clsx(className)}>{children}</div>;
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={clsx('border-t border-surface-200/60 pt-4 mt-4', className)}>
      {children}
    </div>
  );
}
