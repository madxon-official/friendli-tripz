'use client';

import React, { useState } from 'react';
import { X, Send, User, Mail, Phone, ShieldCheck, Building } from 'lucide-react';
import { AdminRole } from '@/lib/rbac/roles';
import { DbDepartment, inviteTeamMember } from '@/lib/actions/teamActions';

interface InviteMemberModalProps {
  isOpen: boolean;
  departments?: DbDepartment[];
  onClose: () => void;
  onSuccess?: () => void;
  onInvite?: (member: {
    name: string;
    email: string;
    phone: string;
    department: string;
    role: AdminRole;
  }) => void;
}

export const InviteMemberModal: React.FC<InviteMemberModalProps> = ({
  isOpen,
  departments = [],
  onClose,
  onSuccess,
  onInvite,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState(departments[0]?.name || 'Operations');
  const [role, setRole] = useState<AdminRole>('admin');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) return;

    setSubmitting(true);
    await inviteTeamMember({ name, email, phone, department, role });
    if (onInvite) {
      onInvite({ name, email, phone, department, role });
    }
    if (onSuccess) {
      onSuccess();
    }
    setSubmitting(false);
    onClose();
    setName('');
    setEmail('');
    setPhone('');
  };

  const activeDepts = departments.length > 0 ? departments : [
    { id: '1', name: 'Management', color: '#F59E0B' },
    { id: '2', name: 'Operations', color: '#3B82F6' },
    { id: '3', name: 'Customer Support', color: '#8B5CF6' },
    { id: '4', name: 'Marketing', color: '#EC4899' },
    { id: '5', name: 'Content', color: '#10B981' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-elevated p-8 z-50 text-slate-100 animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-brand-orange/15 border border-brand-orange/30 flex items-center justify-center text-brand-orange">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-white">Invite Team Member</h3>
            <p className="text-xs text-slate-400">Send an invitation email to add a staff member.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-extrabold text-slate-400 uppercase mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-brand-orange" /> Full Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Alex Morgan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange"
            />
          </div>

          <div>
            <label className="block text-[11px] font-extrabold text-slate-400 uppercase mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-brand-orange" /> Email Address
            </label>
            <input
              type="email"
              required
              placeholder="alex@friendlitripz.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-extrabold text-slate-400 uppercase mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-brand-orange" /> Phone Number
            </label>
            <input
              type="tel"
              required
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-extrabold text-slate-400 uppercase mb-1.5 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-brand-orange" /> Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand-orange"
              >
                {activeDepts.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-slate-400 uppercase mb-1.5 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-orange" /> Assigned Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as AdminRole)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand-orange"
              >
                <option value="admin">Administrator</option>
                <option value="operations">Operations</option>
                <option value="support">Support</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-brand-orange text-white hover:bg-brand-orange/90 transition-all shadow-md disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              {submitting ? 'Sending...' : 'Send Invitation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
