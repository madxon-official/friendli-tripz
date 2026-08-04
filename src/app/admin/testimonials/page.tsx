'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Star, Edit } from 'lucide-react';
import { AdminCrudHeader } from '@/components/admin/ui/AdminCrudHeader';
import { AdminCrudControlsBar } from '@/components/admin/ui/AdminCrudControlsBar';
import { AdminDataTable, Column } from '@/components/admin/ui/AdminDataTable';
import { Testimonial } from '@/lib/types/platform';
import { IMAGE_REGISTRY } from '@/lib/constants/imageRegistry';

const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    author_name: 'Ananya & Squad',
    location: 'Bengaluru',
    avatar_url: IMAGE_REGISTRY.kodaikanal.hero,
    rating: 5,
    quote: 'The cliffside trek in Kodai was the absolute highlight of our year! No generic hotel packages, just raw vibes, bonfire acoustic tunes, and flawless coordination.',
    trip_type: 'Weekend Squad Getaway',
    destination: 'Kodaikanal',
    created_at: '2026-07-28T00:00:00Z',
  },
  {
    id: 'test-2',
    author_name: 'Karthik Raja',
    location: 'Chennai',
    avatar_url: IMAGE_REGISTRY.ooty.hero,
    rating: 5,
    quote: 'Being able to track our trip status in real-time with our Reference ID made us feel super confident. Our driver and guide were top tier.',
    trip_type: 'Family Nature Retreat',
    destination: 'Ooty',
    created_at: '2026-07-30T00:00:00Z',
  },
];

export default function AdminTestimonialsPage() {
  const [testimonials] = useState<Testimonial[]>(INITIAL_TESTIMONIALS);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = testimonials.filter(
    (t) =>
      t.author_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.quote.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns: Column<Testimonial>[] = [
    {
      header: 'Author / Squad',
      cell: (row) => (
        <div className="flex items-center gap-3">
          {row.avatar_url && (
            <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-slate-800 bg-slate-950">
              <Image src={row.avatar_url} alt={row.author_name} fill className="object-cover" />
            </div>
          )}
          <div>
            <div className="font-bold text-white text-xs">{row.author_name}</div>
            <div className="text-[11px] text-slate-400">{row.location}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Quote Excerpt',
      cell: (row) => <span className="text-xs text-slate-300 italic line-clamp-1">"{row.quote}"</span>,
    },
    {
      header: 'Trip Type & Destination',
      cell: (row) => (
        <span className="text-xs text-brand-orange font-semibold">
          {row.trip_type} ({row.destination})
        </span>
      ),
    },
    {
      header: 'Rating',
      cell: (row) => (
        <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
          {row.rating} ★
        </span>
      ),
    },
    {
      header: 'Actions',
      cell: (row) => (
        <button
          onClick={() => alert(`Edit testimonial by ${row.author_name}`)}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
        >
          <Edit className="w-3.5 h-3.5" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <AdminCrudHeader
        title="Travel Stories & Testimonials"
        description="Manage traveller reviews, squad testimonials, and community feedback stories."
        actionLabel="Add Review"
        onActionClick={() => alert('Testimonial active.')}
        actionIcon={Star}
      />

      <AdminCrudControlsBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search reviews by traveller name or destination..."
      />

      <AdminDataTable
        columns={columns}
        data={filtered}
        keyExtractor={(row) => row.id}
        emptyMessage="No testimonials found."
      />
    </div>
  );
}
