import React from 'react';
import { Layers, ShieldCheck, CheckCircle2, RefreshCw, Server } from 'lucide-react';

export const metadata = {
  title: 'Integration Hub & Third-Party Connectors | Friendli Tripz Admin',
  description: 'Manage integrations for Razorpay, WhatsApp Cloud API, Google Maps Platform, Firebase Push, and GST Filing Connectors.',
};

export default function IntegrationsPage() {
  const connectors = [
    { name: 'Razorpay Payment Gateway', status: 'connected', latency: '42ms', category: 'Payments' },
    { name: 'WhatsApp Cloud Business API', status: 'connected', latency: '120ms', category: 'Messaging' },
    { name: 'Google Maps Places & Directions API', status: 'connected', latency: '65ms', category: 'Geolocation' },
    { name: 'Firebase Cloud Messaging (FCM)', status: 'connected', latency: '35ms', category: 'Push Notifications' },
    { name: 'GST E-Invoice Sandbox API', status: 'standby', latency: '180ms', category: 'Taxation' },
  ];

  return (
    <main className="min-h-screen bg-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Layers className="w-4 h-4" />
              Connector Mesh
            </div>
            <h1 className="font-heading text-3xl font-extrabold text-white">
              Third-Party Integration Health & Credentials
            </h1>
          </div>
        </div>

        {/* Connectors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {connectors.map((c, i) => (
            <div key={i} className="bg-slate-800 p-6 rounded-3xl border border-slate-700 space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-white text-base block">{c.name}</span>
                  <span className="text-xs text-slate-400">{c.category} • Latency: {c.latency}</span>
                </div>

                <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 ${
                  c.status === 'connected' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {c.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
