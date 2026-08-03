import React from 'react';
import { Container } from '@/components/v3/ui/Container';

export default function Loading() {
  return (
    <div className="min-h-screen bg-surface-50 pt-28 pb-16 animate-pulse">
      {/* Hero skeleton */}
      <div className="w-full h-64 sm:h-80 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <Container className="h-full flex flex-col justify-center items-center text-center space-y-4">
          <div className="w-32 h-6 bg-white/10 rounded-full" />
          <div className="w-3/4 max-w-xl h-10 bg-white/20 rounded-xl" />
          <div className="w-1/2 max-w-md h-4 bg-white/10 rounded-lg" />
        </Container>
      </div>

      {/* Grid skeleton */}
      <Container className="py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="w-48 h-8 bg-surface-200 rounded-lg" />
          <div className="w-32 h-8 bg-surface-200 rounded-lg" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-card-lg border border-surface-200 overflow-hidden space-y-4 p-4 shadow-subtle">
              <div className="w-full aspect-[4/3] bg-surface-200 rounded-card" />
              <div className="w-2/3 h-5 bg-surface-200 rounded-md" />
              <div className="w-full h-4 bg-surface-100 rounded-md" />
              <div className="flex justify-between items-center pt-2">
                <div className="w-20 h-6 bg-surface-200 rounded-md" />
                <div className="w-24 h-8 bg-brand-soft-orange rounded-badge" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
