'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Compass, ShieldCheck } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export default function TrackLookupPage() {
  const router = useRouter();
  const [reference, setReference] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (reference.trim()) {
      router.push(`/track/${reference.trim().toUpperCase()}`);
    }
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen pt-36 pb-24 flex items-center justify-center">
      <Container className="max-w-xl">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-elevated">
          <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 border border-brand-orange/30 text-brand-orange flex items-center justify-center mx-auto mb-4">
            <Compass className="w-6 h-6" />
          </div>

          <h1 className="text-3xl font-extrabold text-white mb-2">Track Your Trip</h1>
          <p className="text-xs text-slate-400 mb-8 leading-relaxed">
            Enter your unique Trip Reference ID (e.g. <span className="text-brand-orange font-mono">FT-2026-8942</span>) to view real-time trip status, assigned driver, vehicle details, and itinerary updates.
          </p>

          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Enter Reference ID (e.g. FT-2026-8942)"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-white font-mono uppercase focus:outline-none focus:border-brand-orange"
              />
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full justify-center shadow-button">
              View Realtime Trip Timeline
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800 text-left">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Try Demo Tracking ID</span>
            <button
              onClick={() => router.push('/track/FT-2026-8942')}
              className="text-xs text-brand-orange hover:underline font-mono bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 inline-block"
            >
              FT-2026-8942
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
}
