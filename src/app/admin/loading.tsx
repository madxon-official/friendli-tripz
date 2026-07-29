import React from 'react';

export default function AdminDashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Title Bar Skeleton */}
      <div className="space-y-2 border-b border-brand-border/60 pb-5">
        <div className="w-64 h-8 bg-slate-200 rounded-xl" />
        <div className="w-96 h-4 bg-slate-200 rounded-lg" />
      </div>

      {/* Summary KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-brand-border/60 shadow-card h-28 space-y-3">
            <div className="w-24 h-4 bg-slate-200 rounded-md" />
            <div className="w-16 h-8 bg-slate-200 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
