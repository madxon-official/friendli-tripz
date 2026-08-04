'use client';

import React, { useState } from 'react';
import { HelpCircle, Edit } from 'lucide-react';
import { AdminCrudHeader } from '@/components/admin/ui/AdminCrudHeader';
import { AdminCrudControlsBar } from '@/components/admin/ui/AdminCrudControlsBar';
import { AdminDataTable, Column } from '@/components/admin/ui/AdminDataTable';
import { FAQ } from '@/lib/types/platform';

const INITIAL_FAQS: FAQ[] = [
  {
    id: 'faq-1',
    question: 'How does Friendli Tripz work without user logins or accounts?',
    answer: 'We believe travel planning should be frictionless! You discover destinations, plan your custom vibe or select a package, and submit a simple enquiry. You instantly get a unique Reference ID (e.g. FT-2026-8942) to track your trip status live anytime without remembering passwords.',
    category: 'General',
    display_order: 1
  },
  {
    id: 'faq-2',
    question: 'What destinations does Friendli Tripz currently support?',
    answer: 'We exclusively focus on Kodaikanal, Ooty, and Valparai to deliver deeply curated, pre-audited local experiences.',
    category: 'Destinations',
    display_order: 2
  },
  {
    id: 'faq-3',
    question: 'Can I customize my trip dates and activities?',
    answer: '100% yes! Every itinerary is tailored to your squad, budget, travel style, and preferences.',
    category: 'Trip Planning',
    display_order: 3
  },
  {
    id: 'faq-4',
    question: 'How do I track my active trip once booked?',
    answer: 'Go to the Track Trip page (/track) and enter your Reference ID. You can see real-time status steps, assigned driver details, vehicle info, and itinerary notes updated live by our operations team.',
    category: 'Tracking',
    display_order: 4
  }
];

export default function AdminFAQsPage() {
  const [faqs] = useState<FAQ[]>(INITIAL_FAQS);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filtered = faqs.filter((f) => {
    const matchesSearch =
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || f.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const columns: Column<FAQ>[] = [
    {
      header: 'Question',
      cell: (row) => <span className="font-bold text-white text-xs">{row.question}</span>,
    },
    {
      header: 'Answer Excerpt',
      cell: (row) => <span className="text-xs text-slate-400 line-clamp-1">{row.answer}</span>,
    },
    {
      header: 'Category',
      cell: (row) => <span className="px-2 py-0.5 rounded bg-slate-800 text-brand-orange text-[11px] font-semibold">{row.category}</span>,
    },
    {
      header: 'Order',
      cell: (row) => <span className="text-xs text-slate-300 font-mono">#{row.display_order}</span>,
    },
    {
      header: 'Actions',
      cell: (row) => (
        <button
          onClick={() => alert(`Edit FAQ #${row.id}`)}
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
        title="Frequently Asked Questions"
        description="Manage questions and answers displayed across the platform and enquiry helpers."
        actionLabel="Add FAQ"
        onActionClick={() => alert('FAQ creation active.')}
        actionIcon={HelpCircle}
      />

      <AdminCrudControlsBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search questions or answers..."
        filterValue={categoryFilter}
        onFilterChange={setCategoryFilter}
        filterOptions={[
          { label: 'All Categories', value: 'All' },
          { label: 'General', value: 'General' },
          { label: 'Destinations', value: 'Destinations' },
          { label: 'Trip Planning', value: 'Trip Planning' },
          { label: 'Tracking', value: 'Tracking' },
        ]}
      />

      <AdminDataTable
        columns={columns}
        data={filtered}
        keyExtractor={(row) => row.id}
        emptyMessage="No FAQs found."
      />
    </div>
  );
}
