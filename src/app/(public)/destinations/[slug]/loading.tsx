import React from 'react';

export default function DestinationDetailLoading() {
  return (
    <div className="min-h-screen bg-slate-50 animate-pulse pt-20">
      <div className="h-[60vh] bg-slate-800 w-full relative" />
      <div className="max-w-7xl mx-auto py-12 px-6 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-4">
            <div className="w-48 h-6 bg-slate-200 rounded-full" />
            <div className="w-80 h-10 bg-slate-300 rounded-xl" />
            <div className="w-full h-24 bg-slate-200 rounded-xl" />
          </div>
          <div className="lg:col-span-2 h-60 bg-white rounded-3xl border border-slate-200" />
        </div>
      </div>
    </div>
  );
}
