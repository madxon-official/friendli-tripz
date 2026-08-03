import React from 'react';

export function SectionSkeleton({ title }: { title?: string }) {
  return (
    <div className="py-16 sm:py-24 bg-surface-50 border-t border-surface-200/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-pulse">
        {title && (
          <div className="space-y-3 text-center max-w-xl mx-auto">
            <div className="h-4 bg-surface-200 rounded-full w-24 mx-auto" />
            <div className="h-8 bg-surface-300 rounded-xl w-64 mx-auto" />
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="h-64 bg-surface-200 rounded-3xl" />
          <div className="h-64 bg-surface-200 rounded-3xl" />
          <div className="h-64 bg-surface-200 rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
