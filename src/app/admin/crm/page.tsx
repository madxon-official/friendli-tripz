import React from 'react';
import { getCustomerProfiles } from '@/lib/actions/crm';
import { Users, Award, Heart, Star, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'CRM Customer Intelligence | Friendli Tripz Admin',
  description: 'Customer profiles, travel history, lifetime value (LTV), segmentation tiers, and referral tracking.',
};

export default async function CRMPage() {
  const profiles = await getCustomerProfiles();

  return (
    <main className="min-h-screen bg-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Users className="w-4 h-4" />
              Customer Relationship Intelligence
            </div>
            <h1 className="font-heading text-3xl font-extrabold text-white">
              Customer Profiles & LTV Segmentation ({profiles.length})
            </h1>
          </div>
        </div>

        {/* Profiles Table */}
        <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700 space-y-4 shadow-xl">
          <div className="divide-y divide-slate-700/60 text-xs">
            {profiles.map((p) => (
              <div key={p.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-base">{p.fullName}</span>
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded font-semibold text-[10px]">
                      {p.segmentTier}
                    </span>
                  </div>
                  <span className="text-slate-400 block">{p.email} • {p.phone} • Style: {p.preferredTravelStyle}</span>
                </div>

                <div className="flex items-center gap-6 text-right">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Trips Completed</span>
                    <span className="font-bold text-white text-sm">{p.totalTripsCompleted} Trips</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Lifetime Value (LTV)</span>
                    <span className="font-extrabold text-emerald-400 text-base">₹{p.lifetimeValue.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
