'use client';

import React, { useState } from 'react';
import { Home, Sparkles, Plus, Edit, CheckCircle2 } from 'lucide-react';
import { AdminCrudHeader } from '@/components/admin/ui/AdminCrudHeader';
import { TravelStyle } from '@/lib/types/platform';
import { IMAGE_REGISTRY } from '@/lib/constants/imageRegistry';

const INITIAL_TRAVEL_STYLES: TravelStyle[] = [
  { id: 'style-1', title: 'Weekend Escape', description: 'Quick 2-3 day mountain resets', icon_name: 'Calendar', image_url: IMAGE_REGISTRY.kodaikanal.hero, count: 18 },
  { id: 'style-2', title: 'Adventure', description: 'Ridge treks, waterfall swims & offroad jeeps', icon_name: 'Compass', image_url: IMAGE_REGISTRY.valparai.hero, count: 12 },
  { id: 'style-3', title: 'Nature', description: 'Misty pine forest trails & quiet coffee walks', icon_name: 'Trees', image_url: IMAGE_REGISTRY.kodaikanal.cover, count: 15 },
  { id: 'style-4', title: 'Family', description: 'Comfort stays & botanical gardens', icon_name: 'Users', image_url: IMAGE_REGISTRY.ooty.hero, count: 10 },
  { id: 'style-5', title: 'Romantic', description: 'Cozy cottage stays & lakeside sunsets', icon_name: 'Sparkles', image_url: IMAGE_REGISTRY.kodaikanal.cover, count: 14 },
  { id: 'style-6', title: 'Road Trip', description: '40 hairpin bends drive & tea estate climbs', icon_name: 'Car', image_url: IMAGE_REGISTRY.valparai.cover, count: 9 },
];

export default function AdminHomepageCMSPage() {
  const [heroHeadline, setHeroHeadline] = useState('Explore Kodaikanal, Ooty & Valparai');
  const [heroTagline, setHeroTagline] = useState('Stop Scrolling. Start Living.');
  const [styles] = useState<TravelStyle[]>(INITIAL_TRAVEL_STYLES);
  const [saved, setSaved] = useState(false);

  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      <AdminCrudHeader
        title="Homepage CMS"
        description="Customize main hero line, taglines, travel style categories, and featured section order."
      />

      {/* Hero Banner CMS */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-card">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Home className="w-4 h-4 text-brand-orange" /> Main Hero Banner Settings
        </h2>

        {saved && (
          <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Homepage Hero Settings updated live!
          </div>
        )}

        <form onSubmit={handleSaveHero} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-300 mb-1.5 block">Headline (H1)</label>
            <input
              type="text"
              value={heroHeadline}
              onChange={(e) => setHeroHeadline(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-orange font-bold"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 mb-1.5 block font-medium">Tagline / Subheading</label>
            <input
              type="text"
              value={heroTagline}
              onChange={(e) => setHeroTagline(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-orange"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors shadow-button"
            >
              Save Hero Settings
            </button>
          </div>
        </form>
      </div>

      {/* Travel Styles Grid CMS */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-card">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-orange" /> Travel Style Categories ({styles.length})
          </h2>
          <button className="text-xs font-bold bg-slate-800 text-slate-200 px-3 py-1.5 rounded-xl flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" /> Add Style
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {styles.map((st) => (
            <div key={st.id} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">{st.title}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-1">{st.description}</p>
              </div>
              <button className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800">
                <Edit className="w-3.5 h-3.5 text-brand-orange" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
