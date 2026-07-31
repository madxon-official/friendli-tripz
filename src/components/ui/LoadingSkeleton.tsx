import React from 'react';

export const PageLoadingSkeleton: React.FC<{ title?: string }> = ({ title = 'Loading Workspace...' }) => {
  return (
    <div className="space-y-6 animate-pulse p-2">
      {/* Title Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-2">
          <div className="w-32 h-4 bg-slate-200 rounded-md font-mono" />
          <div className="w-64 h-8 bg-slate-200 rounded-xl" />
          <div className="w-96 h-4 bg-slate-200 rounded-lg" />
        </div>
        <div className="w-32 h-10 bg-slate-200 rounded-2xl shrink-0" />
      </div>

      {/* Metric Cards Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200 h-28 space-y-3 shadow-xs">
            <div className="flex justify-between items-center">
              <div className="w-24 h-3 bg-slate-200 rounded" />
              <div className="w-8 h-8 bg-slate-200 rounded-xl" />
            </div>
            <div className="w-16 h-7 bg-slate-200 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Main Table / Container Skeleton */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
        <div className="w-48 h-6 bg-slate-200 rounded-lg" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-slate-100 rounded-2xl w-full" />
          ))}
        </div>
      </div>
    </div>
  );
};
