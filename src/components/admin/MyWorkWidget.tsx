'use client';

import React from 'react';
import Link from 'next/link';
import { Briefcase, Calendar, Clock, CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react';
import { EnquiryRow } from '@/components/admin/EnquiryListClient';

interface MyWorkWidgetProps {
  assignedEnquiries: EnquiryRow[];
  currentUserId: string;
}

export const MyWorkWidget: React.FC<MyWorkWidgetProps> = ({ assignedEnquiries }) => {
  const pendingLeads = assignedEnquiries.filter((e) => e.status === 'new' || e.status === 'contacted');
  const followUps = assignedEnquiries.filter((e) => e.status === 'follow_up');
  const completed = assignedEnquiries.filter((e) => e.status === 'confirmed' || e.status === 'completed');

  return (
    <div className="bg-white rounded-3xl p-6 border border-brand-border/60 shadow-card space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-brand-navy font-heading flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-brand-orange" />
          <span>My Work</span>
        </h2>
        <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-brand-orange/10 text-brand-orange font-mono">
          {assignedEnquiries.length} Assigned Leads
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200">
          <div className="text-xl font-black text-amber-700 font-mono">{pendingLeads.length}</div>
          <div className="text-[11px] font-bold text-amber-800 font-mono uppercase mt-0.5">Pending</div>
        </div>

        <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200">
          <div className="text-xl font-black text-blue-700 font-mono">{followUps.length}</div>
          <div className="text-[11px] font-bold text-blue-800 font-mono uppercase mt-0.5">Follow-ups</div>
        </div>

        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
          <div className="text-xl font-black text-emerald-700 font-mono">{completed.length}</div>
          <div className="text-[11px] font-bold text-emerald-800 font-mono uppercase mt-0.5">Completed</div>
        </div>
      </div>

      <div className="space-y-2.5 pt-2">
        <h3 className="text-xs font-bold text-brand-navy uppercase tracking-wider font-mono">Recent Assigned Enquiries</h3>
        {assignedEnquiries.length === 0 ? (
          <p className="text-xs text-brand-muted py-4 text-center">No enquiries currently assigned to you.</p>
        ) : (
          assignedEnquiries.slice(0, 5).map((enq) => (
            <Link
              key={enq.id}
              href={`/admin/enquiries/${enq.id}`}
              className="flex items-center justify-between p-3 rounded-xl border border-brand-border/40 hover:bg-brand-warm/60 transition-colors"
            >
              <div>
                <div className="font-bold text-xs text-brand-navy">{enq.name}</div>
                <div className="text-[11px] text-brand-muted font-mono">{enq.reference} • {enq.destination}</div>
              </div>
              <ArrowRight className="w-4 h-4 text-brand-orange" />
            </Link>
          ))
        )}
      </div>
    </div>
  );
};
