import React from 'react';
import { clsx } from 'clsx';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circle' | 'rect' | 'card';
  width?: string;
  height?: string;
  lines?: number;
}

export function Skeleton({
  className,
  variant = 'rect',
  width,
  height,
  lines = 1,
}: SkeletonProps) {
  if (variant === 'text' && lines > 1) {
    return (
      <div className={clsx('space-y-2.5', className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={clsx(
              'shimmer rounded-lg h-4',
              i === lines - 1 ? 'w-3/4' : 'w-full'
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'shimmer',
        variant === 'text' && 'rounded-lg h-4',
        variant === 'circle' && 'rounded-full',
        variant === 'rect' && 'rounded-card',
        variant === 'card' && 'rounded-card-lg',
        className
      )}
      style={{ width, height }}
      aria-hidden="true"
      role="presentation"
    />
  );
}

/* Preset skeleton compositions */
export function SkeletonCard() {
  return (
    <div className="bg-white rounded-card-lg border border-surface-200/80 overflow-hidden">
      <Skeleton variant="rect" className="w-full h-48" />
      <div className="p-5 space-y-3">
        <Skeleton variant="text" className="w-1/3 h-3" />
        <Skeleton variant="text" className="w-2/3 h-5" />
        <Skeleton variant="text" lines={2} />
        <div className="flex items-center justify-between pt-2">
          <Skeleton variant="text" className="w-20 h-6" />
          <Skeleton variant="rect" className="w-24 h-9 rounded-button" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonTripCard() {
  return (
    <div className="bg-white rounded-card-lg border border-surface-200/80 overflow-hidden">
      <Skeleton variant="rect" className="w-full aspect-[4/3]" />
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton variant="text" className="w-16 h-5" />
          <Skeleton variant="text" className="w-12 h-5" />
        </div>
        <Skeleton variant="text" className="w-3/4 h-6" />
        <Skeleton variant="text" className="w-full h-4" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton variant="text" className="w-24 h-7" />
          <Skeleton variant="rect" className="w-28 h-10 rounded-button" />
        </div>
      </div>
    </div>
  );
}
