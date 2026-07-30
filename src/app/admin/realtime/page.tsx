import React from 'react';
import { getLiveDriverLocations, getActivePresenceCount } from '@/lib/actions/realtime';
import { Radio, Signal, Car, Navigation, ShieldCheck, Zap } from 'lucide-react';

export const metadata = {
  title: 'Realtime Operations Dashboard | Friendli Tripz Admin',
  description: 'Supabase Realtime driver telemetry, active presence sessions, live booking events stream, and QR redemption sync.',
};

export default async function RealtimePage() {
  const driverLocations = await getLiveDriverLocations();
  const presenceCount = await getActivePresenceCount();

  return (
    <main className="min-h-screen bg-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Radio className="w-4 h-4 animate-pulse text-amber-400" />
              Live Telemetry & WebSocket Engine
            </div>
            <h1 className="font-heading text-3xl font-extrabold text-white">
              Realtime Platform Operations Control
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-2xl text-center">
              <span className="text-[10px] text-slate-400 block font-semibold">Active Presence Sessions</span>
              <span className="text-lg font-extrabold text-emerald-400">{presenceCount} Users Online</span>
            </div>
          </div>
        </div>

        {/* Realtime Driver Locations Stream */}
        <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-white text-lg flex items-center gap-2">
              <Car className="w-5 h-5 text-amber-400" />
              Live Fleet GPS Telemetry Stream
            </h3>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
              <Signal className="w-3.5 h-3.5" />
              WebSocket Channel Connected
            </span>
          </div>

          <div className="divide-y divide-slate-700/60 text-xs">
            {driverLocations.map((loc) => (
              <div key={loc.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-base">{loc.driverName}</span>
                    <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono text-[10px]">{loc.vehicleNumber}</span>
                  </div>
                  <span className="text-slate-400 block">
                    Lat: <strong className="text-white">{loc.latitude}</strong> • Lng: <strong className="text-white">{loc.longitude}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-6 text-right font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Speed</span>
                    <span className="font-extrabold text-emerald-400 text-sm">{loc.speedKmh} km/h</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Heading</span>
                    <span className="font-bold text-white text-xs">{loc.headingDegrees}° S</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
