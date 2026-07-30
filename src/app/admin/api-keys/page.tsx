import React from 'react';
import { Key, Webhook, ShieldCheck, Activity, Plus, Copy } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Public API & Webhooks Engine | Friendli Tripz Admin',
  description: 'API key management, partner webhook subscriptions, rate limiting, and REST analytics.',
};

export default function APIKeysPage() {
  return (
    <main className="min-h-screen bg-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Key className="w-4 h-4" />
              Developer API & Webhook Engine
            </div>
            <h1 className="font-heading text-3xl font-extrabold text-white">
              Public API Keys & Partner Subscriptions
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/openapi.json"
              target="_blank"
              className="px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 hover:border-amber-500 font-bold text-xs transition-colors"
            >
              View OpenAPI Spec (v3.0.3)
            </Link>
          </div>
        </div>

        {/* API Key List */}
        <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-white text-lg">Active Partner API Keys</h3>
            <button className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              Generate API Key
            </button>
          </div>

          <div className="divide-y divide-slate-700/60 text-xs">
            <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-base">MakeMyTrip Partner Integration</span>
                  <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono text-[10px]">
                    pk_live_mmt_89012
                  </span>
                </div>
                <span className="text-slate-400 block">Rate Limit: 120 req/min • Last Used: 2 mins ago</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/30">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
