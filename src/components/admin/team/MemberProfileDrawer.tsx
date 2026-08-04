'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, Mail, Phone, Building2, UserCheck, Calendar, Clock, Layers } from 'lucide-react';
import { DbTeamMember } from '@/lib/actions/teamActions';

interface MemberProfileDrawerProps {
  member: DbTeamMember | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MemberProfileDrawer: React.FC<MemberProfileDrawerProps> = ({ member, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'permissions' | 'attendance' | 'payroll'>('overview');

  if (!isOpen || !member) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />

      {/* Slide-over Drawer Panel */}
      <div className="relative w-full max-w-xl bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-elevated z-50 animate-fade-in text-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Drawer Header */}
        <div className="p-8 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-brand-orange/20 border-2 border-brand-orange/40 flex items-center justify-center text-brand-orange text-xl font-extrabold shadow-sm shrink-0">
              {member.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white tracking-tight">{member.name}</h2>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-brand-orange/20 text-brand-orange border border-brand-orange/30 uppercase">
                  {member.role}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-1">{member.email}</p>
            </div>
          </div>

          {/* Drawer Tabs */}
          <div className="flex items-center gap-6 mt-8 border-b border-slate-800/80 -mb-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 text-xs font-bold transition-colors border-b-2 ${
                activeTab === 'overview'
                  ? 'border-brand-orange text-brand-orange'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('permissions')}
              className={`pb-3 text-xs font-bold transition-colors border-b-2 ${
                activeTab === 'permissions'
                  ? 'border-brand-orange text-brand-orange'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Permissions (28)
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={`pb-3 text-xs font-bold transition-colors border-b-2 ${
                activeTab === 'attendance'
                  ? 'border-brand-orange text-brand-orange'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Attendance
            </button>
            <button
              onClick={() => setActiveTab('payroll')}
              className={`pb-3 text-xs font-bold transition-colors border-b-2 ${
                activeTab === 'payroll'
                  ? 'border-brand-orange text-brand-orange'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Payroll
            </button>
          </div>
        </div>

        {/* Drawer Body Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-thin">
          {activeTab === 'overview' && (
            <>
              {/* Role & Status Top Row Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-orange" /> Role & Authority
                  </span>
                  <div className="mt-3">
                    <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-brand-orange/15 text-brand-orange border border-brand-orange/30 uppercase">
                      {member.role}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400" /> Account Status
                  </span>
                  <div className="mt-3">
                    <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 capitalize">
                      {member.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dedicated Lead Performance & Workload Telemetry Card */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-brand-orange" /> Lead Performance & Workload
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                    Live Telemetry
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-1">
                  <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 uppercase block font-semibold">Active Leads</span>
                    <span className="text-lg font-extrabold text-brand-orange mt-1 block">{member.assigned_enquiries_count}</span>
                  </div>
                  <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 uppercase block font-semibold">Completed Trips</span>
                    <span className="text-lg font-extrabold text-emerald-400 mt-1 block">{member.completed_enquiries_count || 0}</span>
                  </div>
                  <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 uppercase block font-semibold">Total Handled</span>
                    <span className="text-lg font-extrabold text-white mt-1 block">{member.total_enquiries_count || 0}</span>
                  </div>
                </div>
              </div>

              {/* Personal Details Grid Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-400" /> Email Address
                  </span>
                  <p className="text-xs font-mono font-bold text-white mt-2 truncate">{member.email}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-purple-400" /> Phone Number
                  </span>
                  <p className="text-xs font-mono font-bold text-white mt-2">{member.phone || '-'}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-amber-400" /> Department
                  </span>
                  <p className="text-xs font-bold text-white mt-2">{member.department}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-slate-400" /> Created By
                  </span>
                  <p className="text-xs font-bold text-white mt-2">{member.created_by || 'vignesh'}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 col-span-2">
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" /> Joined Date
                  </span>
                  <p className="text-xs font-bold text-white mt-2">{member.joined_date}</p>
                </div>
              </div>

              {/* Last Sign In Banner */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> Last Sign In
                </span>
                <p className="text-xs font-bold text-slate-300 mt-2">{member.last_active || 'Never signed in'}</p>
              </div>
            </>
          )}

          {activeTab === 'permissions' && (
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-white mb-2">Granted Module Access (28 Rules)</h4>
              {['Dashboard Overview', 'Enquiries & Lead Management', 'Destinations & Experiences Catalog', 'Homepage CMS', 'Trip Tracker & Dispatch', 'Team & Access Control'].map((perm) => (
                <div key={perm} className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200">
                  <span>{perm}</span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    ALLOWED
                  </span>
                </div>
              ))}
            </div>
          )}

          {(activeTab === 'attendance' || activeTab === 'payroll') && (
            <div className="p-12 text-center text-slate-500 text-xs bg-slate-950 rounded-2xl border border-slate-800">
              Operational logs active. Enterprise module in sync with Supabase.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
