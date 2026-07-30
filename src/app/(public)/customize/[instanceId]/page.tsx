'use client';

import React, { useState, use } from 'react';
import { SlidersHorizontal, RefreshCw, Check, ArrowRight, ShieldCheck, Hotel, Compass, AlertCircle } from 'lucide-react';
import { recalculateCustomizedItinerary } from '@/lib/actions/customization';
import { IncrementalReplannerResponse, AffectedNode } from '@/lib/types/customization';
import Link from 'next/link';

export default function CustomizePage({ params }: { params: Promise<{ instanceId: string }> }) {
  const { instanceId } = use(params);
  const [selectedHotel, setSelectedHotel] = useState('3-Star MAP Hilltop Resort');
  const [selectedActivity, setSelectedActivity] = useState('Kodai Lake Boating');
  const [passengerCount, setPassengerCount] = useState(2);
  const [recalculating, setRecalculating] = useState(false);
  const [replannerResult, setReplannerResult] = useState<IncrementalReplannerResponse | null>(null);

  const handleApplyNodeEdit = async (actionType: 'swap_hotel' | 'swap_activity') => {
    setRecalculating(true);
    const result = await recalculateCustomizedItinerary({
      instanceId,
      edits: [
        {
          dayId: '33333333-3333-3333-3333-333333333301',
          segmentId: actionType === 'swap_hotel' ? 'seg-hotel-1' : 'seg-activity-1',
          action: actionType,
          newCost: actionType === 'swap_hotel' ? 8500 : 750,
          newTitle: actionType === 'swap_hotel' ? selectedHotel : selectedActivity,
        }
      ],
      passengerCount,
    });

    setReplannerResult(result);
    setRecalculating(false);
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600" />
              Incremental Replanner Engine
            </span>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900">
              Customize Stays & Activity Offerings
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm">
              Edits dynamically recalculate ONLY affected nodes. Whole itinerary is never destroyed.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block">Total Recalculated Cost</span>
            <span className="text-3xl font-extrabold text-slate-900">
              ₹{(replannerResult?.newTotalGross || 29000).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Customization Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Hotel Upgrade Node */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Hotel className="w-5 h-5 text-indigo-500" />
                <h3 className="font-heading font-bold text-slate-900 text-base">Hotel Room Category Node</h3>
              </div>
              <span className="text-xs font-semibold text-slate-400">Day 1 - Day 3</span>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 uppercase block">Select Accommodation Level</label>
              <div className="space-y-2">
                {[
                  { name: '3-Star MAP Hilltop Resort', price: 6500 },
                  { name: '4-Star Premium Valley View Suite', price: 8500 },
                  { name: '5-Star Luxury Heritage Villa', price: 12000 }
                ].map((h, i) => (
                  <label key={i} className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    selectedHotel === h.name ? 'border-amber-500 bg-amber-50/50 text-slate-900 font-bold' : 'border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}>
                    <div className="flex items-center gap-2 text-xs">
                      <input
                        type="radio"
                        name="hotel"
                        checked={selectedHotel === h.name}
                        onChange={() => setSelectedHotel(h.name)}
                        className="text-amber-600 focus:ring-amber-500"
                      />
                      <span>{h.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-500">₹{h.price.toLocaleString('en-IN')}</span>
                  </label>
                ))}
              </div>

              <button
                onClick={() => handleApplyNodeEdit('swap_hotel')}
                disabled={recalculating}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-amber-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
              >
                {recalculating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                Recalculate Hotel Node
              </button>
            </div>
          </div>

          {/* Activity Swap Node */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-emerald-500" />
                <h3 className="font-heading font-bold text-slate-900 text-base">Activity Offering Node</h3>
              </div>
              <span className="text-xs font-semibold text-slate-400">Day 1 Evening</span>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 uppercase block">Select Activity Experience</label>
              <div className="space-y-2">
                {[
                  { name: 'Kodai Lake 4-Seater Boat Ride', price: 350 },
                  { name: 'Zipline Adventure Pass', price: 750 },
                  { name: 'Private Sunset Horse Riding', price: 1200 }
                ].map((act, i) => (
                  <label key={i} className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    selectedActivity === act.name ? 'border-amber-500 bg-amber-50/50 text-slate-900 font-bold' : 'border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}>
                    <div className="flex items-center gap-2 text-xs">
                      <input
                        type="radio"
                        name="activity"
                        checked={selectedActivity === act.name}
                        onChange={() => setSelectedActivity(act.name)}
                        className="text-amber-600 focus:ring-amber-500"
                      />
                      <span>{act.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-500">₹{act.price}</span>
                  </label>
                ))}
              </div>

              <button
                onClick={() => handleApplyNodeEdit('swap_activity')}
                disabled={recalculating}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-amber-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
              >
                {recalculating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                Recalculate Activity Node
              </button>
            </div>
          </div>
        </div>

        {/* Affected Node Audit Feedback */}
        {replannerResult && replannerResult.affectedNodes.length > 0 && (
          <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-200 space-y-3 animate-in fade-in">
            <h4 className="font-heading font-bold text-emerald-900 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Incremental Replanner Audit Log
            </h4>
            <div className="space-y-2">
              {replannerResult.affectedNodes.map((node, idx) => (
                <div key={idx} className="text-xs text-emerald-800 bg-white p-3 rounded-xl border border-emerald-100">
                  {node.recalculatedReason}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Proceed to Checkout */}
        <div className="flex justify-end pt-4">
          <Link
            href={`/checkout/${instanceId}`}
            className="px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-amber-600 text-white font-bold text-sm transition-colors shadow-lg flex items-center gap-2"
          >
            Proceed to Checkout
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
