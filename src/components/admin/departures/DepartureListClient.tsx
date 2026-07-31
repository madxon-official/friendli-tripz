'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, CheckCircle2, Clock, Users, ShieldCheck, RefreshCw, ArrowRight } from 'lucide-react';
import { PackageDeparture } from '@/lib/types/departure';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';

interface DepartureListClientProps {
  departures: PackageDeparture[];
}

export const DepartureListClient: React.FC<DepartureListClientProps> = ({ departures }) => {
  const router = useRouter();

  const columns: Column<PackageDeparture>[] = [
    {
      key: 'departure_code',
      header: 'Departure Code & Tour Name',
      sortable: true,
      accessor: (dep) => (
        <div className="space-y-0.5">
          <span className="font-mono font-bold text-brand-orange text-xs block">
            {dep.departure_code}
          </span>
          <span className="font-heading font-extrabold text-slate-900 block leading-tight">
            {dep.release?.title || 'Group Tour Experience'}
          </span>
        </div>
      ),
    },
    {
      key: 'start_date',
      header: 'Departure Dates',
      sortable: true,
      accessor: (dep) => (
        <div className="font-mono text-xs font-bold text-slate-800">
          {dep.start_date} ➔ {dep.end_date}
        </div>
      ),
    },
    {
      key: 'current_booked_count',
      header: 'Capacity & Booked Count',
      sortable: true,
      accessor: (dep) => (
        <div className="font-mono text-xs">
          <span className="font-bold text-slate-900">{dep.current_booked_count}</span> / {dep.max_travellers} Seats (Min {dep.min_travellers})
        </div>
      ),
    },
    {
      key: 'is_guaranteed',
      header: 'Guaranteed Status',
      sortable: true,
      accessor: (dep) => (
        dep.is_guaranteed ? (
          <StatusBadge status="confirmed" customLabel="Guaranteed" size="sm" />
        ) : (
          <StatusBadge status="pending" customLabel={`Min ${dep.min_travellers} Req`} size="sm" />
        )
      ),
    },
    {
      key: 'actions',
      header: 'Action',
      sortable: false,
      align: 'right',
      accessor: (dep) => (
        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => router.push('/admin/operations')}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1"
          >
            <span>Assign Fleet</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-brand-orange">
            <Calendar className="w-4 h-4" />
            <span>Group Tour Workspace</span>
          </div>
          <h1 className="text-2xl font-heading font-black text-slate-900 tracking-tight mt-1">
            Fixed Departures & Viability Control
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage scheduled group departures, guaranteed threshold milestones, capacity pools, and room match pools.
          </p>
        </div>

        <button
          onClick={() => router.refresh()}
          className="p-2.5 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors self-start md:self-auto flex items-center gap-2 text-xs font-bold"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh Departures</span>
        </button>
      </div>

      {/* Main Data Table */}
      <DataTable
        data={departures}
        columns={columns}
        keyExtractor={(dep) => dep.id}
        searchPlaceholder="Search departures by code or title..."
        searchKeys={['departure_code']}
        exportFilename="departures_viability.csv"
        emptyTitle="No departures recorded"
        emptyDescription="No fixed tour departures match your search criteria."
      />
    </div>
  );
};
