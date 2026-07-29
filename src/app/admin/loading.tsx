import React from 'react';

export default function AdminDashboardLoading() {
  return (
    <div className="min-h-screen bg-brand-warm/30 flex text-brand-navy">
      {/* Sidebar Placeholder */}
      <div className="w-64 bg-brand-navy hidden md:block shrink-0 h-screen sticky top-0" />

      {/* Main Content Skeleton */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-16 bg-white border-b border-brand-border/60 px-6 flex items-center justify-between shadow-2xs">
          <div className="w-48 h-5 bg-slate-200 rounded-lg animate-pulse" />
          <div className="w-32 h-8 bg-slate-200 rounded-xl animate-pulse" />
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-2 border-b border-brand-border/60 pb-5">
            <div className="w-64 h-8 bg-slate-200 rounded-xl animate-pulse" />
            <div className="w-96 h-4 bg-slate-200 rounded-lg animate-pulse" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-brand-border/60 shadow-card h-28 space-y-3">
                <div className="w-24 h-4 bg-slate-200 rounded-md animate-pulse" />
                <div className="w-16 h-8 bg-slate-200 rounded-xl animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
