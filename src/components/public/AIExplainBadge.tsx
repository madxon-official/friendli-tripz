'use client';

import React, { useState } from 'react';
import { Sparkles, Info, CheckCircle2 } from 'lucide-react';
import { AIExplanation } from '@/lib/types/ai';

interface AIExplainBadgeProps {
  explanations: AIExplanation[];
}

export const AIExplainBadge: React.FC<AIExplainBadgeProps> = ({ explanations }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 transition-colors shadow-sm cursor-pointer"
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
        <span>Why this trip was chosen</span>
        <Info className="w-3.5 h-3.5 text-amber-700 ml-0.5" />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl p-5 border border-slate-200 shadow-2xl z-50 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h4 className="font-heading font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              AI Recommendation Rationale
            </h4>
            <button onClick={() => setOpen(false)} className="text-xs text-slate-400 hover:text-slate-600">✕</button>
          </div>

          <div className="space-y-2.5">
            {explanations.map((exp, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 capitalize block">
                    {exp.reasoningType.replace('_', ' ')} (Match: {Math.round(exp.confidenceScore * 100)}%)
                  </span>
                  <p className="text-slate-600 text-[11px] leading-relaxed mt-0.5">
                    {exp.explanationText}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
