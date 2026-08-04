'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Eye } from 'lucide-react';
import { AdminCrudHeader } from '@/components/admin/ui/AdminCrudHeader';
import { AdminCrudControlsBar } from '@/components/admin/ui/AdminCrudControlsBar';
import { AdminDataTable, Column } from '@/components/admin/ui/AdminDataTable';
import { Destination } from '@/lib/types/platform';
import { IMAGE_REGISTRY } from '@/lib/constants/imageRegistry';

const INITIAL_DESTINATIONS: Destination[] = [
  {
    id: '11111111-0000-0000-0000-000000000001',
    name: 'Kodaikanal',
    slug: 'kodaikanal',
    tagline: 'Princess of Hill Stations',
    description: 'Surrounded by misty forests, serene lakes, and cliffside viewpoints.',
    hero_image: IMAGE_REGISTRY.kodaikanal.hero,
    gallery: IMAGE_REGISTRY.kodaikanal.gallery,
    travel_vibe: 'Misty & Romantic',
    best_season: 'Oct - Mar',
    starting_price: 3499,
    location: 'Dindigul, Tamil Nadu',
    highlights: ['Kodai Lake Boating', 'Dolphin Nose Cliff', 'Pine Forest Trails'],
    things_to_do: [],
    nearby_attractions: [],
    suggested_itinerary: [],
    featured: true,
    status: 'published',
    created_at: '2026-08-01T00:00:00Z',
  },
  {
    id: '11111111-0000-0000-0000-000000000002',
    name: 'Ooty',
    slug: 'ooty',
    tagline: 'Queen of the Nilgiris',
    description: 'Rolling tea gardens, heritage mountain railways, and crisp alpine air.',
    hero_image: IMAGE_REGISTRY.ooty.hero,
    gallery: IMAGE_REGISTRY.ooty.gallery,
    travel_vibe: 'Scenic & Heritage',
    best_season: 'Sep - May',
    starting_price: 3999,
    location: 'Nilgiris, Tamil Nadu',
    highlights: ['Heritage Toy Train', 'Doddabetta Peak', 'Botanical Gardens'],
    things_to_do: [],
    nearby_attractions: [],
    suggested_itinerary: [],
    featured: true,
    status: 'published',
    created_at: '2026-08-01T00:00:00Z',
  },
  {
    id: '11111111-0000-0000-0000-000000000003',
    name: 'Valparai',
    slug: 'valparai',
    tagline: 'Wilderness & Coffee Escapes',
    description: 'An unspoiled rainforest plateau surrounded by tea & coffee estates.',
    hero_image: IMAGE_REGISTRY.valparai.hero,
    gallery: IMAGE_REGISTRY.valparai.gallery,
    travel_vibe: 'Wilderness & Estate',
    best_season: 'Oct - Mar',
    starting_price: 4299,
    location: 'Coimbatore, Tamil Nadu',
    highlights: ['40 Hairpin Bends', 'Coffee Estate Walk', 'Aliyar Reservoir'],
    things_to_do: [],
    nearby_attractions: [],
    suggested_itinerary: [],
    featured: true,
    status: 'published',
    created_at: '2026-08-01T00:00:00Z',
  },
];

export default function AdminDestinationsPage() {
  const [destinations] = useState<Destination[]>(INITIAL_DESTINATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [vibeFilter, setVibeFilter] = useState('All');

  const filtered = destinations.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVibe = vibeFilter === 'All' || d.travel_vibe.toLowerCase().includes(vibeFilter.toLowerCase());
    return matchesSearch && matchesVibe;
  });

  const columns: Column<Destination>[] = [
    {
      header: 'Destination',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-slate-800 bg-slate-950">
            <Image src={row.hero_image} alt={row.name} fill className="object-cover" />
          </div>
          <div>
            <div className="font-bold text-white text-xs">{row.name}</div>
            <div className="text-[11px] text-slate-400 line-clamp-1">{row.tagline}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Travel Vibe',
      cell: (row) => <span className="text-xs font-semibold text-brand-orange">{row.travel_vibe}</span>,
    },
    {
      header: 'Best Season',
      cell: (row) => <span className="text-xs text-slate-300">{row.best_season}</span>,
    },
    {
      header: 'Starting Rate',
      cell: (row) => <span className="font-bold text-white text-xs">₹{row.starting_price.toLocaleString('en-IN')}</span>,
    },
    {
      header: 'Status',
      cell: (row) => (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-950/60 border border-emerald-800 text-emerald-400">
          {row.status}
        </span>
      ),
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/destinations/${row.slug}`}
            target="_blank"
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            title="Preview Public Page"
          >
            <Eye className="w-3.5 h-3.5 text-brand-orange" />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <AdminCrudHeader
        title="Destinations Catalog"
        description="Manage destination guides, photos, travel vibes, and attributes for Kodaikanal, Ooty, and Valparai."
        actionLabel="Add Destination"
        onActionClick={() => alert('Destination creation active.')}
      />

      <AdminCrudControlsBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search destinations by name or tagline..."
        filterValue={vibeFilter}
        onFilterChange={setVibeFilter}
        filterOptions={[
          { label: 'All Travel Vibes', value: 'All' },
          { label: 'Misty', value: 'Misty' },
          { label: 'Scenic', value: 'Scenic' },
          { label: 'Wilderness', value: 'Wilderness' },
        ]}
      />

      <AdminDataTable
        columns={columns}
        data={filtered}
        keyExtractor={(row) => row.id}
        emptyMessage="No destinations found."
      />
    </div>
  );
}
