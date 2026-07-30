'use client';

import React, { useState } from 'react';
import { Bot, Sparkles, Send, AlertTriangle, ShieldCheck, HelpCircle, CheckCircle2 } from 'lucide-react';
import { processOperationsCopilotQuery } from '@/lib/actions/copilot';
import { CopilotQueryResponse } from '@/lib/types/copilot';

const SAMPLE_QUERIES = [
  "Which departures are at risk?",
  "Which vendors have poor ratings?",
  "Which customers have overdue payments?",
  "Generate departure briefing for today"
];

export default function AICopilotPage() {
  const [queryInput, setQueryInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copilotResponse, setCopilotResponse] = useState<CopilotQueryResponse | null>(null);

  const handleRunQuery = async (customQ?: string) => {
    const q = customQ || queryInput;
    if (!q.trim()) return;

    setLoading(true);
    const res = await processOperationsCopilotQuery(q);
    setCopilotResponse(res);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-700 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Bot className="w-4 h-4 text-amber-400" />
              AI Operations Copilot (Read-Only Assistant)
            </span>
            <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded">
              Zero Direct DB Mutation Rule Enforced
            </span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
            Ask Any Natural Language Operational Question
          </h1>
        </div>

        {/* Input Bar */}
        <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700 space-y-4">
          <div className="flex items-center gap-2">
            <input
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder='e.g., "Which departures are at risk?" or "Which vendors have poor ratings?"'
              className="w-full text-sm p-4 rounded-2xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
            />
            <button
              onClick={() => handleRunQuery()}
              disabled={loading || !queryInput.trim()}
              className="px-6 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shrink-0 shadow-md disabled:opacity-50"
            >
              Ask Copilot
            </button>
          </div>

          {/* Preset Query Chips */}
          <div className="flex flex-wrap gap-2 pt-2">
            {SAMPLE_QUERIES.map((q, i) => (
              <button
                key={i}
                onClick={() => {
                  setQueryInput(q);
                  handleRunQuery(q);
                }}
                className="text-xs bg-slate-900 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-xl border border-slate-700 transition-colors"
              >
                "{q}"
              </button>
            ))}
          </div>
        </div>

        {/* Output Response View */}
        {copilotResponse && (
          <div className="bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-700 space-y-6 animate-in fade-in">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm border-b border-slate-700 pb-3">
              <Sparkles className="w-4 h-4" />
              Copilot Intelligence Summary
            </div>

            <p className="text-sm text-slate-200 leading-relaxed font-medium bg-slate-900/60 p-4 rounded-2xl border border-slate-700">
              {copilotResponse.summaryText}
            </p>

            {copilotResponse.atRiskDepartures && (
              <div className="space-y-3">
                <h4 className="font-heading font-bold text-rose-400 text-xs uppercase tracking-wider">At Risk Departures Identified</h4>
                {copilotResponse.atRiskDepartures.map((d, i) => (
                  <div key={i} className="p-4 bg-slate-900/60 rounded-2xl border border-rose-800/40 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white block">{d.bookingCode}</span>
                      <span className="text-slate-400">{d.reason}</span>
                    </div>
                    <span className="font-extrabold text-rose-400 text-sm">Readiness: {d.readinessScore}%</span>
                  </div>
                ))}
              </div>
            )}

            {copilotResponse.vendorRecommendations && (
              <div className="space-y-3">
                <h4 className="font-heading font-bold text-amber-400 text-xs uppercase tracking-wider">Vendor Replacement Recommendations</h4>
                {copilotResponse.vendorRecommendations.map((v, i) => (
                  <div key={i} className="p-4 bg-slate-900/60 rounded-2xl border border-amber-800/40 space-y-1 text-xs">
                    <span className="font-bold text-white block">{v.vendorName} — {v.issue}</span>
                    <span className="text-emerald-400 font-semibold block">Recommended Action: {v.recommendedAlternative}</span>
                  </div>
                ))}
              </div>
            )}

            {copilotResponse.briefingNotes && (
              <div className="space-y-2 text-xs text-slate-300">
                <h4 className="font-heading font-bold text-white text-xs uppercase tracking-wider">Daily Briefing Bulletins</h4>
                <ul className="space-y-1">
                  {copilotResponse.briefingNotes.map((note, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
