'use client';

import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Building2 } from 'lucide-react';
import { DbDepartment } from '@/lib/actions/teamActions';

interface DepartmentsTabProps {
  departments: DbDepartment[];
}

export const DepartmentsTab: React.FC<DepartmentsTabProps> = ({ departments }) => {
  const [filter, setFilter] = useState('Active Departments');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-extrabold text-white">Enterprise Departments</h3>
          <p className="text-xs text-slate-400">Departmental breakdown, manager assignments, and staff allocation.</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:border-brand-orange"
          >
            <option value="Active Departments">Active Departments</option>
            <option value="All">All Departments</option>
          </select>

          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-orange text-white text-xs font-extrabold shadow-md hover:bg-brand-orange/90 transition-all">
            <Plus className="w-4 h-4" /> Add Department
          </button>
        </div>
      </div>

      {/* Grid of Department Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <div key={dept.id} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 hover:border-slate-700 transition-all shadow-sm">
            {/* Top Bar: Title & Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: dept.color }} />
                <h4 className="text-base font-extrabold text-white">{dept.name}</h4>
              </div>

              <div className="flex items-center gap-1.5 text-slate-500">
                <button className="p-1 hover:text-slate-200 rounded-lg">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button className="p-1 hover:text-rose-400 rounded-lg">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Manager Box */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase">Manager:</span>
              <span className="font-bold text-white font-mono">{dept.manager_name || 'Unassigned'}</span>
            </div>

            {/* 4 Stat Boxes Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-[9px] font-extrabold text-slate-500 uppercase block">Active Members</span>
                <span className="text-base font-extrabold text-emerald-400 mt-1 block">{dept.active_members || 0}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-[9px] font-extrabold text-slate-500 uppercase block">Total Staff</span>
                <span className="text-base font-extrabold text-white mt-1 block">{dept.total_staff || 0}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-[9px] font-extrabold text-slate-500 uppercase block">Suspended</span>
                <span className="text-base font-extrabold text-rose-400 mt-1 block">{dept.suspended || 0}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-[9px] font-extrabold text-slate-500 uppercase block">Pending Invites</span>
                <span className="text-base font-extrabold text-amber-400 mt-1 block">{dept.pending_invites || 0}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
