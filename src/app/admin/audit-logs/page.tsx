'use client';

import React, { useState } from 'react';
import { History, ShieldCheck, Filter } from 'lucide-react';
import { AdminCrudHeader } from '@/components/admin/ui/AdminCrudHeader';
import { AdminCrudControlsBar } from '@/components/admin/ui/AdminCrudControlsBar';
import { AdminDataTable, Column } from '@/components/admin/ui/AdminDataTable';
import { AdminRouteGuard } from '@/components/admin/ui/AdminRouteGuard';

export interface AuditLogItem {
  id: string;
  user: string;
  role: string;
  action: string;
  module: string;
  timestamp: string;
  ip: string;
  details: string;
}

const MOCK_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'aud-1',
    user: 'Friendli Founder (owner)',
    role: 'owner',
    action: 'Role Changed',
    module: 'Team Governance',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    ip: '192.168.1.1',
    details: 'Changed role for Karthik Raja from Operations to Administrator',
  },
  {
    id: 'aud-2',
    user: 'Karthik Raja (admin)',
    role: 'admin',
    action: 'Package Updated',
    module: 'Commercial Packages',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    ip: '192.168.1.14',
    details: 'Updated starting rate for Misty Kodaikanal Escape to ₹4,999',
  },
  {
    id: 'aud-3',
    user: 'Karthik Raja (admin)',
    role: 'admin',
    action: 'Member Invited',
    module: 'Team Governance',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    ip: '192.168.1.14',
    details: 'Invited Ananya Customer Desk as Support role in Customer Support dept',
  },
  {
    id: 'aud-4',
    user: 'Murugan Captain (operations)',
    role: 'operations',
    action: 'Trip Status Transitioned',
    module: 'Trip Tracker',
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    ip: '192.168.1.22',
    details: 'Advanced reference FT-2026-8942 to "Quote Sent"',
  },
];

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>(MOCK_AUDIT_LOGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('All');

  const filtered = logs.filter((l) => {
    const matchesSearch =
      l.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = actionFilter === 'All' || l.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const columns: Column<AuditLogItem>[] = [
    {
      header: 'Timestamp',
      cell: (row) => (
        <span className="font-mono text-slate-400 text-xs">
          {new Date(row.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      ),
    },
    {
      header: 'Actor User & Role',
      cell: (row) => (
        <div>
          <div className="font-bold text-white text-xs">{row.user}</div>
          <div className="text-[10px] text-slate-500 font-mono">IP: {row.ip}</div>
        </div>
      ),
    },
    {
      header: 'Action',
      cell: (row) => (
        <span className="px-2.5 py-1 rounded-lg bg-brand-orange/20 text-brand-orange font-bold text-[11px] border border-brand-orange/30">
          {row.action}
        </span>
      ),
    },
    {
      header: 'Module',
      cell: (row) => <span className="text-xs text-slate-300 font-semibold">{row.module}</span>,
    },
    {
      header: 'Event Details',
      cell: (row) => <span className="text-xs text-slate-400 line-clamp-1">{row.details}</span>,
    },
  ];

  return (
    <AdminRouteGuard modulePath="/admin/audit-logs">
      <div className="space-y-6 animate-fade-in">
        <AdminCrudHeader
          title="System Audit & Governance Logs"
          description="Track administrative actions, role changes, package edits, destination deletions, and team events."
          actionIcon={History}
        />

        <AdminCrudControlsBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search audit events by user, action, or details..."
          filterValue={actionFilter}
          onFilterChange={setActionFilter}
          filterOptions={[
            { label: 'All Actions', value: 'All' },
            { label: 'Role Changed', value: 'Role Changed' },
            { label: 'Package Updated', value: 'Package Updated' },
            { label: 'Member Invited', value: 'Member Invited' },
            { label: 'Trip Status Transitioned', value: 'Trip Status Transitioned' },
          ]}
        />

        <AdminDataTable
          columns={columns}
          data={filtered}
          keyExtractor={(row) => row.id}
          emptyMessage="No audit log events found."
        />
      </div>
    </AdminRouteGuard>
  );
}
