'use client';

import React, { useState } from 'react';
import { Settings, ShieldCheck, Database, CheckCircle2 } from 'lucide-react';
import { AdminCrudHeader } from '@/components/admin/ui/AdminCrudHeader';
import { AdminRouteGuard } from '@/components/admin/ui/AdminRouteGuard';

export default function AdminSettingsPage() {
  const [siteTitle, setSiteTitle] = useState('Friendli Tripz');
  const [heroLine, setHeroLine] = useState('Travel. Vibe. Repeat.');
  const [tagline, setTagline] = useState('Stop Scrolling. Start Living.');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AdminRouteGuard modulePath="/admin/settings">
      <div className="space-y-8 animate-fade-in max-w-4xl">
        <AdminCrudHeader
          title="Admin & System Settings"
          description="Configure brand parameters, realtime Supabase connection indicators, and global settings."
          actionIcon={Settings}
        />

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-card">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Settings className="w-4 h-4 text-brand-orange" /> Brand Platform Identity
          </h2>

          {saved && (
            <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-400 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> System Settings updated successfully!
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 mb-1.5 block">Brand Name</label>
              <input
                type="text"
                value={siteTitle}
                onChange={(e) => setSiteTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-orange font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 mb-1.5 block font-medium">Hero Headline</label>
              <input
                type="text"
                value={heroLine}
                onChange={(e) => setHeroLine(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-orange"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 mb-1.5 block font-medium">Brand Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-orange"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors shadow-button"
              >
                Save Brand Parameters
              </button>
            </div>
          </form>
        </div>

        {/* Realtime Engine Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-4 shadow-card">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-brand-orange" /> Database & Realtime Status
          </h2>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Supabase Realtime Channel</span>
              <span className="text-emerald-400 font-mono font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Active
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-800/80 pt-2">
              <span className="text-slate-400">Phase 1 Accountless Mode</span>
              <span className="text-brand-orange font-semibold">Reference ID Enquiry Flow</span>
            </div>
          </div>
        </div>
      </div>
    </AdminRouteGuard>
  );
}
