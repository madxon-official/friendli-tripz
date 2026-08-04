'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Eye, Edit, UserCheck, Phone, MapPin, Shield, CheckCircle2 } from 'lucide-react';
import { AdminCrudHeader } from '@/components/admin/ui/AdminCrudHeader';
import { AdminCrudControlsBar } from '@/components/admin/ui/AdminCrudControlsBar';
import { AdminDataTable, Column } from '@/components/admin/ui/AdminDataTable';
import { getAllEnquiries, updateEnquiryStatus } from '@/lib/actions/enquiryActions';
import { getTeamMembers, DbTeamMember } from '@/lib/actions/teamActions';
import { TripEnquiryRecord, TripStatusStep } from '@/lib/types/platform';
import { useRealtimeSubscription } from '@/lib/hooks/useRealtime';

const STATUS_STEPS: TripStatusStep[] = [
  'Enquiry Received',
  'Under Review',
  'Trip Confirmed',
  'Trip Started',
  'Trip Completed',
  'Cancelled',
];

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<TripEnquiryRecord[]>([]);
  const [staffMembers, setStaffMembers] = useState<DbTeamMember[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedEnquiry, setSelectedEnquiry] = useState<TripEnquiryRecord | null>(null);

  // Status edit modal state
  const [editStatus, setEditStatus] = useState<TripStatusStep>('Enquiry Received');
  const [editNotes, setEditNotes] = useState('');
  const [editAssignedTo, setEditAssignedTo] = useState<string>('');
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    const [list, staff] = await Promise.all([
      getAllEnquiries(),
      getTeamMembers(),
    ]);
    setEnquiries(list);
    setStaffMembers(staff);
  };

  useEffect(() => {
    loadData();
  }, []);

  useRealtimeSubscription('enquiries', () => {
    loadData();
  });

  const filteredEnquiries = enquiries.filter((e) => {
    const matchesSearch =
      e.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.destination.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenEdit = (enq: TripEnquiryRecord) => {
    setSelectedEnquiry(enq);
    setEditStatus(enq.status);
    setEditNotes(enq.planner_notes || '');
    setEditAssignedTo(enq.assigned_to || '');
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry) return;
    setSaving(true);
    await updateEnquiryStatus(
      selectedEnquiry.reference,
      editStatus,
      editNotes,
      editAssignedTo || null
    );
    await loadData();
    setSaving(false);
    setSelectedEnquiry(null);
  };

  const columns: Column<TripEnquiryRecord>[] = [
    {
      header: 'Reference ID',
      cell: (row) => (
        <span className="font-mono font-bold text-brand-orange text-xs">{row.reference}</span>
      ),
    },
    {
      header: 'Traveller Name',
      cell: (row) => (
        <div>
          <div className="font-bold text-white text-xs">{row.name}</div>
          <div className="text-[11px] text-slate-400 font-mono">{row.phone}</div>
        </div>
      ),
    },
    {
      header: 'Trip Route',
      cell: (row) => (
        <div className="text-xs">
          <div className="font-bold text-slate-100 flex items-center gap-1">
            <span className="text-slate-400 font-normal">{row.starting_location || 'Coimbatore'}</span>
            <span className="text-brand-orange">➔</span>
            <span className="text-white font-extrabold">{row.destination}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Assigned Lead',
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <UserCheck className={`w-3.5 h-3.5 ${row.assigned_staff_name ? 'text-emerald-400' : 'text-slate-500'}`} />
          <span className={`text-xs font-semibold ${row.assigned_staff_name ? 'text-emerald-300 font-medium' : 'text-slate-500 italic'}`}>
            {row.assigned_staff_name || 'Unassigned'}
          </span>
        </div>
      ),
    },
    {
      header: 'Travel Date',
      cell: (row) => <span className="text-slate-300">{row.travel_date}</span>,
    },
    {
      header: 'Status',
      cell: (row) => (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-slate-800 text-slate-200 border border-slate-700">
          {row.status}
        </span>
      ),
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 font-semibold text-xs flex items-center gap-1"
            title="Update Status & Assign Lead"
          >
            <Edit className="w-3.5 h-3.5" /> Edit
          </button>
          <Link
            href={`/track/${row.reference}`}
            target="_blank"
            className="p-1.5 rounded-lg bg-slate-800 text-brand-orange hover:bg-slate-700"
            title="View Live Tracker"
          >
            <Eye className="w-3.5 h-3.5" />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <AdminCrudHeader
        title="Trip Enquiries Pipeline"
        description="Manage traveller inquiries, track live 5-stage pipeline, assign staff leads, and update planner notes in Supabase."
      />

      <AdminCrudControlsBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by reference ID, customer name, or destination..."
        filterValue={statusFilter}
        onFilterChange={setStatusFilter}
        filterOptions={[
          { label: 'All Statuses', value: 'All' },
          ...STATUS_STEPS.map((s) => ({ label: s, value: s })),
        ]}
      />

      <AdminDataTable
        columns={columns}
        data={filteredEnquiries}
        keyExtractor={(row) => row.id}
        emptyMessage="No enquiries found matching filter criteria."
      />

      {/* Edit & Assign Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-xl w-full space-y-6 shadow-elevated">
            <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-brand-orange uppercase">Updating Pipeline & Lead Assignment</span>
                <h2 className="text-2xl font-extrabold text-white font-mono mt-0.5">{selectedEnquiry.reference}</h2>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 font-medium">{selectedEnquiry.name}</span>
                <div className="text-xs font-bold text-brand-orange">{selectedEnquiry.destination}</div>
              </div>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              {/* Staff Lead Assignment Dropdown */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-brand-orange" />
                    Assign Staff Lead
                  </span>
                  <span className="text-[10px] text-brand-orange font-mono font-semibold">Triggers Instant Push Alert</span>
                </label>
                <select
                  value={editAssignedTo}
                  onChange={(e) => setEditAssignedTo(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-orange font-medium"
                >
                  <option value="">Unassigned — Open Pool</option>
                  {staffMembers.map((staff) => (
                    <option key={staff.id} value={staff.id}>
                      {staff.name} ({staff.department} — {staff.role.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 mb-1.5 block">Pipeline Stage</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as TripStatusStep)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-orange font-medium"
                >
                  {STATUS_STEPS.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 mb-1.5 block">Planner Notes</label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Enter custom trip planning or customer notes..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedEnquiry(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-brand-orange text-white text-xs font-bold shadow-button hover:bg-brand-orange/90 transition-all disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save & Publish Live'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
