'use me';
'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Package,
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  AlertCircle,
  Tag,
  Clock,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';
import {
  PackageFamily,
  PackageReleaseStatus,
  ItineraryDay,
  ItineraryDaySegment,
  SegmentType,
} from '@/lib/types/package';
import { Attraction } from '@/lib/types/attraction';
import { createPackageRelease, createPackageFamily } from '@/lib/actions/package';

interface PackageReleaseFormProps {
  families: PackageFamily[];
  destinations: { id: string; name: string }[];
  attractions: Attraction[];
  activityOfferings: { id: string; title: string }[];
}

export const PackageReleaseForm: React.FC<PackageReleaseFormProps> = ({
  families,
  destinations,
  attractions,
  activityOfferings,
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [familyMode, setFamilyMode] = useState<'existing' | 'new'>('existing');
  const [selectedFamilyId, setSelectedFamilyId] = useState(families[0]?.id || '');

  // New Family Fields (if familyMode === 'new')
  const [newFamilyName, setNewFamilyName] = useState('');
  const [newFamilySlug, setNewFamilySlug] = useState('');
  const [newFamilyDestId, setNewFamilyDestId] = useState(destinations[0]?.id || '');

  // Package Release Version Fields
  const [versionTag, setVersionTag] = useState('v1.0');
  const [title, setTitle] = useState('');
  const [durationDays, setDurationDays] = useState(3);
  const [durationNights, setDurationNights] = useState(2);

  // Pricing Tree
  const [baseAdultPrice, setBaseAdultPrice] = useState(14500);
  const [baseChildPrice, setBaseChildPrice] = useState(8500);
  const [singleSupplement, setSingleSupplement] = useState(4500);
  const [marginPercentage, setMarginPercentage] = useState(18);
  const [commercialTermsText, setCommercialTermsText] = useState(
    'Includes 3-Star MAP hotel, dedicated transport, lake boating tickets, and all entry passes.'
  );
  const [status, setStatus] = useState<PackageReleaseStatus>('draft');

  // Days & Segments Engine
  const [days, setDays] = useState<ItineraryDay[]>([
    {
      day_number: 1,
      theme_title: 'Arrival & Scenic Exploration',
      description: 'Check-in to hilltop resort, afternoon promenade, and scenic boating.',
      segments: [
        {
          sequence_order: 1,
          segment_type: 'lodging_transition',
          planned_start_time: '12:00',
          planned_end_time: '13:00',
          duration_mins: 60,
          segment_title: 'Resort Check-In & Refreshment',
          custom_instructions: 'Welcome drinks served on arrival.',
          is_included_in_package: true,
        },
      ],
    },
  ]);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAddDay = () => {
    const nextDayNum = days.length + 1;
    setDays([
      ...days,
      {
        day_number: nextDayNum,
        theme_title: `Day ${nextDayNum} Highlights`,
        description: 'Explore scenic attractions and activity experiences.',
        segments: [],
      },
    ]);
    setDurationDays(nextDayNum);
    setDurationNights(nextDayNum - 1);
  };

  const handleAddSegment = (dayIdx: number) => {
    const targetDay = days[dayIdx];
    const newSegOrder = targetDay.segments ? targetDay.segments.length + 1 : 1;
    const newSeg: ItineraryDaySegment = {
      sequence_order: newSegOrder,
      segment_type: 'attraction_visit',
      planned_start_time: '10:00',
      planned_end_time: '11:30',
      duration_mins: 90,
      segment_title: 'Sightseeing Visit',
      is_included_in_package: true,
    };

    const updatedDays = [...days];
    updatedDays[dayIdx].segments = [...(targetDay.segments || []), newSeg];
    setDays(updatedDays);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    startTransition(async () => {
      try {
        let familyIdToUse = selectedFamilyId;

        // If user is creating a new family on the fly
        if (familyMode === 'new') {
          const newFamily = await createPackageFamily({
            name: newFamilyName,
            family_slug: newFamilySlug,
            destination_id: newFamilyDestId,
          });
          familyIdToUse = newFamily.id;
        }

        const cleanedDays = days.map((d) => ({
          id: d.id,
          day_number: d.day_number,
          theme_title: d.theme_title,
          description: d.description,
          segments: (d.segments || []).map((s) => ({
            id: s.id,
            sequence_order: s.sequence_order,
            segment_type: s.segment_type,
            planned_start_time: s.planned_start_time || null,
            planned_end_time: s.planned_end_time || null,
            duration_mins: s.duration_mins,
            attraction_id: s.attraction_id || null,
            activity_offering_id: s.activity_offering_id || null,
            segment_title: s.segment_title,
            custom_instructions: s.custom_instructions || null,
            cost_override: s.cost_override || null,
            is_included_in_package: s.is_included_in_package,
          })),
        }));

        const payload = {
          family_id: familyIdToUse,
          version_tag: versionTag,
          title,
          duration_days: Number(durationDays),
          duration_nights: Number(durationNights),
          base_pricing_tree_json: {
            base_adult_price: Number(baseAdultPrice),
            base_child_price: Number(baseChildPrice),
            single_supplement: Number(singleSupplement),
            margin_percentage: Number(marginPercentage),
            gst_tax_percentage: 5,
            currency: 'INR',
          },
          commercial_terms_text: commercialTermsText,
          status,
          days: cleanedDays,
        };

        await createPackageRelease(payload);
        router.push('/admin/packages');
        router.refresh();
      } catch (err: unknown) {
        setErrorMessage(err instanceof Error ? err.message : 'Failed to create package release');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-24">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/packages"
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-orange font-mono">
              <Package className="w-3.5 h-3.5" />
              <span>Package Release Builder</span>
            </div>
            <h1 className="text-2xl font-heading font-black text-slate-900 tracking-tight mt-0.5">
              {title || 'New Package Release'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as PackageReleaseStatus)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white"
          >
            <option value="draft">Draft Version</option>
            <option value="active">Active Release</option>
            <option value="superseded">Superseded</option>
          </select>

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 bg-brand-orange text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-button hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isPending ? 'Publishing...' : 'Publish Package Release'}</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* SECTION 1: PACKAGE FAMILY IDENTITY */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-lg font-heading font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Layers className="w-5 h-5 text-brand-orange" />
          <span>1. Package Family Identity</span>
        </h2>

        <div className="flex items-center gap-4 text-xs font-mono font-bold">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="familyMode"
              checked={familyMode === 'existing'}
              onChange={() => setFamilyMode('existing')}
              className="text-brand-orange"
            />
            <span>Select Existing Family</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="familyMode"
              checked={familyMode === 'new'}
              onChange={() => setFamilyMode('new')}
              className="text-brand-orange"
            />
            <span>Create New Package Family</span>
          </label>
        </div>

        {familyMode === 'existing' ? (
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
              Target Package Family *
            </label>
            <select
              value={selectedFamilyId}
              onChange={(e) => setSelectedFamilyId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold bg-white"
            >
              {families.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.destination?.name})
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
                Family Name *
              </label>
              <input
                type="text"
                required
                value={newFamilyName}
                onChange={(e) => {
                  setNewFamilyName(e.target.value);
                  setNewFamilySlug(
                    e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9\s-]/g, '')
                      .trim()
                      .replace(/\s+/g, '-')
                  );
                }}
                placeholder="e.g. Misty Kodaikanal Escape"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
                Family Slug *
              </label>
              <input
                type="text"
                required
                value={newFamilySlug}
                onChange={(e) => setNewFamilySlug(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
                Destination *
              </label>
              <select
                value={newFamilyDestId}
                onChange={(e) => setNewFamilyDestId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold bg-white"
              >
                {destinations.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: RELEASE VERSION & PRICING TREE */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-lg font-heading font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Tag className="w-5 h-5 text-brand-orange" />
          <span>2. Version Metadata & Commercial Pricing Tree</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
              Release Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 4-Day Misty Kodaikanal Escape (Classic Release)"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
              Version Tag *
            </label>
            <input
              type="text"
              required
              value={versionTag}
              onChange={(e) => setVersionTag(e.target.value)}
              placeholder="v1.0"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
                Days
              </label>
              <input
                type="number"
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
                Nights
              </label>
              <input
                type="number"
                value={durationNights}
                onChange={(e) => setDurationNights(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono"
              />
            </div>
          </div>
        </div>

        {/* Pricing Matrix */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
            Commercial Pricing Breakdown (INR)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Adult Base Price (₹)</label>
              <input
                type="number"
                value={baseAdultPrice}
                onChange={(e) => setBaseAdultPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-mono font-bold text-emerald-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Child Price (₹)</label>
              <input
                type="number"
                value={baseChildPrice}
                onChange={(e) => setBaseChildPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Single Supplement (₹)</label>
              <input
                type="number"
                value={singleSupplement}
                onChange={(e) => setSingleSupplement(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Target Margin (%)</label>
              <input
                type="number"
                value={marginPercentage}
                onChange={(e) => setMarginPercentage(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: TEMPORAL DAY PLANNER & SEGMENTS EDITOR */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-lg font-heading font-extrabold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-brand-orange" />
            <span>3. Temporal Itinerary Segments</span>
          </h2>

          <button
            type="button"
            onClick={handleAddDay}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Day</span>
          </button>
        </div>

        {days.map((day, dayIdx) => (
          <div key={dayIdx} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-brand-orange text-white font-mono font-bold text-xs flex items-center justify-center">
                  D{day.day_number}
                </span>
                <input
                  type="text"
                  value={day.theme_title || ''}
                  onChange={(e) => {
                    const updated = [...days];
                    updated[dayIdx].theme_title = e.target.value;
                    setDays(updated);
                  }}
                  placeholder="Day Theme Title..."
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-sm font-bold bg-white"
                />
              </div>

              <button
                type="button"
                onClick={() => handleAddSegment(dayIdx)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-orange text-white text-xs font-bold hover:bg-orange-600 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Time Segment</span>
              </button>
            </div>

            {/* Segments Timeline List */}
            <div className="space-y-3 pl-4 border-l-2 border-brand-orange/30">
              {(!day.segments || day.segments.length === 0) ? (
                <p className="text-xs text-slate-400 font-mono py-2">No time segments added for Day {day.day_number} yet.</p>
              ) : (
                day.segments.map((seg, segIdx) => (
                  <div
                    key={segIdx}
                    className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <select
                        value={seg.segment_type}
                        onChange={(e) => {
                          const updated = [...days];
                          updated[dayIdx].segments![segIdx].segment_type = e.target.value as SegmentType;
                          setDays(updated);
                        }}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 font-mono font-bold bg-slate-50 text-slate-800"
                      >
                        <option value="attraction_visit">Attraction Visit</option>
                        <option value="activity_experience">Activity Experience</option>
                        <option value="transit_block">Transit Block</option>
                        <option value="meal_block">Meal Block</option>
                        <option value="leisure_block">Leisure / Free Time</option>
                        <option value="lodging_transition">Lodging Check-In</option>
                      </select>

                      <input
                        type="text"
                        value={seg.segment_title}
                        onChange={(e) => {
                          const updated = [...days];
                          updated[dayIdx].segments![segIdx].segment_title = e.target.value;
                          setDays(updated);
                        }}
                        placeholder="Segment Title..."
                        className="px-3 py-1.5 rounded-lg border border-slate-200 font-semibold flex-1"
                      />
                    </div>

                    <div className="flex items-center gap-3 font-mono">
                      <span>Start:</span>
                      <input
                        type="time"
                        value={seg.planned_start_time || '10:00'}
                        onChange={(e) => {
                          const updated = [...days];
                          updated[dayIdx].segments![segIdx].planned_start_time = e.target.value;
                          setDays(updated);
                        }}
                        className="px-2 py-1 rounded border border-slate-200"
                      />
                      <span>Mins:</span>
                      <input
                        type="number"
                        value={seg.duration_mins}
                        onChange={(e) => {
                          const updated = [...days];
                          updated[dayIdx].segments![segIdx].duration_mins = Number(e.target.value);
                          setDays(updated);
                        }}
                        className="w-16 px-2 py-1 rounded border border-slate-200"
                      />

                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...days];
                          updated[dayIdx].segments = updated[dayIdx].segments!.filter((_, i) => i !== segIdx);
                          setDays(updated);
                        }}
                        className="p-1.5 rounded text-rose-500 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </form>
  );
};
