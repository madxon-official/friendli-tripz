'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Compass, Eye, CheckCircle2, RefreshCw, UserCheck } from 'lucide-react';
import { AdminCrudHeader } from '@/components/admin/ui/AdminCrudHeader';
import { AdminCrudControlsBar } from '@/components/admin/ui/AdminCrudControlsBar';
import { AdminDataTable, Column } from '@/components/admin/ui/AdminDataTable';
import { getAllEnquiries, updateEnquiryStatus } from '@/lib/actions/enquiryActions';
import { TripEnquiryRecord, TripStatusStep } from '@/lib/types/platform';

const STATUS_STEPS: TripStatusStep[] = [
  'Enquiry Received',
  'Under Review',
  'Trip Confirmed',
  'Trip Started',
  'Trip Completed'
];

export default function AdminTripTrackerPage() {
  const [enquiries, setEnquiries] = useState<TripEnquiryRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const loadData = async () => {
    const list = await getAllEnquiries();
    setEnquiries(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = enquiries.filter((e) => {
    const matchesSearch =
      e.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.destination.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAdvanceStatus = async (enq: TripEnquiryRecord) => {
    const currentIndex = STATUS_STEPS.indexOf(enq.status);
    if (currentIndex < STATUS_STEPS.length - 1) {
      const nextStatus = STATUS_STEPS[currentIndex + 1];
      await updateEnquiryStatus(enq.reference, nextStatus);
      await loadData();
    }
  };

  const columns: Column<TripEnquiryRecord>[] = [
    {
      header: 'Reference ID',
      cell: (row) => <span className="font-mono font-bold text-brand-orange text-xs">{row.reference}</span>,
    },
    {
      header: 'Traveller & Squad',
      cell: (row) => (
        <div>
          <div className="font-bold text-white text-xs">{row.name}</div>
          <div className="text-[11px] text-slate-400">{row.adults} Adults • {row.destination}</div>
        </div>
      ),
    },
    {
      header: 'Current Step',
      cell: (row) => (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-brand-orange/20 text-brand-orange border border-brand-orange/30">
          {row.status}
        </span>
      ),
    },
    {
      header: 'Assigned Lead',
      cell: (row) => (
        <div className="flex items-center gap-1.5 text-xs">
          <UserCheck className={`w-3.5 h-3.5 ${row.assigned_staff_name ? 'text-emerald-400' : 'text-slate-500'}`} />
          <span className={row.assigned_staff_name ? 'text-emerald-300 font-medium' : 'text-slate-500 italic'}>
            {row.assigned_staff_name || 'Unassigned'}
          </span>
        </div>
      ),
    },
    {
      header: 'Pipeline Action',
      cell: (row) => {
        const currentIndex = STATUS_STEPS.indexOf(row.status);
        const isMax = currentIndex >= STATUS_STEPS.length - 1;
        return (
          <div className="flex items-center gap-2">
            <button
              disabled={isMax}
              onClick={() => handleAdvanceStatus(row)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-emerald-400 disabled:opacity-40 disabled:hover:bg-slate-800 flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isMax ? 'Completed' : 'Advance Step'}</span>
            </button>
            <Link
              href={`/track/${row.reference}`}
              target="_blank"
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              title="View Public Tracker"
            >
              <Eye className="w-3.5 h-3.5" />
            </Link>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <AdminCrudHeader
        title="Realtime Trip Tracker Operations"
        description="Monitor active customer journeys through the 5-stage live pipeline."
      />

      <AdminCrudControlsBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search trip reference ID or traveller..."
        filterValue={statusFilter}
        onFilterChange={setStatusFilter}
        filterOptions={[
          { label: 'All Steps', value: 'All' },
          ...STATUS_STEPS.map((s) => ({ label: s, value: s })),
        ]}
      />

      <AdminDataTable
        columns={columns}
        data={filtered}
        keyExtractor={(row) => row.id}
        emptyMessage="No active trip trackers match your search criteria."
      />
    </div>
  );
}
