'use me';
'use client';

import React, { useState, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  ArrowLeft,
  Save,
  Globe,
  Sparkles,
  Image as ImageIcon,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Info,
  Phone,
  HelpCircle,
  Search,
  Check,
  Star,
  FileText,
  Compass,
  Layers,
  Shield,
  Clock,
  Eye,
  AlertCircle,
} from 'lucide-react';
import {
  Country,
  State,
  DestinationCategory,
  MasterTag,
  Destination,
  DestinationGallery,
  DestinationHighlight,
  DestinationEmergencyContact,
  DestinationFAQ,
} from '@/lib/types/destination';
import { createDestination, updateDestination } from '@/lib/actions/destination';

interface DestinationFormProps {
  initialData?: Destination | null;
  countries: Country[];
  states: State[];
  categories: DestinationCategory[];
  masterTags: MasterTag[];
}

export const DestinationForm: React.FC<DestinationFormProps> = ({
  initialData,
  countries,
  states,
  categories,
  masterTags,
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isEditMode = Boolean(initialData?.id);
  const [activeTab, setActiveTab] = useState<
    'basic' | 'media' | 'travel' | 'highlights' | 'quickfacts' | 'seo' | 'status'
  >('basic');

  // Slug Manual Override Toggle
  const [autoSlug, setAutoSlug] = useState(!isEditMode);

  // Form States
  const [name, setName] = useState(initialData?.name || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [countryId, setCountryId] = useState(initialData?.country_id || countries[0]?.id || '');
  const [stateId, setStateId] = useState(initialData?.state_id || states[0]?.id || '');
  const [categoryId, setCategoryId] = useState(initialData?.category_id || categories[0]?.id || '');
  const [shortDescription, setShortDescription] = useState(initialData?.short_description || '');
  const [longDescription, setLongDescription] = useState(initialData?.long_description || '');
  const [latitude, setLatitude] = useState<number | null>(initialData?.latitude || 10.2381);
  const [longitude, setLongitude] = useState<number | null>(initialData?.longitude || 77.4892);

  // Media
  const [heroBannerUrl, setHeroBannerUrl] = useState(initialData?.hero_banner_url || '');
  const [featuredImageUrl, setFeaturedImageUrl] = useState(initialData?.featured_image_url || '');
  const [gallery, setGallery] = useState<DestinationGallery[]>(initialData?.gallery || []);

  // Travel Information
  const [bestTimeToVisit, setBestTimeToVisit] = useState(initialData?.best_time_to_visit || '');
  const [howToReach, setHowToReach] = useState(initialData?.how_to_reach || '');
  const [nearestAirport, setNearestAirport] = useState(initialData?.nearest_airport || '');
  const [nearestRailwayStation, setNearestRailwayStation] = useState(
    initialData?.nearest_railway_station || ''
  );
  const [nearestBusStand, setNearestBusStand] = useState(initialData?.nearest_bus_stand || '');
  const [languagesInput, setLanguagesInput] = useState(
    initialData?.languages_spoken ? initialData.languages_spoken.join(', ') : 'English, Tamil'
  );
  const [localTransport, setLocalTransport] = useState(initialData?.local_transport || '');

  // Repeatable Collections
  const [highlights, setHighlights] = useState<DestinationHighlight[]>(
    initialData?.highlights || [
      { title: 'Scenic Viewpoint', description: 'Breathtaking mountain peak vistas', icon_name: 'Mountain' },
    ]
  );
  const [emergencyContacts, setEmergencyContacts] = useState<DestinationEmergencyContact[]>(
    initialData?.emergency_contacts || [
      { service_type: 'Police', title: 'Town Police Station', phone_number: '100' },
      { service_type: 'Hospital', title: 'Government Hospital', phone_number: '108' },
    ]
  );
  const [faqs, setFaqs] = useState<DestinationFAQ[]>(
    initialData?.faqs || [
      { question: 'What is the best month to visit?', answer: 'October to March offers cool pleasant weather.' },
    ]
  );

  // Quick Facts
  const [idealDuration, setIdealDuration] = useState(initialData?.ideal_duration || '3 - 4 Days');
  const [bestSeason, setBestSeason] = useState(initialData?.best_season || 'October to March');
  const [climate, setClimate] = useState(initialData?.climate || 'Cool & Mist-covered');
  const [travelDifficulty, setTravelDifficulty] = useState<'easy' | 'moderate' | 'challenging' | 'strenuous'>(
    initialData?.travel_difficulty || 'easy'
  );
  const [adventureLevel, setAdventureLevel] = useState<'low' | 'moderate' | 'high' | 'extreme'>(
    initialData?.adventure_level || 'low'
  );
  const [budgetLevel, setBudgetLevel] = useState<'budget' | 'mid_range' | 'luxury' | 'ultra_luxury'>(
    initialData?.budget_level || 'mid_range'
  );
  const [familyFriendly, setFamilyFriendly] = useState(initialData?.family_friendly ?? true);
  const [petFriendly, setPetFriendly] = useState(initialData?.pet_friendly ?? false);
  const [accessibilityNotes, setAccessibilityNotes] = useState(initialData?.accessibility_notes || '');
  const [temperatureRange, setTemperatureRange] = useState(initialData?.temperature_range || '12°C - 22°C');
  const [elevation, setElevation] = useState(initialData?.elevation || '2,133 m');
  const [averageBudgetPerDay, setAverageBudgetPerDay] = useState(
    initialData?.average_budget_per_day || '₹3,500 - ₹6,000'
  );

  // SEO & Rich SEO Guides
  const [metaTitle, setMetaTitle] = useState(initialData?.meta_title || '');
  const [metaDescription, setMetaDescription] = useState(initialData?.meta_description || '');
  const [metaKeywordsInput, setMetaKeywordsInput] = useState(
    initialData?.meta_keywords ? initialData.meta_keywords.join(', ') : ''
  );
  const [canonicalUrl, setCanonicalUrl] = useState(initialData?.canonical_url || '');

  // Rich Guides
  const [introduction, setIntroduction] = useState(initialData?.introduction || '');
  const [travelTips, setTravelTips] = useState(initialData?.travel_tips || '');
  const [foodGuide, setFoodGuide] = useState(initialData?.food_guide || '');
  const [shoppingGuide, setShoppingGuide] = useState(initialData?.shopping_guide || '');
  const [weatherGuide, setWeatherGuide] = useState(initialData?.weather_guide || '');
  const [thingsToAvoid, setThingsToAvoid] = useState(initialData?.things_to_avoid || '');
  const [bestMonthsInput, setBestMonthsInput] = useState(
    initialData?.best_months ? initialData.best_months.join(', ') : 'October, November, December, January, February, March'
  );
  const [idealForInput, setIdealForInput] = useState(
    initialData?.ideal_for ? initialData.ideal_for.join(', ') : 'Couples, Families, Friends, Nature Lovers'
  );

  // Controls & Tags
  const [status, setStatus] = useState<'draft' | 'published' | 'coming_soon' | 'archived'>(
    initialData?.status || 'draft'
  );
  const [isFeatured, setIsFeatured] = useState(initialData?.is_featured || false);
  const [homepageOrder, setHomepageOrder] = useState(initialData?.homepage_order || 0);
  const [websiteVisibility, setWebsiteVisibility] = useState(initialData?.website_visibility ?? true);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(initialData?.tag_ids || []);

  // Form error state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto generate slug from name
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

  // Add Gallery Image Item
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [newGalleryCaption, setNewGalleryCaption] = useState('');
  const [newGalleryAlt, setNewGalleryAlt] = useState('');

  const handleAddGalleryItem = () => {
    if (!newGalleryUrl.trim()) return;
    setGallery([
      ...gallery,
      {
        image_url: newGalleryUrl.trim(),
        caption: newGalleryCaption.trim(),
        alt_text: newGalleryAlt.trim(),
        display_order: gallery.length,
      },
    ]);
    setNewGalleryUrl('');
    setNewGalleryCaption('');
    setNewGalleryAlt('');
  };

  const handleRemoveGalleryItem = (index: number) => {
    setGallery(gallery.filter((_, idx) => idx !== index));
  };

  // Add Highlight Item
  const handleAddHighlight = () => {
    setHighlights([
      ...highlights,
      { title: 'New Highlight', description: '', icon_name: 'Sparkles', display_order: highlights.length },
    ]);
  };

  // Add Emergency Contact
  const handleAddContact = () => {
    setEmergencyContacts([
      ...emergencyContacts,
      { service_type: 'Police', title: 'Police Station', phone_number: '100', display_order: emergencyContacts.length },
    ]);
  };

  // Add FAQ
  const handleAddFAQ = () => {
    setFaqs([
      ...faqs,
      { question: 'New Question', answer: 'Answer details here.', display_order: faqs.length },
    ]);
  };

  const handleToggleTag = (tagId: string) => {
    if (selectedTagIds.includes(tagId)) {
      setSelectedTagIds(selectedTagIds.filter((id) => id !== tagId));
    } else {
      setSelectedTagIds([...selectedTagIds, tagId]);
    }
  };

  // Form Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const languages_spoken = languagesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const meta_keywords = metaKeywordsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const best_months = bestMonthsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const ideal_for = idealForInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      id: initialData?.id,
      name,
      slug,
      country_id: countryId,
      state_id: stateId,
      category_id: categoryId,
      short_description: shortDescription,
      long_description: longDescription,
      latitude: latitude ? Number(latitude) : null,
      longitude: longitude ? Number(longitude) : null,
      hero_banner_url: heroBannerUrl,
      featured_image_url: featuredImageUrl,
      best_time_to_visit: bestTimeToVisit,
      how_to_reach: howToReach,
      nearest_airport: nearestAirport,
      nearest_railway_station: nearestRailwayStation,
      nearest_bus_stand: nearestBusStand,
      languages_spoken,
      local_transport: localTransport,
      ideal_duration: idealDuration,
      best_season: bestSeason,
      climate,
      travel_difficulty: travelDifficulty,
      adventure_level: adventureLevel,
      budget_level: budgetLevel,
      family_friendly: familyFriendly,
      pet_friendly: petFriendly,
      accessibility_notes: accessibilityNotes,
      temperature_range: temperatureRange,
      elevation,
      average_budget_per_day: averageBudgetPerDay,
      introduction,
      travel_tips: travelTips,
      food_guide: foodGuide,
      shopping_guide: shoppingGuide,
      weather_guide: weatherGuide,
      things_to_avoid: thingsToAvoid,
      best_months,
      ideal_for,
      meta_title: metaTitle,
      meta_description: metaDescription,
      meta_keywords,
      canonical_url: canonicalUrl,
      status,
      is_featured: isFeatured,
      homepage_order: Number(homepageOrder),
      website_visibility: websiteVisibility,
      tag_ids: selectedTagIds,
      gallery: gallery.map((g, idx) => ({
        id: g.id,
        image_url: g.image_url,
        thumbnail_url: g.thumbnail_url || null,
        medium_url: g.medium_url || null,
        alt_text: g.alt_text || null,
        caption: g.caption || null,
        photographer: g.photographer || null,
        is_featured: Boolean(g.is_featured),
        display_order: g.display_order ?? idx,
      })),
      highlights: highlights.map((h, idx) => ({
        id: h.id,
        title: h.title,
        description: h.description || null,
        icon_name: h.icon_name || 'Sparkles',
        display_order: h.display_order ?? idx,
      })),
      emergency_contacts: emergencyContacts.map((c, idx) => ({
        id: c.id,
        service_type: c.service_type,
        title: c.title,
        phone_number: c.phone_number,
        alt_phone: c.alt_phone || null,
        address: c.address || null,
        display_order: c.display_order ?? idx,
      })),
      faqs: faqs.map((f, idx) => ({
        id: f.id,
        question: f.question,
        answer: f.answer,
        display_order: f.display_order ?? idx,
      })),
    };

    startTransition(async () => {
      try {
        if (isEditMode && initialData?.id) {
          await updateDestination(initialData.id, payload);
        } else {
          await createDestination(payload);
        }
        router.push('/admin/destinations');
        router.refresh();
      } catch (err: unknown) {
        setErrorMessage(err instanceof Error ? err.message : 'Failed to save destination');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-20">
      {/* Top Header Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/destinations"
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-orange font-mono">
              <MapPin className="w-3.5 h-3.5" />
              <span>{isEditMode ? 'Edit Destination' : 'New Destination'}</span>
            </div>
            <h1 className="text-2xl font-heading font-black text-slate-900 tracking-tight mt-0.5">
              {name || 'Untitled Destination'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'draft' | 'published' | 'coming_soon' | 'archived')}
            className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
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
            <span>{isPending ? 'Saving...' : isEditMode ? 'Update Destination' : 'Publish Destination'}</span>
          </button>
        </div>
      </div>

      {/* Error Feedback */}
      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Tabbed Section Navigation */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm text-xs font-bold font-mono">
        {[
          { id: 'basic', label: '1. Basic Info', icon: Info },
          { id: 'media', label: '2. Media & Gallery', icon: ImageIcon },
          { id: 'travel', label: '3. Travel Info', icon: Globe },
          { id: 'highlights', label: '4. Highlights & Emergency', icon: Sparkles },
          { id: 'quickfacts', label: '5. Quick Facts', icon: Layers },
          { id: 'seo', label: '6. SEO & Guides', icon: FileText },
          { id: 'status', label: '7. Controls & Tags', icon: Shield },
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

      {/* SECTION 1: BASIC INFORMATION */}
      {activeTab === 'basic' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-lg font-heading font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Info className="w-5 h-5 text-brand-orange" />
            <span>Basic Identity & Location</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
                Destination Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Kodaikanal"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-orange"
              />
            </div>

            {/* Slug */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 font-mono">
                  URL Slug *
                </label>
                <button
                  type="button"
                  onClick={() => setAutoSlug(!autoSlug)}
                  className="text-[10px] font-mono text-brand-orange hover:underline font-bold"
                >
                  {autoSlug ? 'Disable Auto-Slug' : 'Enable Auto-Slug'}
                </button>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">
                  /destinations/
                </span>
                <input
                  type="text"
                  required
                  value={slug}
                  disabled={autoSlug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full pl-28 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-orange disabled:bg-slate-50"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
                Category *
              </label>
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* State & Country */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
                  State *
                </label>
                <select
                  required
                  value={stateId}
                  onChange={(e) => setStateId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white"
                >
                  {states.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
                  Country *
                </label>
                <select
                  required
                  value={countryId}
                  onChange={(e) => setCountryId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white"
                >
                  {countries.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Coordinates */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
                Latitude & Longitude
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  step="any"
                  placeholder="Latitude (e.g. 10.2381)"
                  value={latitude ?? ''}
                  onChange={(e) => setLatitude(e.target.value ? parseFloat(e.target.value) : null)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono font-semibold"
                />
                <input
                  type="number"
                  step="any"
                  placeholder="Longitude (e.g. 77.4892)"
                  value={longitude ?? ''}
                  onChange={(e) => setLongitude(e.target.value ? parseFloat(e.target.value) : null)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
              Short Tagline (Max 300 chars)
            </label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="e.g. The Princess of Hill Stations featuring misty pine forests and Kodai Lake."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
          </div>

          {/* Long Description */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
              Full Destination Description
            </label>
            <textarea
              rows={5}
              value={longDescription}
              onChange={(e) => setLongDescription(e.target.value)}
              placeholder="Detailed description of the destination, atmosphere, geography, and group travel experience..."
              className="w-full p-4 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
          </div>
        </div>
      )}

      {/* SECTION 2: MEDIA & GALLERY */}
      {activeTab === 'media' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-lg font-heading font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-brand-orange" />
            <span>Media Banner & Photo Gallery</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hero Banner */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
                Hero Banner Image URL
              </label>
              <input
                type="url"
                value={heroBannerUrl}
                onChange={(e) => setHeroBannerUrl(e.target.value)}
                placeholder="/images/kodaikanal/kodaikanal-hero.webp or https://..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-900"
              />
              {heroBannerUrl && (
                <div className="mt-3 relative h-36 rounded-xl overflow-hidden border border-slate-200">
                  <Image src={heroBannerUrl} alt="Hero Banner Preview" fill className="object-cover" />
                </div>
              )}
            </div>

            {/* Featured Thumbnail */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
                Card Featured Image URL
              </label>
              <input
                type="url"
                value={featuredImageUrl}
                onChange={(e) => setFeaturedImageUrl(e.target.value)}
                placeholder="/images/kodaikanal/kodaikanal-lake.webp or https://..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-900"
              />
              {featuredImageUrl && (
                <div className="mt-3 relative h-36 rounded-xl overflow-hidden border border-slate-200">
                  <Image src={featuredImageUrl} alt="Featured Preview" fill className="object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* Multi-Image Gallery Manager */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase font-mono tracking-wider">
              Photo Gallery Collection ({gallery.length} Images)
            </h3>

            {/* Add New Gallery Image */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold text-slate-700">Add Gallery Image</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="url"
                  placeholder="Image URL (https://...)"
                  value={newGalleryUrl}
                  onChange={(e) => setNewGalleryUrl(e.target.value)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                />
                <input
                  type="text"
                  placeholder="Caption (e.g. Kodai Lake Sunset)"
                  value={newGalleryCaption}
                  onChange={(e) => setNewGalleryCaption(e.target.value)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                />
                <input
                  type="text"
                  placeholder="Alt Text (for SEO & Accessibility)"
                  value={newGalleryAlt}
                  onChange={(e) => setNewGalleryAlt(e.target.value)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <button
                type="button"
                onClick={handleAddGalleryItem}
                className="px-4 py-2 bg-brand-navy text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-800"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Image to Gallery</span>
              </button>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {gallery.map((g, idx) => (
                <div
                  key={idx}
                  className="group relative rounded-xl border border-slate-200 bg-white p-2 space-y-2 shadow-sm"
                >
                  <div className="relative h-28 w-full rounded-lg overflow-hidden bg-slate-100">
                    <Image src={g.image_url} alt={g.alt_text || 'Gallery'} fill className="object-cover" />
                  </div>
                  <div className="text-[11px] font-semibold text-slate-700 truncate">
                    {g.caption || 'No Caption'}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveGalleryItem(idx)}
                    className="w-full py-1 text-xs font-bold text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: TRAVEL INFO */}
      {activeTab === 'travel' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-lg font-heading font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Globe className="w-5 h-5 text-brand-orange" />
            <span>Travel Logistics & Transportation</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
                Best Time to Visit
              </label>
              <textarea
                rows={2}
                value={bestTimeToVisit}
                onChange={(e) => setBestTimeToVisit(e.target.value)}
                placeholder="e.g. October to March offers pleasant weather for sightseeing and boat rides."
                className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
                How to Reach
              </label>
              <textarea
                rows={2}
                value={howToReach}
                onChange={(e) => setHowToReach(e.target.value)}
                placeholder="e.g. Accessible by road via scenic ghat sections from Madurai, Coimbatore, or Dindigul."
                className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
                Nearest Airport
              </label>
              <input
                type="text"
                value={nearestAirport}
                onChange={(e) => setNearestAirport(e.target.value)}
                placeholder="e.g. Madurai Airport (IXM) - 120 km"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
                Nearest Railway Station
              </label>
              <input
                type="text"
                value={nearestRailwayStation}
                onChange={(e) => setNearestRailwayStation(e.target.value)}
                placeholder="e.g. Kodaikanal Road Railway Station (KZN) - 80 km"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
                Nearest Bus Stand
              </label>
              <input
                type="text"
                value={nearestBusStand}
                onChange={(e) => setNearestBusStand(e.target.value)}
                placeholder="e.g. Kodaikanal Central Bus Stand - 1 km"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
                Languages Spoken (Comma Separated)
              </label>
              <input
                type="text"
                value={languagesInput}
                onChange={(e) => setLanguagesInput(e.target.value)}
                placeholder="Tamil, English, Malayalam"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
              Local Transport Options
            </label>
            <input
              type="text"
              value={localTransport}
              onChange={(e) => setLocalTransport(e.target.value)}
              placeholder="e.g. Local taxis, rented bicycles around the lake, auto-rickshaws, and walking tours."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
            />
          </div>
        </div>
      )}

      {/* SECTION 4: HIGHLIGHTS & EMERGENCY CONTACTS */}
      {activeTab === 'highlights' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          {/* Highlights */}
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h2 className="text-lg font-heading font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-orange" />
                <span>Repeatable Destination Highlights</span>
              </h2>
              <button
                type="button"
                onClick={handleAddHighlight}
                className="px-3.5 py-1.5 bg-brand-orange text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Highlight</span>
              </button>
            </div>

            <div className="space-y-3">
              {highlights.map((h, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-3 items-center">
                  <input
                    type="text"
                    placeholder="Highlight Title (e.g. Tea Estates)"
                    value={h.title}
                    onChange={(e) => {
                      const updated = [...highlights];
                      updated[idx].title = e.target.value;
                      setHighlights(updated);
                    }}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                  />
                  <input
                    type="text"
                    placeholder="Short Description"
                    value={h.description || ''}
                    onChange={(e) => {
                      const updated = [...highlights];
                      updated[idx].description = e.target.value;
                      setHighlights(updated);
                    }}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                  <select
                    value={h.icon_name || 'Sparkles'}
                    onChange={(e) => {
                      const updated = [...highlights];
                      updated[idx].icon_name = e.target.value;
                      setHighlights(updated);
                    }}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-mono"
                  >
                    <option value="Mountain">Mountain</option>
                    <option value="Trees">Trees</option>
                    <option value="Anchor">Anchor</option>
                    <option value="Sparkles">Sparkles</option>
                    <option value="Camera">Camera</option>
                    <option value="Waves">Waves</option>
                    <option value="Train">Train</option>
                    <option value="Compass">Compass</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => setHighlights(highlights.filter((_, i) => i !== idx))}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h2 className="text-lg font-heading font-extrabold text-slate-900 flex items-center gap-2">
                <Phone className="w-5 h-5 text-brand-orange" />
                <span>Emergency Contacts</span>
              </h2>
              <button
                type="button"
                onClick={handleAddContact}
                className="px-3.5 py-1.5 bg-brand-navy text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Contact</span>
              </button>
            </div>

            <div className="space-y-3">
              {emergencyContacts.map((c, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
                  <select
                    value={c.service_type}
                    onChange={(e) => {
                      const updated = [...emergencyContacts];
                      updated[idx].service_type = e.target.value;
                      setEmergencyContacts(updated);
                    }}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-bold"
                  >
                    <option value="Police">Police</option>
                    <option value="Hospital">Hospital</option>
                    <option value="Tourism Office">Tourism Office</option>
                    <option value="Forest Office">Forest Office</option>
                    <option value="Rescue">Rescue</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Title / Name"
                    value={c.title}
                    onChange={(e) => {
                      const updated = [...emergencyContacts];
                      updated[idx].title = e.target.value;
                      setEmergencyContacts(updated);
                    }}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={c.phone_number}
                    onChange={(e) => {
                      const updated = [...emergencyContacts];
                      updated[idx].phone_number = e.target.value;
                      setEmergencyContacts(updated);
                    }}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setEmergencyContacts(emergencyContacts.filter((_, i) => i !== idx))}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg justify-self-end"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: QUICK FACTS */}
      {activeTab === 'quickfacts' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-lg font-heading font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Layers className="w-5 h-5 text-brand-orange" />
            <span>Quick Facts & Travel Enums</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
                Ideal Duration
              </label>
              <input
                type="text"
                value={idealDuration}
                onChange={(e) => setIdealDuration(e.target.value)}
                placeholder="e.g. 3 - 4 Days"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
                Best Season
              </label>
              <input
                type="text"
                value={bestSeason}
                onChange={(e) => setBestSeason(e.target.value)}
                placeholder="e.g. October to March"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
                Climate Description
              </label>
              <input
                type="text"
                value={climate}
                onChange={(e) => setClimate(e.target.value)}
                placeholder="e.g. Cool & Mist-covered"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
                Travel Difficulty
              </label>
              <select
                value={travelDifficulty}
                onChange={(e) => setTravelDifficulty(e.target.value as typeof travelDifficulty)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
              >
                <option value="easy">Easy (Suitable for all ages)</option>
                <option value="moderate">Moderate (Ghat driving / light walking)</option>
                <option value="challenging">Challenging (High altitude trekking)</option>
                <option value="strenuous">Strenuous (Extreme terrain)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
                Adventure Level
              </label>
              <select
                value={adventureLevel}
                onChange={(e) => setAdventureLevel(e.target.value as typeof adventureLevel)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
              >
                <option value="low">Low Adventure</option>
                <option value="moderate">Moderate Adventure</option>
                <option value="high">High Adventure</option>
                <option value="extreme">Extreme Adventure</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
                Budget Level
              </label>
              <select
                value={budgetLevel}
                onChange={(e) => setBudgetLevel(e.target.value as typeof budgetLevel)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
              >
                <option value="budget">Budget Friendly</option>
                <option value="mid_range">Mid-Range</option>
                <option value="luxury">Luxury</option>
                <option value="ultra_luxury">Ultra Luxury</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
                Temperature Range
              </label>
              <input
                type="text"
                value={temperatureRange}
                onChange={(e) => setTemperatureRange(e.target.value)}
                placeholder="e.g. 12°C - 22°C"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
                Elevation
              </label>
              <input
                type="text"
                value={elevation}
                onChange={(e) => setElevation(e.target.value)}
                placeholder="e.g. 2,133 m"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
                Average Daily Budget
              </label>
              <input
                type="text"
                value={averageBudgetPerDay}
                onChange={(e) => setAverageBudgetPerDay(e.target.value)}
                placeholder="e.g. ₹3,500 - ₹6,000"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={familyFriendly}
                onChange={(e) => setFamilyFriendly(e.target.checked)}
                className="w-4 h-4 text-brand-orange rounded"
              />
              <div>
                <span className="font-bold text-xs text-slate-900 block">Family Friendly Destination</span>
                <span className="text-[11px] text-slate-500">Suitable for kids and senior travellers.</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={petFriendly}
                onChange={(e) => setPetFriendly(e.target.checked)}
                className="w-4 h-4 text-brand-orange rounded"
              />
              <div>
                <span className="font-bold text-xs text-slate-900 block">Pet Friendly Destination</span>
                <span className="text-[11px] text-slate-500">Allows pets in select parks and homestays.</span>
              </div>
            </label>
          </div>
        </div>
      )}

      {/* SECTION 6: SEO & RICH GUIDES */}
      {activeTab === 'seo' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-lg font-heading font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-orange" />
            <span>SEO Meta & Rich Destination Travel Content</span>
          </h2>

          {/* Live Google Search Snippet Preview */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
              Google Search Snippet Live Preview
            </div>
            <div className="text-sm font-semibold text-blue-700 hover:underline truncate">
              {metaTitle || `${name} Travel Guide | Friendli Tripz`}
            </div>
            <div className="text-xs text-emerald-700 font-mono">
              https://friendlitripz.com/destinations/{slug || 'destination'}
            </div>
            <div className="text-xs text-slate-600 line-clamp-2">
              {metaDescription || shortDescription || 'Explore destination travel details, guides, and group trips with Friendli Tripz.'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
                Meta Title (Max 70 Chars)
              </label>
              <input
                type="text"
                maxLength={70}
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="e.g. Kodaikanal Travel Guide | Friendli Tripz"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
              />
              <div className="text-[10px] font-mono text-slate-400 mt-1 text-right">
                {metaTitle.length}/70 chars
              </div>
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
                placeholder="e.g. Plan your misty Kodaikanal escape with Friendli Tripz."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
              />
              <div className="text-[10px] font-mono text-slate-400 mt-1 text-right">
                {metaDescription.length}/160 chars
              </div>
            </div>
          </div>

          {/* Rich Guides */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase font-mono tracking-wider">
              Rich Destination SEO Guides
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1 font-mono">
                  Food & Local Cuisine Guide
                </label>
                <textarea
                  rows={3}
                  value={foodGuide}
                  onChange={(e) => setFoodGuide(e.target.value)}
                  placeholder="e.g. Homemade dark chocolates, hot eucalyptus tea, artisanal pizzas..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1 font-mono">
                  Shopping Guide
                </label>
                <textarea
                  rows={3}
                  value={shoppingGuide}
                  onChange={(e) => setShoppingGuide(e.target.value)}
                  placeholder="e.g. Handmade soaps, essential oils, wooden handicrafts..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1 font-mono">
                  Travel Tips
                </label>
                <textarea
                  rows={3}
                  value={travelTips}
                  onChange={(e) => setTravelTips(e.target.value)}
                  placeholder="e.g. Carry light thermals even during summer evenings..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1 font-mono">
                  Things to Avoid
                </label>
                <textarea
                  rows={3}
                  value={thingsToAvoid}
                  onChange={(e) => setThingsToAvoid(e.target.value)}
                  placeholder="e.g. Avoid plastic littering in forest zones..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 7: CONTROLS & TAGS */}
      {activeTab === 'status' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-lg font-heading font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-brand-orange" />
            <span>Display Controls & Master Tags</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
                Publication Status *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as typeof status)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 bg-white"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="coming_soon">Coming Soon</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
                Homepage Sort Order
              </label>
              <input
                type="number"
                value={homepageOrder}
                onChange={(e) => setHomepageOrder(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 text-amber-500 rounded"
              />
              <div>
                <span className="font-bold text-xs text-slate-900 block flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>Featured Destination</span>
                </span>
                <span className="text-[11px] text-slate-500">Showcases on homepage carousel and top banner.</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={websiteVisibility}
                onChange={(e) => setWebsiteVisibility(e.target.checked)}
                className="w-4 h-4 text-brand-orange rounded"
              />
              <div>
                <span className="font-bold text-xs text-slate-900 block">Website Visibility</span>
                <span className="text-[11px] text-slate-500">If unchecked, hidden from public search engine indexing.</span>
              </div>
            </label>
          </div>

          {/* Master Tags Selection */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 font-mono">
              Master Travel Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {masterTags.map((tag) => {
                const isSelected = selectedTagIds.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleToggleTag(tag.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors border ${
                      isSelected
                        ? 'bg-brand-orange text-white border-brand-orange'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {tag.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </form>
  );
};
