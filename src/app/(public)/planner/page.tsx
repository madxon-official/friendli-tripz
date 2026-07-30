'use client';

import React, { useState } from 'react';
import { Sparkles, ArrowRight, Loader2, Compass, CheckCircle2, ShieldCheck, DollarSign } from 'lucide-react';
import { processAIPlannerPrompt } from '@/lib/actions/ai_planner';
import { AIPlannerResponse } from '@/lib/types/ai';
import { ItineraryTimeline } from '@/components/public/ItineraryTimeline';
import { AIExplainBadge } from '@/components/public/AIExplainBadge';
import Link from 'next/link';

const EXAMPLES = [
  "I have 4 days, I love waterfalls, budget is ₹25000",
  "I don't like trekking, need relaxed honeymoon trip",
  "3 days family vacation in Kodaikanal with boating",
  "Weekend adventure trip with ziplining under ₹15000"
];

export default function AIPlannerPage() {
  const [promptText, setPromptText] = useState('');
  const [passengers, setPassengers] = useState(2);
  const [loading, setLoading] = useState(false);
  const [plannerResult, setPlannerResult] = useState<AIPlannerResponse | null>(null);

  const handleRunPlanner = async (customPrompt?: string) => {
    const activePrompt = customPrompt || promptText;
    if (!activePrompt.trim()) return;

    setLoading(true);
    const result = await processAIPlannerPrompt(activePrompt, passengers);
    setPlannerResult(result);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            Friendli AI Constraint Planner
          </span>
          <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
            Tell Us Your Dream Trip in Plain English
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Our AI extracts constraints and deterministically compiles bookable itineraries backed by live pricing, route optimization, and vendor inventory.
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-6">
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Describe your travel preferences, budget, or dislikes
            </label>
            <textarea
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              rows={3}
              placeholder='e.g., "I have 4 days, I love waterfalls, my budget is ₹25000, and I don’t like trekking."'
              className="w-full text-sm sm:text-base p-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-slate-50/50"
            />
          </div>

          {/* Quick Example Chips */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Try these natural language prompts:</span>
            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setPromptText(ex);
                    handleRunPlanner(ex);
                  }}
                  className="text-xs bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-900 border border-slate-200 hover:border-amber-300 px-3 py-1.5 rounded-xl font-medium transition-all"
                >
                  "{ex}"
                </button>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700">Travellers:</span>
              <select
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
                className="text-xs font-bold p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-amber-500"
              >
                <option value={1}>1 Solo Traveller</option>
                <option value={2}>2 Adults (Couple)</option>
                <option value={3}>3 Travellers</option>
                <option value={4}>4 Travellers (Group)</option>
              </select>
            </div>

            <button
              onClick={() => handleRunPlanner()}
              disabled={loading || !promptText.trim()}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-amber-600 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Solving Constraint Graph...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Generate Bookable Itinerary
                </>
              )}
            </button>
          </div>
        </div>

        {/* Generated Result Output */}
        {plannerResult && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Recommendation Header */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Constraint Graph Solved
                  </span>
                  <AIExplainBadge explanations={plannerResult.explanations} />
                </div>
                <h2 className="font-heading text-2xl font-bold text-slate-900">
                  Bookable Custom Itinerary ({plannerResult.constraints.durationDays} Days)
                </h2>
              </div>

              <div className="flex items-center gap-4">
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Calculated Package Cost</span>
                  <span className="text-2xl font-extrabold text-slate-900">
                    ₹{plannerResult.totalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
                <Link
                  href={`/checkout/${plannerResult.instanceId}`}
                  className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-amber-600 text-white font-bold text-xs transition-colors shadow-md flex items-center gap-2"
                >
                  Book This Plan
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Itinerary Timeline */}
            <ItineraryTimeline itinerary={plannerResult.itinerary} />
          </div>
        )}
      </div>
    </main>
  );
}
