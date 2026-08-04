'use client';

import React, { useState } from 'react';
import { Search, Link2, Check, Clock, UserPlus, XCircle } from 'lucide-react';
import { DbInvitation } from '@/lib/actions/teamActions';

interface InvitationsTabProps {
  invitations: DbInvitation[];
}

export const InvitationsTab: React.FC<InvitationsTabProps> = ({ invitations }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = invitations.filter((inv) => {
    const matchesSearch =
      inv.full_name.toLowerCase().includes(search.toLowerCase()) ||
      inv.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleCopyLink = (inv: DbInvitation) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    const inviteUrl = `${baseUrl}/admin/set-password?token=${inv.token || inv.id}&email=${encodeURIComponent(inv.email)}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedId(inv.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <Check className="w-3 h-3" /> accepted
          </span>
        );
      case 'cancelled':
        return (
          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-500/15 text-slate-400 border border-slate-700 flex items-center gap-1">
            <XCircle className="w-3 h-3" /> cancelled
          </span>
        );
      case 'expired':
        return (
          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center gap-1">
            <Clock className="w-3 h-3" /> expired
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1">
            <Clock className="w-3 h-3" /> pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search invitations by email, name, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:border-brand-orange shrink-0"
        >
          <option value="All">All Invitation Statuses</option>
          <option value="accepted">Accepted</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      <div className="pt-2">
        <h3 className="text-base font-extrabold text-white mb-4">Team Invitations Lifecycle</h3>

        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs bg-slate-900 rounded-2xl border border-slate-800">
            <UserPlus className="w-8 h-8 text-slate-700 mx-auto mb-2 opacity-50" />
            No invitations matching the selected criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((inv) => (
              <div key={inv.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 hover:border-slate-700 transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-extrabold text-white">{inv.full_name}</h4>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{inv.email}</p>
                  </div>
                  {getStatusBadge(inv.status)}
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-500 uppercase block">Role</span>
                    <span className="font-bold text-white uppercase">{inv.role}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-500 uppercase block">Invited By</span>
                    <span className="font-bold text-white">{inv.invited_by}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-500 uppercase block">Sent Date</span>
                    <span className="font-mono text-slate-300">{inv.sent_date}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-500 uppercase block">
                      {inv.status === 'accepted' ? 'Accepted Date' : 'Expiry Date'}
                    </span>
                    <span className="font-mono text-slate-300">{inv.accepted_date || inv.expiry_date}</span>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => handleCopyLink(inv)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
                  >
                    <Link2 className="w-3.5 h-3.5 text-brand-orange" />
                    {copiedId === inv.id ? 'Copied Link!' : 'Link'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
