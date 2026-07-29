'use me';
'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Mountain,
  ArrowLeft,
  Save,
  Info,
  Image as ImageIcon,
  Clock,
  Shield,
  FileText,
  Plus,
  Trash2,
  AlertCircle,
  MapPin,
  Check,
} from 'lucide-react';
import {
  Attraction,
  AttractionCategory,
  DestinationZone,
  AttractionStatus,
  OperatingSchedule,
  OperationalException,
} from '@/lib/types/attraction';
import { createAttraction, updateAttraction } from '@/lib/actions/attraction';

interface AttractionFormProps {
  initialData?: Attraction | null;
  destinations: { id: string; name: string }[];
  categories: AttractionCategory[];
  zones: DestinationZone[];
}

export const AttractionForm: React.FC<AttractionFormProps> = ({
  initialData,
  destinations,
  categories,
  zones,
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isEditMode = Boolean(initialData?.id);
  const [activeTab, setActiveTab] = useState<'basic' | 'media' | 'schedules' | 'amenities' | 'seo' | 'status'>('basic');
  const [autoSlug, setAutoSlug] = useState(!isEditMode);

  // Form Fields
  const [name, setName] = useState(initialData?.name || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [destinationId, setDestinationId] = useState(initialData?.destination_id || destinations[0]?.id || '');
  const [zoneId, setZoneId] = useState(initialData?.zone_id || '');
  const [categoryId, setCategoryId] = useState(initialData?.category_id || categories[0]?.id || '');

  // Spatial Coordinates
  const [latitude, setLatitude] = useState<number>(initialData?.latitude || 10.2381);
  const [longitude, setLongitude] = useState<number>(initialData?.longitude || 77.4892);
  const [addressText, setAddressText] = useState(initialData?.address_text || '');

  // Text Descriptions
  const [shortTagline, setShortTagline] = useState(initialData?.short_tagline || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [suggestedDurationMins, setSuggestedDurationMins] = useState(initialData?.suggested_duration_mins || 90);

  // Amenities
  const [petAllowed, setPetAllowed] = useState(initialData?.pet_allowed ?? false);
  const [wheelchairAccessible, setWheelchairAccessible] = useState(initialData?.wheelchair_accessible ?? false);
  const [parkingAvailable, setParkingAvailable] = useState(initialData?.parking_available ?? true);
  const [restroomsAvailable, setRestroomsAvailable] = useState(initialData?.restrooms_available ?? true);
  const [idealForInput, setIdealForInput] = useState(
    initialData?.ideal_for ? initialData.ideal_for.join(', ') : 'Families, Couples, Photographers'
  );

  // Pricing
  const [entryFeeType, setEntryFeeType] = useState(initialData?.entry_fee_type || 'free');
  const [adultEntryFee, setAdultEntryFee] = useState(initialData?.adult_entry_fee || 0);
  const [childEntryFee, setChildEntryFee] = useState(initialData?.child_entry_fee || 0);
  const [foreignNationalFee, setForeignNationalFee] = useState(initialData?.foreign_national_fee || 0);

  // Media
  const [heroBannerUrl, setHeroBannerUrl] = useState(initialData?.hero_banner_url || '');
  const [featuredImageUrl, setFeaturedImageUrl] = useState(initialData?.featured_image_url || '');

  // Schedules & Exceptions
  const [schedules, setSchedules] = useState<OperatingSchedule[]>(
    initialData?.schedules || [
      { day_of_week: 0, open_time: '09:00', close_time: '18:00', is_closed: false, entity_type: 'attraction', entity_id: '' },
      { day_of_week: 1, open_time: '09:00', close_time: '18:00', is_closed: false, entity_type: 'attraction', entity_id: '' },
      { day_of_week: 2, open_time: '09:00', close_time: '18:00', is_closed: false, entity_type: 'attraction', entity_id: '' },
      { day_of_week: 3, open_time: '09:00', close_time: '18:00', is_closed: false, entity_type: 'attraction', entity_id: '' },
      { day_of_week: 4, open_time: '09:00', close_time: '18:00', is_closed: false, entity_type: 'attraction', entity_id: '' },
      { day_of_week: 5, open_time: '09:00', close_time: '18:00', is_closed: false, entity_type: 'attraction', entity_id: '' },
      { day_of_week: 6, open_time: '09:00', close_time: '18:00', is_closed: false, entity_type: 'attraction', entity_id: '' },
    ]
  );
  const [exceptions, setExceptions] = useState<OperationalException[]>(initialData?.exceptions || []);

  // SEO & Meta
  const [metaTitle, setMetaTitle] = useState(initialData?.meta_title || '');
  const [metaDescription, setMetaDescription] = useState(initialData?.meta_description || '');
  const [metaKeywordsInput, setMetaKeywordsInput] = useState(
    initialData?.meta_keywords ? initialData.meta_keywords.join(', ') : ''
  );
  const [status, setStatus] = useState<AttractionStatus>(initialData?.status || 'draft');
  const [isFeatured, setIsFeatured] = useState(initialData?.is_featured ?? false);
  const [displayOrder, setDisplayOrder] = useState(initialData?.display_order || 0);
  const [websiteVisibility, setWebsiteVisibility] = useState(initialData?.website_visibility ?? true);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleNameChange = (val: string) => {
    setName(val);
    if (autoSlug) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      setSlug(generated);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const ideal_for = idealForInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const meta_keywords = metaKeywordsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      id: initialData?.id,
      name,
      slug,
      destination_id: destinationId,
      zone_id: zoneId || null,
      category_id: categoryId,
      latitude: Number(latitude),
      longitude: Number(longitude),
      address_text: addressText,
      short_tagline: shortTagline,
      description,
      suggested_duration_mins: Number(suggestedDurationMins),
      pet_allowed: petAllowed,
      wheelchair_accessible: wheelchairAccessible,
      parking_available: parkingAvailable,
      restrooms_available: restroomsAvailable,
      ideal_for,
      entry_fee_type: entryFeeType,
      adult_entry_fee: Number(adultEntryFee),
      child_entry_fee: Number(childEntryFee),
      foreign_national_fee: Number(foreignNationalFee),
      hero_banner_url: heroBannerUrl,
      featured_image_url: featuredImageUrl,
      meta_title: metaTitle,
      meta_description: metaDescription,
      meta_keywords,
      status,
      is_featured: isFeatured,
      display_order: Number(displayOrder),
      website_visibility: websiteVisibility,
      schedules,
      exceptions,
    };

    startTransition(async () => {
      try {
        if (isEditMode && initialData?.id) {
          await updateAttraction(initialData.id, payload);
        } else {
          await createAttraction(payload);
        }
        router.push('/admin/attractions');
        router.refresh();
      } catch (err: unknown) {
        setErrorMessage(err instanceof Error ? err.message : 'Failed to save attraction');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-20">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/attractions"
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-orange font-mono">
              <Mountain className="w-3.5 h-3.5" />
              <span>{isEditMode ? 'Edit Attraction' : 'New Attraction'}</span>
            </div>
            <h1 className="text-2xl font-heading font-black text-slate-900 tracking-tight mt-0.5">
              {name || 'Untitled Attraction'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as AttractionStatus)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white"
          >
            <option value="draft">Draft Status</option>
            <option value="published">Published Status</option>
            <option value="coming_soon">Coming Soon Status</option>
            <option value="archived">Archived Status</option>
          </select>

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 bg-brand-orange text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-button hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isPending ? 'Saving...' : isEditMode ? 'Update Attraction' : 'Publish Attraction'}</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Tab Nav */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm text-xs font-bold font-mono">
        {[
          { id: 'basic', label: '1. Identity & Location', icon: Info },
          { id: 'media', label: '2. Media & Gallery', icon: ImageIcon },
          { id: 'schedules', label: '3. Schedules & Calendar', icon: Clock },
          { id: 'amenities', label: '4. Amenities & Fees', icon: Mountain },
          { id: 'seo', label: '5. SEO & Meta', icon: FileText },
          { id: 'status', label: '6. Controls & Visibility', icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors ${
                isActive
                  ? 'bg-brand-navy text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: BASIC IDENTITY & SPATIAL */}
      {activeTab === 'basic' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-lg font-heading font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Info className="w-5 h-5 text-brand-orange" />
            <span>Identity & Spatial Coordinates</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
                Attraction Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Kodai Lake"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 font-mono">
                  Canonical URL Slug *
                </label>
                <button
                  type="button"
                  onClick={() => setAutoSlug(!autoSlug)}
                  className="text-[10px] font-mono text-brand-orange hover:underline font-bold"
                >
                  {autoSlug ? 'Disable Auto-Slug' : 'Enable Auto-Slug'}
                </button>
              </div>
              <input
                type="text"
                required
                value={slug}
                disabled={autoSlug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
                Parent Destination *
              </label>
              <select
                required
                value={destinationId}
                onChange={(e) => setDestinationId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold bg-white"
              >
                {destinations.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
                Attraction Category *
              </label>
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold bg-white"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
                Authoritative Coordinates (Lat / Long) *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="Latitude (e.g. 10.2381)"
                  value={latitude}
                  onChange={(e) => setLatitude(parseFloat(e.target.value))}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono font-semibold"
                />
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="Longitude (e.g. 77.4892)"
                  value={longitude}
                  onChange={(e) => setLongitude(parseFloat(e.target.value))}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
                Suggested Visit Duration (Minutes)
              </label>
              <input
                type="number"
                value={suggestedDurationMins}
                onChange={(e) => setSuggestedDurationMins(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
              Short Tagline
            </label>
            <input
              type="text"
              value={shortTagline}
              onChange={(e) => setShortTagline(e.target.value)}
              placeholder="e.g. Star-shaped man-made lake with perimeter cycling and boat club."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
              Full Attraction Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of the attraction, history, entrance rules, and scenery..."
              className="w-full p-4 rounded-xl border border-slate-200 text-sm"
            />
          </div>
        </div>
      )}

      {/* TAB 2: MEDIA */}
      {activeTab === 'media' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-lg font-heading font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-brand-orange" />
            <span>Media Assets & Banners</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
                Hero Banner URL
              </label>
              <input
                type="url"
                value={heroBannerUrl}
                onChange={(e) => setHeroBannerUrl(e.target.value)}
                placeholder="/images/kodaikanal/kodaikanal-lake.webp"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono"
              />
              {heroBannerUrl && (
                <div className="mt-3 relative h-36 rounded-xl overflow-hidden border border-slate-200">
                  <Image src={heroBannerUrl} alt="Hero Banner" fill className="object-cover" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
                Featured Card Image URL
              </label>
              <input
                type="url"
                value={featuredImageUrl}
                onChange={(e) => setFeaturedImageUrl(e.target.value)}
                placeholder="/images/kodaikanal/kodaikanal-lake.webp"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono"
              />
              {featuredImageUrl && (
                <div className="mt-3 relative h-36 rounded-xl overflow-hidden border border-slate-200">
                  <Image src={featuredImageUrl} alt="Featured" fill className="object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SCHEDULES & CALENDAR ENGINE */}
      {activeTab === 'schedules' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-lg font-heading font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Clock className="w-5 h-5 text-brand-orange" />
            <span>Weekly Operating Schedules</span>
          </h2>

          <div className="space-y-3">
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((dayName, dayIdx) => {
              const currentSchedule = schedules.find((s) => s.day_of_week === dayIdx) || {
                day_of_week: dayIdx,
                open_time: '09:00',
                close_time: '18:00',
                is_closed: false,
                entity_type: 'attraction',
                entity_id: '',
              };

              return (
                <div
                  key={dayIdx}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-4"
                >
                  <span className="w-28 text-xs font-bold text-slate-800 font-mono">{dayName}</span>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                    <input
                      type="checkbox"
                      checked={currentSchedule.is_closed}
                      onChange={(e) => {
                        const isClosed = e.target.checked;
                        setSchedules(
                          schedules.map((s) => (s.day_of_week === dayIdx ? { ...s, is_closed: isClosed } : s))
                        );
                      }}
                      className="rounded text-brand-orange"
                    />
                    <span>Closed All Day</span>
                  </label>

                  {!currentSchedule.is_closed && (
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span>Open:</span>
                      <input
                        type="time"
                        value={currentSchedule.open_time}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSchedules(
                            schedules.map((s) => (s.day_of_week === dayIdx ? { ...s, open_time: val } : s))
                          );
                        }}
                        className="px-2 py-1 rounded-lg border border-slate-200 bg-white"
                      />
                      <span>Close:</span>
                      <input
                        type="time"
                        value={currentSchedule.close_time}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSchedules(
                            schedules.map((s) => (s.day_of_week === dayIdx ? { ...s, close_time: val } : s))
                          );
                        }}
                        className="px-2 py-1 rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: AMENITIES & FEES */}
      {activeTab === 'amenities' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-lg font-heading font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Mountain className="w-5 h-5 text-brand-orange" />
            <span>Amenities & Entry Fee Structure</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={wheelchairAccessible}
                onChange={(e) => setWheelchairAccessible(e.target.checked)}
                className="rounded text-brand-orange"
              />
              <span className="text-xs font-bold text-slate-800">Wheelchair Accessible</span>
            </label>

            <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={parkingAvailable}
                onChange={(e) => setParkingAvailable(e.target.checked)}
                className="rounded text-brand-orange"
              />
              <span className="text-xs font-bold text-slate-800">Parking Available</span>
            </label>

            <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={restroomsAvailable}
                onChange={(e) => setRestroomsAvailable(e.target.checked)}
                className="rounded text-brand-orange"
              />
              <span className="text-xs font-bold text-slate-800">Restrooms Onsite</span>
            </label>

            <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={petAllowed}
                onChange={(e) => setPetAllowed(e.target.checked)}
                className="rounded text-brand-orange"
              />
              <span className="text-xs font-bold text-slate-800">Pet Friendly</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
                Adult Ticket Fee (₹)
              </label>
              <input
                type="number"
                value={adultEntryFee}
                onChange={(e) => setAdultEntryFee(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
                Child Ticket Fee (₹)
              </label>
              <input
                type="number"
                value={childEntryFee}
                onChange={(e) => setChildEntryFee(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
                Foreigner Ticket Fee (₹)
              </label>
              <input
                type="number"
                value={foreignNationalFee}
                onChange={(e) => setForeignNationalFee(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SEO */}
      {activeTab === 'seo' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-lg font-heading font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-orange" />
            <span>SEO Metadata & Google Search Preview</span>
          </h2>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
              Meta Title (Max 70 Chars)
            </label>
            <input
              type="text"
              maxLength={70}
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="e.g. Kodai Lake Travel Guide | Friendli Tripz"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
              Meta Description (Max 160 Chars)
            </label>
            <input
              type="text"
              maxLength={160}
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="e.g. Explore Kodai Lake in Kodaikanal..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs"
            />
          </div>
        </div>
      )}

      {/* TAB 6: STATUS */}
      {activeTab === 'status' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-lg font-heading font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-brand-orange" />
            <span>Status Controls</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
                Publication Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as AttractionStatus)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold bg-white"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="coming_soon">Coming Soon</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};
