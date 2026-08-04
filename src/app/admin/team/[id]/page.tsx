'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Phone, ArrowLeft, Building, Bell, RefreshCw } from 'lucide-react';
import { AdminRouteGuard } from '@/components/admin/ui/AdminRouteGuard';
import { fetchMemberProfile, DbTeamMember } from '@/lib/actions/teamActions';
import { ROLES } from '@/lib/rbac/roles';

export default function MemberProfilePage() {
  const params = useParams();
  const id = (params?.id as string) || '';

  const [member, setMember] = useState<DbTeamMember | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchMemberProfile(id).then((res) => {
        setMember(res);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return (
      <AdminRouteGuard modulePath="/admin/team">
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl">
          <RefreshCw className="w-6 h-6 text-brand-orange animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-400">Loading Member Profile from Supabase...</p>
        </div>
      </AdminRouteGuard>
    );
  }

  if (!member) {
    return (
      <AdminRouteGuard modulePath="/admin/team">
        <div className="space-y-6">
          <Link href="/admin/team" className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Team Roster
          </Link>
          <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-3xl">
            <h2 className="text-lg font-bold text-white">Team Member Not Found</h2>
            <p className="text-xs text-slate-400 mt-1">No profile record matches ID "{id}".</p>
          </div>
        </div>
      </AdminRouteGuard>
    );
  }

  return (
    <AdminRouteGuard modulePath="/admin/team">
      <div className="space-y-8 animate-fade-in max-w-4xl">
        <Link href="/admin/team" className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Team Roster
        </Link>

        {/* Member Profile Header Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-elevated">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-slate-800 pb-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center font-extrabold text-2xl text-brand-orange">
                {member.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-extrabold text-white">{member.name}</h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-950/60 border border-emerald-800 text-emerald-400">
                    {member.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 font-mono">{member.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-xl text-xs font-bold ${ROLES[member.role]?.badgeBg} ${ROLES[member.role]?.badgeText} border ${ROLES[member.role]?.badgeBorder}`}>
                {ROLES[member.role]?.label || member.role} Role
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">Email Address</span>
              <span className="font-mono font-bold text-white mt-1 block truncate">{member.email}</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">Phone Number</span>
              <span className="font-mono font-bold text-white mt-1 block">{member.phone}</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">Department</span>
              <span className="font-bold text-white mt-1 block">{member.department}</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">Joined Date</span>
              <span className="font-bold text-brand-orange mt-1 block">{member.joined_date}</span>
            </div>
          </div>
        </div>

        {/* Assigned Work & Notifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-card">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-brand-orange" /> Department Scope
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
              Assigned to the <strong className="text-white">{member.department}</strong> department under the <strong className="text-brand-orange">{ROLES[member.role]?.label}</strong> role.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-card">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-brand-orange" /> Notification Subscriptions
            </h3>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <span>Role Operational Alerts</span>
                <span className="text-emerald-400 font-bold">Subscribed</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <span>Realtime Activity Stream</span>
                <span className="text-emerald-400 font-bold">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminRouteGuard>
  );
}
