'use client';

import React, { useState } from 'react';
import { Compass, Users, AlertTriangle, Receipt, CheckCircle2, Phone } from 'lucide-react';
import { TourParticipantItem } from '@/lib/types/tour_leader';

export default function TourLeaderPage() {
  const [roster, setRoster] = useState<TourParticipantItem[]>([
    {
      id: 'p-1',
      name: 'Rahul Sharma',
      phone: '+91 98765 43210',
      roomNumber: 'Room 204',
      dietaryPreference: 'Vegetarian',
      medicalAlerts: 'Asthma inhaler carried',
      attendanceStatus: 'present',
    },
    {
      id: 'p-2',
      name: 'Priya Sharma',
      phone: '+91 98765 43211',
      roomNumber: 'Room 204',
      dietaryPreference: 'Vegetarian',
      attendanceStatus: 'present',
    }
  ]);

  return (
    <main className="min-h-screen bg-slate-900 text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-4 h-4" />
              Tour Leader Management App
            </span>
            <span className="text-xs text-slate-400">Deployment FT-2026-9001</span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
            Kodaikanal Group Tour Execution
          </h1>
        </div>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button className="p-4 bg-slate-800 rounded-2xl border border-slate-700 hover:border-amber-500 transition-all text-left space-y-1">
            <span className="text-xs font-bold text-rose-400 uppercase flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              Report Operational Incident
            </span>
            <span className="text-xs text-slate-400 block">Log delays, weather alerts, or medical issues instantly.</span>
          </button>

          <button className="p-4 bg-slate-800 rounded-2xl border border-slate-700 hover:border-amber-500 transition-all text-left space-y-1">
            <span className="text-xs font-bold text-emerald-400 uppercase flex items-center gap-1.5">
              <Receipt className="w-4 h-4" />
              Record On-Field Expense
            </span>
            <span className="text-xs text-slate-400 block">Submit tolls, parking, or emergency guide payments with receipt photo.</span>
          </button>
        </div>

        {/* Participant Roster */}
        <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700 space-y-4">
          <h3 className="font-heading font-bold text-white text-base flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            Group Roster & Attendance ({roster.length})
          </h3>

          <div className="space-y-3">
            {roster.map((p) => (
              <div key={p.id} className="p-4 bg-slate-900/60 rounded-2xl border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{p.name}</span>
                    <span className="bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-semibold">{p.roomNumber}</span>
                  </div>
                  <span className="text-slate-400 block">Diet: {p.dietaryPreference} • Phone: {p.phone}</span>
                  {p.medicalAlerts && <span className="text-rose-400 font-semibold block">⚠️ {p.medicalAlerts}</span>}
                </div>

                <div className="flex items-center gap-2">
                  <button className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Present
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
