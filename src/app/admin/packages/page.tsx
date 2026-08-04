'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Package as PackageIcon, Eye } from 'lucide-react';
import { AdminCrudHeader } from '@/components/admin/ui/AdminCrudHeader';
import { AdminCrudControlsBar } from '@/components/admin/ui/AdminCrudControlsBar';
import { AdminDataTable, Column } from '@/components/admin/ui/AdminDataTable';
import { Package } from '@/lib/types/platform';
import { IMAGE_REGISTRY } from '@/lib/constants/imageRegistry';

const INITIAL_PACKAGES: Package[] = [
  {
    id: '33333333-0000-0000-0000-000000000001',
    title: 'Misty Kodaikanal Escape',
    slug: 'misty-kodaikanal-escape',
    destination_id: '11111111-0000-0000-0000-000000000001',
    destination_name: 'Kodaikanal',
    duration_days: 3,
    duration_nights: 2,
    starting_price: 4999,
    hero_image: IMAGE_REGISTRY.kodaikanal.hero,
    gallery: [IMAGE_REGISTRY.kodaikanal.hero, IMAGE_REGISTRY.kodaikanal.cover],
    highlights: ['Private wooden cottage stay', 'Campfire with BBQ & acoustic tunes'],
    overview: 'Our signature weekend escape to Kodaikanal.',
    itinerary: [],
    inclusions: ['Stay', 'Transport', 'Meals'],
    exclusions: ['Personal Expenses'],
    faqs: [],
    featured: true,
    status: 'published',
    created_at: '2026-08-01T00:00:00Z',
  },
  {
    id: '33333333-0000-0000-0000-000000000002',
    title: 'Nilgiri Heritage & Tea Trail',
    slug: 'nilgiri-heritage-tea-trail',
    destination_id: '11111111-0000-0000-0000-000000000002',
    destination_name: 'Ooty',
    duration_days: 3,
    duration_nights: 2,
    starting_price: 5499,
    hero_image: IMAGE_REGISTRY.ooty.hero,
    gallery: [IMAGE_REGISTRY.ooty.hero, IMAGE_REGISTRY.ooty.cover],
    highlights: ['Heritage Toy Train ride', 'Tea tasting session'],
    overview: 'Unwind amidst green tea slopes and misty valleys.',
    itinerary: [],
    inclusions: ['Stay', 'Transport', 'Meals'],
    exclusions: ['Personal Expenses'],
    faqs: [],
    featured: true,
    status: 'published',
    created_at: '2026-08-01T00:00:00Z',
  },
  {
    id: '33333333-0000-0000-0000-000000000003',
    title: 'Valparai Rainforest & Wildlife Retreat',
    slug: 'valparai-rainforest-retreat',
    destination_id: '11111111-0000-0000-0000-000000000003',
    destination_name: 'Valparai',
    duration_days: 2,
    duration_nights: 1,
    starting_price: 4299,
    hero_image: IMAGE_REGISTRY.valparai.hero,
    gallery: [IMAGE_REGISTRY.valparai.hero, IMAGE_REGISTRY.valparai.cover],
    highlights: ['40 Hairpin bends drive', 'Coffee plantation walk'],
    overview: 'Unwind in Valparai rainforest coffee estate.',
    itinerary: [],
    inclusions: ['Stay', 'Meals'],
    exclusions: ['Personal Expenses'],
    faqs: [],
    featured: true,
    status: 'published',
    created_at: '2026-08-01T00:00:00Z',
  },
];

export default function AdminPackagesPage() {
  const [packages] = useState<Package[]>(INITIAL_PACKAGES);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = packages.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.destination_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns: Column<Package>[] = [
    {
      header: 'Package Title',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-slate-800 bg-slate-950">
            <Image src={row.hero_image} alt={row.title} fill className="object-cover" />
          </div>
          <div>
            <div className="font-bold text-white text-xs">{row.title}</div>
            <div className="text-[11px] text-slate-400">{row.destination_name}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Duration',
      cell: (row) => (
        <span className="text-xs text-slate-300 font-semibold">
          {row.duration_days}D / {row.duration_nights}N
        </span>
      ),
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
        <Link
          href={`/packages/${row.slug}`}
          target="_blank"
          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white inline-block"
          title="Preview Package Page"
        >
          <Eye className="w-3.5 h-3.5 text-brand-orange" />
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <AdminCrudHeader
        title="Commercial Packages"
        description="Create and manage pre-planned trip package templates, itineraries, and inclusions."
        actionLabel="Create Package"
        onActionClick={() => alert('Package creation active.')}
        actionIcon={PackageIcon}
      />

      <AdminCrudControlsBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search packages by title or destination..."
        filterValue={statusFilter}
        onFilterChange={setStatusFilter}
        filterOptions={[
          { label: 'All Statuses', value: 'All' },
          { label: 'Published', value: 'published' },
          { label: 'Draft', value: 'draft' },
        ]}
      />

      <AdminDataTable
        columns={columns}
        data={filtered}
        keyExtractor={(row) => row.id}
        emptyMessage="No commercial packages found."
      />
    </div>
  );
}
