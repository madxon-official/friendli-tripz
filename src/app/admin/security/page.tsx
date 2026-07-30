import React from 'react';
import { getSecurityEvents } from '@/lib/actions/security';
import { ShieldCheck, Lock, AlertTriangle, Key, Bot } from 'lucide-react';

export const metadata = {
  title: 'Security & Compliance Dashboard | Friendli Tripz Admin',
  description: 'CSRF, CSP security policies, bot detection scores, rate limiting logs, and secret key rotations.',
};

export default async function SecurityPage() {
  const events = await getSecurityEvents();

  return (
    <main className="min-h-screen bg-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              SaaS Compliance & Threat Defense
            </div>
            <h1 className="font-heading text-3xl font-extrabold text-white">
              Security Governance & Threat Audit Log
            </h1>
          </div>
        </div>

        {/* Security Log Table */}
        <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700 space-y-4 shadow-xl">
          <h3 className="font-heading font-bold text-white text-lg flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-400" />
            Live Threat Stream
          </h3>

          <div className="divide-y divide-slate-700/60 text-xs">
            {events.map((ev) => (
              <div key={ev.id} className="py-4 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white text-sm">{ev.eventType}</span>
                    <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold uppercase text-[10px]">
                      {ev.severity}
                    </span>
                  </div>
                  <span className="text-slate-400 block">IP: {ev.ipAddress}</span>
                </div>

                <span className="text-slate-400 font-mono text-[11px]">
                  {new Date(ev.createdAt).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
