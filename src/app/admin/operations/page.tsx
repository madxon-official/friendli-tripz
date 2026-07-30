import React from 'react';
import { getLiveDeployments, getOperationalAlerts } from '@/lib/actions/operations';
import { Car, Hotel, Compass, AlertTriangle, ShieldCheck, Clock, Users, CheckCircle2, AlertOctagon } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Operations Command Center | Friendli Tripz Admin',
  description: 'Real-time live departures control, vehicle/driver assignments, hotel allocations, rooming lists, emergency alerts, and departure readiness scores.',
};

export default async function OperationsPage() {
  const deployments = await getLiveDeployments();
  const alerts = await getOperationalAlerts();

  return (
    <main className="min-h-screen bg-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              Enterprise Operations Control
            </div>
            <h1 className="font-heading text-3xl font-extrabold text-white">
              Operations Command Center ({deployments.length} Active Deployments)
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-2xl text-center">
              <span className="text-[10px] text-slate-400 block font-semibold">Today's Fleet Readiness</span>
              <span className="text-lg font-extrabold text-emerald-400">97.5%</span>
            </div>
          </div>
        </div>

        {/* Live Operational Alerts */}
        {alerts.length > 0 && (
          <div className="bg-amber-950/40 rounded-3xl p-6 border border-amber-800/50 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <AlertTriangle className="w-4 h-4" />
              Live Operational Alerts ({alerts.length})
            </div>
            <div className="space-y-2">
              {alerts.map((alt) => (
                <div key={alt.id} className="text-xs text-amber-200 bg-slate-900/60 p-3 rounded-xl border border-amber-800/40 flex items-center justify-between">
                  <span>{alt.message}</span>
                  <span className="text-[10px] uppercase font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">
                    {alt.alertLevel}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Deployments List Grid */}
        <div className="space-y-6">
          <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            Live Departures & Resource Assignments
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {deployments.map((dep) => (
              <div key={dep.id} className="bg-slate-800 rounded-3xl p-6 border border-slate-700 space-y-5 shadow-lg">
                {/* Deployment Card Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                  <div>
                    <span className="font-mono text-xs font-bold text-amber-400 block">{dep.bookingCode}</span>
                    <span className="font-bold text-white text-lg block">{dep.leadBookerName}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-semibold">Readiness Score</span>
                    <span className={`text-base font-extrabold px-2.5 py-0.5 rounded-full inline-block ${
                      dep.readinessScore >= 90 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    }`}>
                      {dep.readinessScore}%
                    </span>
                  </div>
                </div>

                {/* Resource Allocations */}
                <div className="space-y-3 text-xs">
                  {/* Transport & Driver */}
                  <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-700/60 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4 text-blue-400 shrink-0" />
                      <div>
                        <span className="font-bold text-slate-200 block">{dep.vehicle?.model || 'Vehicle Unassigned'}</span>
                        <span className="text-[11px] text-slate-400">{dep.vehicle?.number || 'Assign SUV'} • Driver: {dep.driver?.name || 'Unassigned'}</span>
                      </div>
                    </div>
                    {dep.driver && <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold">Confirmed</span>}
                  </div>

                  {/* Hotel & Rooming */}
                  <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-700/60 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Hotel className="w-4 h-4 text-indigo-400 shrink-0" />
                      <div>
                        <span className="font-bold text-slate-200 block">{dep.hotel?.name || 'Hotel Allocation Pending'}</span>
                        <span className="text-[11px] text-slate-400">{dep.hotel?.roomCategory || 'Standard MAP'} ({dep.hotel?.roomsCount || 1} Room)</span>
                      </div>
                    </div>
                    {dep.hotel && <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded font-bold">Allocated</span>}
                  </div>

                  {/* Tour Guide */}
                  <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-700/60 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Compass className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <span className="font-bold text-slate-200 block">Assigned Guide: {dep.guide?.name || 'Stationary Local Guide'}</span>
                        <span className="text-[11px] text-slate-400">Phone: {dep.guide?.phone || '+91 98765 43210'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    Departure: <strong className="text-white">{dep.departureDate}</strong> ({dep.passengerCount} Passengers)
                  </span>

                  <Link
                    href={`/trip/${dep.bookingId}/live`}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors"
                  >
                    View Companion View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
