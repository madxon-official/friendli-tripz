import React from 'react';
import { PieChart, TrendingUp, Sparkles, LineChart } from 'lucide-react';

export const metadata = {
  title: 'Business Intelligence & Forecasting | Friendli Tripz Admin',
  description: 'Predictive occupancy, demand forecasting, seasonality cohort analysis, and profitability heatmaps.',
};

export default function BIPage() {
  return (
    <main className="min-h-screen bg-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <PieChart className="w-4 h-4" />
              Predictive BI Suite
            </div>
            <h1 className="font-heading text-3xl font-extrabold text-white">
              Business Intelligence & Demand Forecasting
            </h1>
          </div>
        </div>

        {/* Predictive Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 space-y-3">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">Occupancy Prediction</span>
            <span className="text-3xl font-extrabold text-white">88.5%</span>
            <p className="text-xs text-slate-400">Predicted hotel room lock rate for upcoming Diwali season (Oct 2026).</p>
          </div>

          <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 space-y-3">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">Demand Score</span>
            <span className="text-3xl font-extrabold text-white">92 / 100</span>
            <p className="text-xs text-slate-400">High seasonal search intent detected for Kodaikanal & Ooty tea estates.</p>
          </div>

          <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 space-y-3">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">Cohort Retention</span>
            <span className="text-3xl font-extrabold text-white">34.2%</span>
            <p className="text-xs text-slate-400">Repeat traveller rate within 6 months of initial booking.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
