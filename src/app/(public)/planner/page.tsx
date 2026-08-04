'use client';

import React, { useState } from 'react';
import { Sparkles, Compass, MapPin, Calendar, DollarSign, Users, CheckCircle2, MessageSquare, RefreshCw } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/lib/routes';

interface AIPlanResult {
  destination: string;
  totalDays: number;
  estimatedBudgetPerPerson: number;
  estimatedTotal: number;
  itinerary: { day: number; title: string; activities: string[] }[];
  suggestedExperiences: string[];
  recommendedPackage: string;
}

const SUPPORTED_DESTINATIONS = [
  { name: 'Kodaikanal', vibe: 'Misty & Romantic' },
  { name: 'Ooty', vibe: 'Scenic & Heritage' },
  { name: 'Valparai', vibe: 'Wilderness & Coffee' },
];

export default function AIPlannerPage() {
  const [step, setStep] = useState<number>(1);
  const [destination, setDestination] = useState<string>('Kodaikanal');
  const [travelStyle, setTravelStyle] = useState<string>('Adventure & Nature');
  const [days, setDays] = useState<number>(3);
  const [budgetRange, setBudgetRange] = useState<string>('₹4,000 - ₹6,000');
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);
  const [preferenceNotes, setPreferenceNotes] = useState<string>('');

  const [generating, setGenerating] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<AIPlanResult | null>(null);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setAiResult({
        destination,
        totalDays: days,
        estimatedBudgetPerPerson: 4999,
        estimatedTotal: 4999 * (adults + children * 0.5),
        itinerary: [
          { day: 1, title: 'Arrival & Misty Lakeside Chill', activities: ['Cottage check-in', 'Sunset lake walk & tea', 'Acoustic bonfire session'] },
          { day: 2, title: 'Cliff Treks & Waterfall Swims', activities: ['Sunrise viewpoint walk', 'Dolphin’s Nose trek', 'Barbecue under night sky'] },
          { day: 3, title: 'Offbeat Meadows & Farewell', activities: ['Drive to Mannavanur sheep farm', 'Local artisan chocolate tasting', 'Return transfers'] }
        ],
        suggestedExperiences: ['Cliffside Stargazing', 'Secret Waterfall Trek'],
        recommendedPackage: 'Misty Kodaikanal Escape'
      });
      setGenerating(false);
      setStep(3);
    }, 1200);
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen pt-32 pb-24">
      <Container className="max-w-4xl">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-brand-orange text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Conversational Engine</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">AI Trip Planner</h1>
          <p className="text-slate-400 text-base mt-3">
            Build your ideal itinerary, budget breakdown, and curated vibe in seconds for Kodaikanal, Ooty, and Valparai.
          </p>
        </div>

        {/* Wizard Container */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-10 shadow-elevated">
          {/* Step 1: Preferences Selection */}
          {step === 1 && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <span className="text-xs font-bold text-brand-orange uppercase">Step 1 of 2: Trip Parameters</span>
                <span className="text-xs text-slate-500">Fast & Accountless</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Destination */}
                <div>
                  <label className="text-xs font-bold text-slate-300 mb-2 block flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-brand-orange" /> Target Destination
                  </label>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-orange"
                  >
                    {SUPPORTED_DESTINATIONS.map((d) => (
                      <option key={d.name} value={d.name}>{d.name} ({d.vibe})</option>
                    ))}
                  </select>
                </div>

                {/* Travel Style */}
                <div>
                  <label className="text-xs font-bold text-slate-300 mb-2 block flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-brand-orange" /> Travel Vibe / Style
                  </label>
                  <select
                    value={travelStyle}
                    onChange={(e) => setTravelStyle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-orange"
                  >
                    <option value="Adventure & Nature">Adventure & Nature</option>
                    <option value="Weekend Reset">Weekend Reset</option>
                    <option value="Family Comfort">Family Comfort</option>
                    <option value="Heritage Trail">Heritage Trail</option>
                  </select>
                </div>

                {/* Duration */}
                <div>
                  <label className="text-xs font-bold text-slate-300 mb-2 block flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-brand-orange" /> Duration (Days)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={14}
                    value={days}
                    onChange={(e) => setDays(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-orange"
                  />
                </div>

                {/* Budget */}
                <div>
                  <label className="text-xs font-bold text-slate-300 mb-2 block flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-brand-orange" /> Budget per Person
                  </label>
                  <select
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-orange"
                  >
                    <option value="₹3,000 - ₹5,000">₹3,000 - ₹5,000 (Pocket Friendly)</option>
                    <option value="₹5,000 - ₹8,000">₹5,000 - ₹8,000 (Balanced Vibe)</option>
                    <option value="₹8,000+">₹8,000+ (Premium Comfort)</option>
                  </select>
                </div>

                {/* Adults */}
                <div>
                  <label className="text-xs font-bold text-slate-300 mb-2 block flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-brand-orange" /> Adults (12+ yrs)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={adults}
                    onChange={(e) => setAdults(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-orange"
                  />
                </div>

                {/* Children */}
                <div>
                  <label className="text-xs font-bold text-slate-300 mb-2 block flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-brand-orange" /> Children (Below 12 yrs)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={children}
                    onChange={(e) => setChildren(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-orange"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 mb-2 block">
                  Special Notes & Preferences
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. We love campfire BBQ, bonfire music, and prefer private stays with scenic balconies..."
                  value={preferenceNotes}
                  onChange={(e) => setPreferenceNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <Button
                  onClick={handleGenerate}
                  variant="primary"
                  size="lg"
                  icon={<Sparkles className="w-5 h-5" />}
                  className="shadow-button"
                >
                  Generate AI Itinerary
                </Button>
              </div>
            </div>
          )}

          {/* Loading state */}
          {generating && (
            <div className="text-center py-20">
              <RefreshCw className="w-10 h-10 text-brand-orange animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white">Synthesizing Your Custom Vibe...</h3>
              <p className="text-xs text-slate-400 mt-2">Checking mountain weather, stays, experiences & pricing.</p>
            </div>
          )}

          {/* Step 3: Generated AI Result */}
          {step === 3 && aiResult && !generating && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-bold text-brand-orange uppercase">AI Recommended Plan</span>
                  <h2 className="text-2xl font-bold text-white mt-1">{aiResult.destination} — {aiResult.totalDays} Days Custom Vibe</h2>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 border border-slate-800 px-3 py-1.5 rounded-lg"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Re-plan
                </button>
              </div>

              {/* Estimate Pill */}
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-400 block">Est. Cost Per Person</span>
                  <span className="text-2xl font-extrabold text-white">₹{aiResult.estimatedBudgetPerPerson.toLocaleString('en-IN')}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Squad Total ({adults} Adults)</span>
                  <span className="text-xl font-bold text-brand-orange">₹{aiResult.estimatedTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Day-by-Day */}
              <div>
                <h3 className="text-base font-bold text-white mb-4">Generated Itinerary</h3>
                <div className="space-y-4">
                  {aiResult.itinerary.map((day) => (
                    <div key={day.day} className="bg-slate-950 border border-slate-800 p-5 rounded-xl">
                      <span className="text-xs font-extrabold text-brand-orange uppercase block mb-1">Day {day.day}</span>
                      <h4 className="text-sm font-bold text-white mb-2">{day.title}</h4>
                      <ul className="space-y-1.5">
                        {day.activities.map((act, i) => (
                          <li key={i} className="text-xs text-slate-300 flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-brand-orange shrink-0" />
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTAs */}
              <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row gap-4">
                <Button
                  href={`${ROUTES.ENQUIRE}?destination=${encodeURIComponent(aiResult.destination)}&budget=${encodeURIComponent(budgetRange)}&adults=${adults}&children=${children}&message=${encodeURIComponent(`AI Plan for ${aiResult.destination} (${aiResult.totalDays} Days). Notes: ${preferenceNotes}`)}`}
                  variant="primary"
                  size="lg"
                  className="w-full justify-center shadow-button"
                  icon={<MessageSquare className="w-5 h-5" />}
                >
                  Convert to Enquiry & Get Reference ID
                </Button>
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
