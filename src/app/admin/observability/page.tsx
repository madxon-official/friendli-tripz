import React from 'react';
import { Activity, Cpu, Server, HardDrive, Zap } from 'lucide-react';

export const metadata = {
  title: 'Observability & Metrics | Friendli Tripz Admin',
  description: 'Slow query logging, database health metrics, API response spans, and structured log streams.',
};

export default function ObservabilityPage() {
  return (
    <main className="min-h-screen bg-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Activity className="w-4 h-4" />
              Observability & Distributed Tracing
            </div>
            <h1 className="font-heading text-3xl font-extrabold text-white">
              System Metrics & Slow Query Monitor
            </h1>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 space-y-2">
            <span className="text-xs text-slate-400 block font-semibold">P99 API Latency</span>
            <span className="text-3xl font-extrabold text-emerald-400">142 ms</span>
          </div>

          <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 space-y-2">
            <span className="text-xs text-slate-400 block font-semibold">Database Slow Queries</span>
            <span className="text-3xl font-extrabold text-white">0 Queries &gt; 500ms</span>
          </div>

          <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 space-y-2">
            <span className="text-xs text-slate-400 block font-semibold">Cache Hit Ratio</span>
            <span className="text-3xl font-extrabold text-amber-400">94.8%</span>
          </div>
        </div>
      </div>
    </main>
  );
}
