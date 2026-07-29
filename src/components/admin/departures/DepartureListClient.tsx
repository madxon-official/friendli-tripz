'use me';
'use client';

import React, { useState } from 'react';
import { Calendar, CheckCircle2, Clock, Users, Plus, ShieldCheck } from 'lucide-react';
import { PackageDeparture } from '@/lib/types/departure';

interface DepartureListClientProps {
  departures: PackageDeparture[];
}

export const DepartureListClient: React.FC<DepartureListClientProps> = ({ departures }) => {
  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-orange font-mono">
            <Calendar className="w-4 h-4" />
            <span>Group Tour Operations</span>
          </div>
          <h1 className="text-2xl font-heading font-black text-slate-900 tracking-tight mt-1">
            Fixed Departures & Viability Control
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage scheduled group departures, guaranteed threshold milestones, capacity pools, and room match pools.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">Departure Code & Tour Name</th>
                <th className="py-3.5 px-4">Departure Dates</th>
                <th className="py-3.5 px-4">Capacity & Booked Count</th>
                <th className="py-3.5 px-4">Guaranteed Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {departures.map((dep) => (
                <tr key={dep.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-brand-orange text-xs block">
                      {dep.departure_code}
                    </span>
                    <span className="font-heading font-extrabold text-slate-900 block leading-tight">
                      {dep.release?.title || 'Group Tour'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-xs font-bold text-slate-800">
                    {dep.start_date} ➔ {dep.end_date}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-xs">
                    <span className="font-bold text-slate-900">{dep.current_booked_count}</span> / {dep.max_travellers} Seats (Min {dep.min_travellers})
                  </td>

                  <td className="py-3.5 px-4">
                    {dep.is_guaranteed ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Guaranteed Departure
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        Awaiting Min {dep.min_travellers}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
