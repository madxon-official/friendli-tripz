import React from 'react';

export default function AdminEnquiriesLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Title Bar Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border/60 pb-5">
        <div className="space-y-2">
          <div className="w-64 h-8 bg-slate-200 rounded-xl" />
          <div className="w-96 h-4 bg-slate-200 rounded-lg" />
        </div>
      </div>

      {/* Filter Bar Skeleton */}
      <div className="bg-white rounded-2xl p-4 border border-brand-border/60 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="flex-1 h-10 bg-slate-200 rounded-xl" />
        <div className="w-32 h-10 bg-slate-200 rounded-xl" />
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-3xl border border-brand-border/60 shadow-card p-6 space-y-4">
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-slate-100 rounded-xl flex items-center px-4 justify-between">
              <div className="space-y-2">
                <div className="w-44 h-4 bg-slate-200 rounded-md" />
                <div className="w-32 h-3 bg-slate-200 rounded-md" />
              </div>
              <div className="w-24 h-6 bg-slate-200 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
