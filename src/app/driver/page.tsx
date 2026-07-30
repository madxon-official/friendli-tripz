'use client';

import React, { useState } from 'react';
import { Car, Navigation, CheckCircle2, Phone, ShieldCheck, QrCode, Camera, Fuel, WifiOff } from 'lucide-react';
import { DriverPickupTask } from '@/lib/types/driver';

export default function DriverPage() {
  const [pickups, setPickups] = useState<DriverPickupTask[]>([
    {
      id: 'pickup-1',
      bookingCode: 'FT-2026-9001',
      passengerName: 'Rahul Sharma',
      passengerPhone: '+91 98765 43210',
      pickupLocation: 'Madurai Junction Railway Station (Platform 1 Exit)',
      pickupTime: '08:30 AM',
      destination: 'Grand Hilltop Resort Kodaikanal',
      boardingStatus: 'boarded',
    },
    {
      id: 'pickup-2',
      bookingCode: 'FT-2026-9002',
      passengerName: 'Priya Iyer',
      passengerPhone: '+91 98421 87654',
      pickupLocation: 'Kodai Road Railway Station',
      pickupTime: '10:15 AM',
      destination: 'Sterling Kodai Lake',
      boardingStatus: 'pending',
    }
  ]);

  const handleToggleBoarding = (id: string) => {
    setPickups(prev => prev.map(p => {
      if (p.id === id) {
        const nextStatus = p.boardingStatus === 'boarded' ? 'pending' : 'boarded';
        return { ...p, boardingStatus: nextStatus };
      }
      return p;
    }));
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white py-6 px-4 sm:px-6">
      <div className="max-w-md mx-auto space-y-6">
        {/* PWA Header */}
        <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 font-bold flex items-center justify-center">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white text-base block">Mani Kumar</span>
              <span className="text-xs text-slate-400">TN-57-AB-9876 (Innova)</span>
            </div>
          </div>

          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-500/30">
            <WifiOff className="w-3 h-3" />
            PWA Offline Ready
          </span>
        </div>

        {/* Action Quick Bar */}
        <div className="grid grid-cols-2 gap-3">
          <button className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 hover:border-amber-500 transition-all flex items-center justify-center gap-2 text-xs font-bold text-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Vehicle Inspection
          </button>
          <button className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 hover:border-amber-500 transition-all flex items-center justify-center gap-2 text-xs font-bold text-slate-200">
            <Fuel className="w-4 h-4 text-amber-400" />
            Log Fuel Fillup
          </button>
        </div>

        {/* Pickups Roster */}
        <div className="space-y-4">
          <h3 className="font-heading font-bold text-sm text-slate-300 uppercase tracking-wider">
            Today's Scheduled Pickups ({pickups.length})
          </h3>

          <div className="space-y-3">
            {pickups.map((p) => (
              <div key={p.id} className="bg-slate-900 rounded-3xl p-5 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-amber-400">{p.bookingCode}</span>
                  <span className="text-xs text-slate-400 font-medium">{p.pickupTime}</span>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-white text-base block">{p.passengerName}</span>
                  <span className="text-xs text-slate-400 block">{p.pickupLocation}</span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <a
                    href={`tel:${p.passengerPhone}`}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    Call Passenger
                  </a>

                  <button
                    onClick={() => handleToggleBoarding(p.id)}
                    className={`px-4 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                      p.boardingStatus === 'boarded'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-amber-500 text-slate-950'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {p.boardingStatus === 'boarded' ? 'Boarded' : 'Confirm Boarding'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
