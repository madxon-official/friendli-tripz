import React from 'react';
import { clsx } from 'clsx';

type BadgeVariant = 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
type BadgeSize = 'xs' | 'sm' | 'md';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  pulse?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-surface-100 text-brand-text border-surface-200',
  brand: 'bg-brand-soft-orange text-brand-orange border-brand-orange/20',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  danger: 'bg-rose-50 text-rose-700 border-rose-200',
  info: 'bg-sky-50 text-sky-700 border-sky-200',
  outline: 'bg-transparent text-brand-muted border-surface-200',
};

const sizeStyles: Record<BadgeSize, string> = {
  xs: 'px-2 py-0.5 text-[10px] gap-1',
  sm: 'px-2.5 py-1 text-caption gap-1.5',
  md: 'px-3 py-1 text-body-sm gap-1.5',
};

export function Badge({
  children,
  variant = 'default',
  size = 'sm',
  icon,
  pulse = false,
  className,
}: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center font-bold uppercase tracking-wider border rounded-badge whitespace-nowrap',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {pulse && (
        <span className="relative flex h-2 w-2 mr-1">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
        </span>
      )}
      {icon}
      {children}
    </span>
  );
}
