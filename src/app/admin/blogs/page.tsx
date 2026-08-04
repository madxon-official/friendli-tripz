'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, Eye } from 'lucide-react';
import { AdminCrudHeader } from '@/components/admin/ui/AdminCrudHeader';
import { AdminCrudControlsBar } from '@/components/admin/ui/AdminCrudControlsBar';
import { AdminDataTable, Column } from '@/components/admin/ui/AdminDataTable';
import { AdminRouteGuard } from '@/components/admin/ui/AdminRouteGuard';
import { Blog } from '@/lib/types/platform';
import { IMAGE_REGISTRY } from '@/lib/constants/imageRegistry';

const INITIAL_BLOGS: Blog[] = [
  {
    id: 'blog-1',
    title: '7 Secret Offbeat Trails in Kodaikanal You Won’t Find on Google Maps',
    slug: 'hidden-spots-kodaikanal',
    category: 'Destination Guides',
    excerpt: 'Escape the tourist crowds and discover secret pine glades, tranquil sheep farms, and cliffside cafes in Kodai.',
    content: 'Kodaikanal is world famous for its central lake and Coaker’s Walk...',
    cover_image: IMAGE_REGISTRY.kodaikanal.cover,
    author_name: 'Friendli Explorer Team',
    read_time_minutes: 5,
    related_destination_slugs: ['kodaikanal'],
    published_at: '2026-08-01T00:00:00Z',
  },
  {
    id: 'blog-2',
    title: 'Why Ooty Toy Train is a Must-Do Heritage Journey',
    slug: 'ooty-toy-train-guide',
    category: 'Heritage',
    excerpt: 'Everything you need to know about booking and riding the UNESCO Nilgiri Mountain Railway.',
    content: 'Surrounded by misty blue mountains and eucalyptus forests...',
    cover_image: IMAGE_REGISTRY.ooty.cover,
    author_name: 'Vibe Architect',
    read_time_minutes: 4,
    related_destination_slugs: ['ooty'],
    published_at: '2026-08-02T00:00:00Z',
  },
];

export default function AdminBlogsPage() {
  const [blogs] = useState<Blog[]>(INITIAL_BLOGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filtered = blogs.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || b.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const columns: Column<Blog>[] = [
    {
      header: 'Article Title',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-slate-800 bg-slate-950">
            <Image src={row.cover_image} alt={row.title} fill className="object-cover" />
          </div>
          <div>
            <div className="font-bold text-white text-xs">{row.title}</div>
            <div className="text-[11px] text-slate-400">By {row.author_name}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Category',
      cell: (row) => <span className="px-2 py-0.5 rounded bg-slate-800 text-brand-orange text-[11px] font-semibold">{row.category}</span>,
    },
    {
      header: 'Read Time',
      cell: (row) => <span className="text-xs text-slate-300">{row.read_time_minutes} mins</span>,
    },
    {
      header: 'Actions',
      cell: (row) => (
        <Link
          href={`/blogs/${row.slug}`}
          target="_blank"
          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white inline-block"
          title="Preview Article"
        >
          <Eye className="w-3.5 h-3.5 text-brand-orange" />
        </Link>
      ),
    },
  ];

  return (
    <AdminRouteGuard modulePath="/admin/blogs">
      <div className="space-y-6 animate-fade-in">
        <AdminCrudHeader
          title="Travel Blogs & Guides"
          description="Publish and manage travel stories, packing checklists, and destination guides."
          actionLabel="Write Article"
          onActionClick={() => alert('Blog publishing active.')}
          actionIcon={BookOpen}
        />

        <AdminCrudControlsBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search articles by title or excerpt..."
          filterValue={categoryFilter}
          onFilterChange={setCategoryFilter}
          filterOptions={[
            { label: 'All Categories', value: 'All' },
            { label: 'Destination Guides', value: 'Destination Guides' },
            { label: 'Heritage', value: 'Heritage' },
          ]}
        />

        <AdminDataTable
          columns={columns}
          data={filtered}
          keyExtractor={(row) => row.id}
          emptyMessage="No blog articles found."
        />
      </div>
    </AdminRouteGuard>
  );
}
