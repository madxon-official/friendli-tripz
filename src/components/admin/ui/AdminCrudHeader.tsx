'use client';

import React from 'react';
import { Plus } from 'lucide-react';

interface AdminCrudHeaderProps {
  title: string;
  description: string;
  actionLabel?: string;
  onActionClick?: () => void;
  actionIcon?: React.ElementType;
}

export const AdminCrudHeader: React.FC<AdminCrudHeaderProps> = ({
  title,
  description,
  actionLabel,
  onActionClick,
  actionIcon: ActionIcon = Plus,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-6 mb-8 gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">{title}</h1>
        <p className="text-xs md:text-sm text-slate-400 mt-1">{description}</p>
      </div>

      {actionLabel && (
        <button
          onClick={onActionClick}
          className="bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-button flex items-center gap-2 shrink-0"
        >
          <ActionIcon className="w-4 h-4" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
};
