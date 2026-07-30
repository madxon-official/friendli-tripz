import React from 'react';
import { getMarketingCampaigns } from '@/lib/actions/marketing';
import { Megaphone, MessageSquare, Send, Sparkles, TrendingUp } from 'lucide-react';

export const metadata = {
  title: 'Marketing & Broadcast Campaigns | Friendli Tripz Admin',
  description: 'WhatsApp broadcasts, email campaigns, SMS alerts, coupon engine, and UTM conversion analytics.',
};

export default async function MarketingPage() {
  const campaigns = await getMarketingCampaigns();

  return (
    <main className="min-h-screen bg-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Megaphone className="w-4 h-4" />
              Omnichannel Marketing Engine
            </div>
            <h1 className="font-heading text-3xl font-extrabold text-white">
              Broadcast Campaigns & UTM Analytics
            </h1>
          </div>

          <button className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-2">
            + Create New Campaign
          </button>
        </div>

        {/* Campaigns List */}
        <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700 space-y-4 shadow-xl">
          <h3 className="font-heading font-bold text-white text-lg">Active Broadcast Campaigns</h3>
          <div className="divide-y divide-slate-700/60 text-xs">
            {campaigns.map((c) => (
              <div key={c.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-base">{c.campaignName}</span>
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-semibold text-[10px]">
                      {c.channel}
                    </span>
                  </div>
                  <span className="text-slate-400 block">Target: {c.targetSegment}</span>
                </div>

                <div className="flex items-center gap-6 text-right font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Broadcast Sent</span>
                    <span className="font-bold text-white text-sm">{c.sentCount.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Conversions</span>
                    <span className="font-extrabold text-emerald-400 text-base">{c.conversionCount}</span>
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
