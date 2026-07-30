import React from 'react';
import { getFinanceMetrics, getLedgerEntries } from '@/lib/actions/finance';
import { DollarSign, FileSpreadsheet, TrendingUp, PieChart, ShieldCheck, CreditCard, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const metadata = {
  title: 'Finance & Ledger Portal | Friendli Tripz Admin',
  description: 'General ledger explorer, customer receivables, vendor payables, GST/TDS filings, and margin profitability analysis.',
};

export default async function FinancePage() {
  const metrics = await getFinanceMetrics();
  const ledger = await getLedgerEntries();

  return (
    <main className="min-h-screen bg-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <DollarSign className="w-4 h-4" />
              Commercial Financial Engine
            </div>
            <h1 className="font-heading text-3xl font-extrabold text-white">
              Finance & General Ledger Platform
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4" />
              Export GST GSTR-3B Summary
            </button>
          </div>
        </div>

        {/* Financial KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-800 p-5 rounded-3xl border border-slate-700 space-y-2">
            <span className="text-xs text-slate-400 block font-semibold">Total Gross Turnover</span>
            <span className="text-2xl font-extrabold text-white">₹{metrics.totalRevenue.toLocaleString('en-IN')}</span>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" /> +18.4% vs last month
            </span>
          </div>

          <div className="bg-slate-800 p-5 rounded-3xl border border-slate-700 space-y-2">
            <span className="text-xs text-slate-400 block font-semibold">Net Commercial Margin</span>
            <span className="text-2xl font-extrabold text-emerald-400">₹{metrics.grossMargin.toLocaleString('en-IN')}</span>
            <span className="text-[11px] text-slate-400 font-semibold">Margin Rate: {metrics.marginPercentage}%</span>
          </div>

          <div className="bg-slate-800 p-5 rounded-3xl border border-slate-700 space-y-2">
            <span className="text-xs text-slate-400 block font-semibold">Customer Receivables</span>
            <span className="text-2xl font-extrabold text-amber-400">₹{metrics.customerReceivables.toLocaleString('en-IN')}</span>
            <span className="text-[11px] text-slate-400">Due 3 days before departure</span>
          </div>

          <div className="bg-slate-800 p-5 rounded-3xl border border-slate-700 space-y-2">
            <span className="text-xs text-slate-400 block font-semibold">Vendor Payables Queue</span>
            <span className="text-2xl font-extrabold text-blue-400">₹{metrics.vendorPayables.toLocaleString('en-IN')}</span>
            <span className="text-[11px] text-slate-400">Pending weekly settlement</span>
          </div>
        </div>

        {/* General Ledger Table */}
        <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700 space-y-4 shadow-xl">
          <h3 className="font-heading font-bold text-white text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            General Ledger Double-Entry Audit Stream
          </h3>

          <div className="divide-y divide-slate-700/60 text-xs">
            {ledger.map((entry) => (
              <div key={entry.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-400">{entry.entryCode}</span>
                    <span className="bg-slate-700 text-slate-300 px-2 py-0.5 rounded font-mono">{entry.accountType}</span>
                  </div>
                  <p className="text-slate-300">{entry.description}</p>
                </div>

                <div className="flex items-center gap-6 font-mono text-sm">
                  {entry.debitAmount > 0 ? (
                    <span className="text-emerald-400 font-bold">DR: +₹{entry.debitAmount.toLocaleString('en-IN')}</span>
                  ) : (
                    <span className="text-blue-400 font-bold">CR: -₹{entry.creditAmount.toLocaleString('en-IN')}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
