'use client';

import React from 'react';
import { Calendar, Users, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface AvailableDeparturesProps {
  packageInstanceId: string;
}

const DEPARTURES = [
  { id: 'dep-1', startDate: '2026-10-15', endDate: '2026-10-18', availableSeats: 6, status: 'Guaranteed' },
  { id: 'dep-2', startDate: '2026-10-22', endDate: '2026-10-25', availableSeats: 8, status: 'Guaranteed' },
  { id: 'dep-3', startDate: '2026-11-05', endDate: '2026-11-08', availableSeats: 4, status: 'Filling Fast' },
];

export const AvailableDepartures: React.FC<AvailableDeparturesProps> = ({ packageInstanceId }) => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="font-heading font-bold text-slate-900 text-sm flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-amber-500" />
          Upcoming Fixed Departures
        </h3>
        <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" />
          100% Guaranteed
        </span>
      </div>

      <div className="space-y-3">
        {DEPARTURES.map((dep) => (
          <div key={dep.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3">
            <div>
              <span className="font-bold text-slate-900 text-xs block">
                {new Date(dep.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} - {new Date(dep.endDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                <Users className="w-3 h-3 text-slate-400" />
                {dep.availableSeats} seats remaining ({dep.status})
              </span>
            </div>

            <Link
              href={`/checkout/${packageInstanceId}?startDate=${dep.startDate}`}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-amber-600 text-white font-medium text-xs transition-colors shadow-sm flex items-center gap-1 shrink-0"
            >
              Book Date
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
