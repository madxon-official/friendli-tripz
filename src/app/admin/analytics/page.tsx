import React from 'react';
import { getExecutiveMetrics, getDestinationPerformance } from '@/lib/actions/analytics';
import { BarChart3, TrendingUp, PieChart, Sparkles, MapPin, Users } from 'lucide-react';

export const metadata = {
  title: 'Executive Analytics Dashboard | Friendli Tripz Admin',
  description: 'Revenue KPI metrics, conversion funnel, destination performance, vendor matrices, and marketing ROI.',
};

export default async function AnalyticsPage() {
  const metrics = await getExecutiveMetrics();
  const dests = await getDestinationPerformance();

  return (
    <main className="min-h-screen bg-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <BarChart3 className="w-4 h-4" />
              Executive Analytics Engine
            </div>
            <h1 className="font-heading text-3xl font-extrabold text-white">
              Platform Performance & Revenue Analytics
            </h1>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-800 p-5 rounded-3xl border border-slate-700 space-y-2">
            <span className="text-xs text-slate-400 block font-semibold">Total Revenue (YTD)</span>
            <span className="text-2xl font-extrabold text-emerald-400">₹{metrics.totalRevenue.toLocaleString('en-IN')}</span>
          </div>

          <div className="bg-slate-800 p-5 rounded-3xl border border-slate-700 space-y-2">
            <span className="text-xs text-slate-400 block font-semibold">Confirmed Bookings</span>
            <span className="text-2xl font-extrabold text-white">{metrics.totalBookings}</span>
          </div>

          <div className="bg-slate-800 p-5 rounded-3xl border border-slate-700 space-y-2">
            <span className="text-xs text-slate-400 block font-semibold">AI Planner Sessions</span>
            <span className="text-2xl font-extrabold text-amber-400">{metrics.aiPlannerSessions}</span>
          </div>

          <div className="bg-slate-800 p-5 rounded-3xl border border-slate-700 space-y-2">
            <span className="text-xs text-slate-400 block font-semibold">Average Commercial Margin</span>
            <span className="text-2xl font-extrabold text-white">{metrics.averageMargin}%</span>
          </div>
        </div>

        {/* Destination Performance Table */}
        <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700 space-y-4 shadow-xl">
          <h3 className="font-heading font-bold text-white text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-400" />
            Destination Performance Breakdown
          </h3>

          <div className="divide-y divide-slate-700/60 text-xs">
            {dests.map((d, i) => (
              <div key={i} className="py-4 flex items-center justify-between">
                <span className="font-bold text-white text-base">{d.destinationName}</span>
                <div className="flex items-center gap-6 font-mono text-sm">
                  <span>{d.bookingsCount} Bookings</span>
                  <span className="font-extrabold text-emerald-400">₹{d.grossRevenue.toLocaleString('en-IN')}</span>
                  <span className="text-amber-400 font-bold">★ {d.averageRating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
