'use client';

import React, { useState, useEffect } from 'react';
import { X, Pencil, User, Phone, Building2, ShieldCheck } from 'lucide-react';
import { DbTeamMember, DbDepartment, updateMemberProfile } from '@/lib/actions/teamActions';
import { AdminRole } from '@/lib/rbac/roles';

interface EditStaffModalProps {
  member: DbTeamMember | null;
  departments: DbDepartment[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditStaffModal: React.FC<EditStaffModalProps> = ({
  member,
  departments,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [role, setRole] = useState<AdminRole>('operations');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (member) {
      setName(member.name);
      setPhone(member.phone !== 'N/A' ? member.phone : '');
      setDepartmentId(member.department_id || (departments[0]?.id || ''));
      setRole(member.role);
    }
  }, [member, departments]);

  if (!isOpen || !member) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const ok = await updateMemberProfile(member.id, {
      name,
      phone,
      department_id: departmentId,
      role,
    });
    setLoading(false);
    if (ok) {
      onSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-elevated p-8 z-50 text-slate-100 animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-brand-orange/15 border border-brand-orange/30 flex items-center justify-center text-brand-orange">
            <Pencil className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-white">Edit Staff Member Profile</h3>
            <p className="text-xs text-slate-400">Update staff details and access levels in Supabase.</p>
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-orange"
            />
          </div>

          <div>
            <label className="block text-[11px] font-extrabold text-slate-400 uppercase mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-brand-orange" /> Phone Number
            </label>
            <input
              type="text"
              placeholder="e.g. +91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-orange font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-extrabold text-slate-400 uppercase mb-1.5 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-brand-orange" /> Department
            </label>
            <select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-orange"
            >
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
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
              disabled={member.role === 'owner'}
              onChange={(e) => setRole(e.target.value as AdminRole)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-orange disabled:opacity-50"
            >
              {member.role === 'owner' && (
                <option value="owner">Owner — Single Platform Owner</option>
              )}
              <option value="admin">Administrator — Operations & team control</option>
              <option value="operations">Operations — Trip operations team</option>
              <option value="support">Support — Customer support team</option>
            </select>
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
              disabled={loading}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-orange text-white hover:bg-brand-orange/90 transition-all shadow-md disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
