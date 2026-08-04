'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, Eye } from 'lucide-react';
import { AdminCrudHeader } from '@/components/admin/ui/AdminCrudHeader';
import { AdminCrudControlsBar } from '@/components/admin/ui/AdminCrudControlsBar';
import { AdminDataTable, Column } from '@/components/admin/ui/AdminDataTable';
import { Experience } from '@/lib/types/platform';
import { IMAGE_REGISTRY } from '@/lib/constants/imageRegistry';
import { ROUTES } from '@/lib/routes';

const INITIAL_EXPERIENCES: Experience[] = [
  {
    id: '22222222-0000-0000-0000-000000000001',
    title: 'Campfire & BBQ Night',
    slug: 'campfire-bbq-night',
    category: 'Camping',
    tagline: 'Sleep under mountain stars with grilled acoustic tunes',
    description: 'Sit around a cozy campfire under mountain stars with grilled acoustic music and hot fresh drinks.',
    image: IMAGE_REGISTRY.kodaikanal.hero,
    duration: '3 Hours (Evening)',
    difficulty: 'Easy',
    starting_price: 1200,
    destination_ids: ['11111111-0000-0000-0000-000000000001'],
    destination_names: ['Kodaikanal'],
    featured: true,
    created_at: '2026-08-01T00:00:00Z',
  },
  {
    id: '22222222-0000-0000-0000-000000000002',
    title: 'Dolphin Nose Cliffside Trek',
    slug: 'dolphin-nose-trek',
    category: 'Trekking',
    tagline: 'Hike along Palani valley ridges to precipice views',
    description: 'Guided trek along Palani valley ridges ending at the iconic Dolphin Nose protruding rock formation.',
    image: IMAGE_REGISTRY.kodaikanal.experiences.trekking,
    duration: '4 Hours',
    difficulty: 'Moderate',
    starting_price: 999,
    destination_ids: ['11111111-0000-0000-0000-000000000001'],
    destination_names: ['Kodaikanal'],
    featured: true,
    created_at: '2026-08-01T00:00:00Z',
  },
  {
    id: '22222222-0000-0000-0000-000000000003',
    title: 'UNESCO Toy Train Heritage Ride',
    slug: 'toy-train-ride',
    category: 'Heritage',
    tagline: 'Conquer Nilgiri mountain tunnels and bridges',
    description: 'Ride the historic steam toy train through mountain tunnels, bridges, and emerald tea valleys.',
    image: IMAGE_REGISTRY.ooty.experiences.toytrain,
    duration: '2 Hours',
    difficulty: 'Easy',
    starting_price: 850,
    destination_ids: ['11111111-0000-0000-0000-000000000002'],
    destination_names: ['Ooty'],
    featured: true,
    created_at: '2026-08-01T00:00:00Z',
  },
  {
    id: '22222222-0000-0000-0000-000000000004',
    title: 'Valparai Coffee & Tea Plantation Safari',
    slug: 'valparai-tea-safari',
    category: 'Tea Estates',
    tagline: 'Jeep walk through private organic estates',
    description: 'Guided jeep walk through private organic tea and coffee estates with fresh tea tasting.',
    image: IMAGE_REGISTRY.valparai.experiences.teaestate,
    duration: '3 Hours',
    difficulty: 'Easy',
    starting_price: 1100,
    destination_ids: ['11111111-0000-0000-0000-000000000003'],
    destination_names: ['Valparai'],
    featured: true,
    created_at: '2026-08-01T00:00:00Z',
  },
];

export default function AdminExperiencesPage() {
  const [experiences] = useState<Experience[]>(INITIAL_EXPERIENCES);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filtered = experiences.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || e.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const columns: Column<Experience>[] = [
    {
      header: 'Experience',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-slate-800 bg-slate-950">
            <Image src={row.image} alt={row.title} fill className="object-cover" />
          </div>
          <div>
            <div className="font-bold text-white text-xs">{row.title}</div>
            <div className="text-[11px] text-slate-400 line-clamp-1">{row.tagline}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Category',
      cell: (row) => <span className="px-2 py-0.5 rounded bg-slate-800 text-brand-orange text-[11px] font-semibold">{row.category}</span>,
    },
    {
      header: 'Duration',
      cell: (row) => <span className="text-xs text-slate-300">{row.duration}</span>,
    },
    {
      header: 'Difficulty',
      cell: (row) => <span className="text-xs font-semibold text-slate-200">{row.difficulty}</span>,
    },
    {
      header: 'Starting Rate',
      cell: (row) => <span className="font-bold text-white text-xs">₹{row.starting_price.toLocaleString('en-IN')}</span>,
    },
    {
      header: 'Actions',
      cell: (row) => (
        <Link
          href={ROUTES.EXPERIENCES}
          target="_blank"
          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white inline-block"
          title="Preview Experiences Page"
        >
          <Eye className="w-3.5 h-3.5 text-brand-orange" />
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <AdminCrudHeader
        title="Micro-Experiences Catalog"
        description="Create and manage curated micro-adventures in Kodaikanal, Ooty, and Valparai."
        actionLabel="Add Experience"
        onActionClick={() => alert('Experience creation active.')}
        actionIcon={Sparkles}
      />

      <AdminCrudControlsBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search experiences by title..."
        filterValue={categoryFilter}
        onFilterChange={setCategoryFilter}
        filterOptions={[
          { label: 'All Categories', value: 'All' },
          { label: 'Camping', value: 'Camping' },
          { label: 'Trekking', value: 'Trekking' },
          { label: 'Heritage', value: 'Heritage' },
          { label: 'Tea Estates', value: 'Tea Estates' },
        ]}
      />

      <AdminDataTable
        columns={columns}
        data={filtered}
        keyExtractor={(row) => row.id}
        emptyMessage="No experiences found."
      />
    </div>
  );
}
