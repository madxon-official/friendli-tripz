import React from 'react';

export default function PackageDetailLoading() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 animate-pulse pt-28">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Skeleton */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="w-24 h-6 bg-slate-200 rounded-full" />
                <div className="w-32 h-6 bg-slate-200 rounded-full" />
              </div>
              <div className="w-96 max-w-full h-9 bg-slate-300 rounded-xl" />
            </div>
            <div className="flex gap-3">
              <div className="w-28 h-10 bg-slate-200 rounded-2xl" />
              <div className="w-32 h-10 bg-slate-900/20 rounded-2xl" />
            </div>
          </div>

          <div className="aspect-[21/9] w-full bg-slate-200 rounded-2xl" />
        </div>

        {/* 2-Column Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="w-64 h-7 bg-slate-300 rounded-lg" />
            <div className="h-64 bg-white rounded-3xl border border-slate-200" />
            <div className="h-48 bg-white rounded-3xl border border-slate-200" />
          </div>
          <div className="space-y-6">
            <div className="h-72 bg-white rounded-3xl border border-slate-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
