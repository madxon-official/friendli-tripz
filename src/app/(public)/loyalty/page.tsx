import React from 'react';
import { getUserLoyaltyAccount } from '@/lib/actions/loyalty';
import { Award, Gift, Copy, Share2, Tag, ArrowRight, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Friendli Loyalty Rewards & Referral Wallet | Friendli Tripz',
  description: 'Earn reward points on every trip booking, unlock tier progress, and share your referral code for bonus travel credits.',
};

export default async function LoyaltyPage() {
  const loyalty = await getUserLoyaltyAccount();

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Wallet Balance Hero Card */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Award className="w-64 h-64 text-amber-400" />
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Friendli Rewards Club
              </span>
              <h1 className="font-heading text-3xl font-extrabold text-white">
                {loyalty.tier} Member Wallet
              </h1>
            </div>

            <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 text-center">
              <span className="text-xs text-slate-300 block">Reward Points Balance</span>
              <span className="text-3xl font-extrabold text-amber-400">{loyalty.pointsBalance.toLocaleString('en-IN')} pts</span>
            </div>
          </div>

          {/* Tier Progress Bar */}
          <div className="relative z-10 space-y-2 pt-4 border-t border-slate-800">
            <div className="flex justify-between text-xs text-slate-300 font-semibold">
              <span>Silver</span>
              <span className="text-amber-400">Gold Tier (Current)</span>
              <span>Platinum</span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-500 to-amber-300 w-3/4" />
            </div>
          </div>
        </div>

        {/* Referral Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-heading font-bold text-slate-900 text-base flex items-center gap-2">
            <Gift className="w-5 h-5 text-amber-500" />
            Refer Friends & Earn ₹1,000 Travel Credit
          </h3>

          <p className="text-xs text-slate-600 leading-relaxed">
            Give your friends 5% off their first trip, and get 1,000 reward points (₹1,000 value) added to your wallet when they complete their journey.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-full sm:flex-1 p-3 bg-slate-50 rounded-2xl border border-slate-200 font-mono text-sm font-bold text-slate-900 text-center sm:text-left">
              {loyalty.referralCode}
            </div>

            <button className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-900 hover:bg-amber-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2">
              <Share2 className="w-3.5 h-3.5" />
              Share Referral Code
            </button>
          </div>
        </div>

        {/* Recent Points Transactions */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-heading font-bold text-slate-900 text-base">Points History</h3>
          <div className="space-y-3">
            {loyalty.transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">{tx.description}</span>
                  <span className="text-[11px] text-slate-400">{new Date(tx.createdAt).toLocaleDateString()}</span>
                </div>
                <span className="font-extrabold text-emerald-600 text-sm">+{tx.points} pts</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
