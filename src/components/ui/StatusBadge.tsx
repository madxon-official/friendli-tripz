'use client';

import React from 'react';
import {
  Clock,
  CheckCircle2,
  UserCheck,
  CreditCard,
  Building2,
  Compass,
  AlertCircle,
  RotateCcw,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export type OperationStatus =
  | 'pending'
  | 'confirmed'
  | 'assigned'
  | 'paid'
  | 'checked_in'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'refunded'
  | 'follow_up'
  | 'new'
  | 'contacted';

interface StatusBadgeProps {
  status: OperationStatus | string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
  customLabel?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
  className = '',
  customLabel,
}) => {
  const normStatus = (status || '').toLowerCase().trim();

  let config = {
    label: customLabel || normStatus.replace(/_/g, ' '),
    bgColor: 'bg-slate-100',
    textColor: 'text-slate-700',
    borderColor: 'border-slate-200',
    icon: Clock,
  };

  switch (normStatus) {
    case 'pending':
    case 'new':
      config = {
        label: customLabel || 'Pending',
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-700',
        borderColor: 'border-amber-200/80',
        icon: Clock,
      };
      break;

    case 'confirmed':
      config = {
        label: customLabel || 'Confirmed',
        bgColor: 'bg-emerald-50',
        textColor: 'text-emerald-700',
        borderColor: 'border-emerald-200/80',
        icon: CheckCircle2,
      };
      break;

    case 'assigned':
      config = {
        label: customLabel || 'Assigned',
        bgColor: 'bg-sky-50',
        textColor: 'text-sky-700',
        borderColor: 'border-sky-200/80',
        icon: UserCheck,
      };
      break;

    case 'paid':
      config = {
        label: customLabel || 'Paid',
        bgColor: 'bg-teal-50',
        textColor: 'text-teal-700',
        borderColor: 'border-teal-200/80',
        icon: CreditCard,
      };
      break;

    case 'checked_in':
      config = {
        label: customLabel || 'Checked In',
        bgColor: 'bg-indigo-50',
        textColor: 'text-indigo-700',
        borderColor: 'border-indigo-200/80',
        icon: Building2,
      };
      break;

    case 'in_progress':
    case 'contacted':
    case 'follow_up':
      config = {
        label: customLabel || 'In Progress',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700',
        borderColor: 'border-blue-200/80',
        icon: Compass,
      };
      break;

    case 'completed':
      config = {
        label: customLabel || 'Completed',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-700',
        borderColor: 'border-purple-200/80',
        icon: ShieldCheck,
      };
      break;

    case 'cancelled':
      config = {
        label: customLabel || 'Cancelled',
        bgColor: 'bg-rose-50',
        textColor: 'text-rose-700',
        borderColor: 'border-rose-200/80',
        icon: AlertCircle,
      };
      break;

    case 'refunded':
      config = {
        label: customLabel || 'Refunded',
        bgColor: 'bg-slate-100',
        textColor: 'text-slate-600',
        borderColor: 'border-slate-300',
        icon: RotateCcw,
      };
      break;

    default:
      config = {
        label: customLabel || normStatus.replace(/_/g, ' '),
        bgColor: 'bg-slate-100',
        textColor: 'text-slate-700',
        borderColor: 'border-slate-200',
        icon: Sparkles,
      };
      break;
  }

  const IconComponent = config.icon;

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1 font-mono uppercase tracking-wider',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-bold',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-bold',
  }[size];

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border transition-colors ${config.bgColor} ${config.textColor} ${config.borderColor} ${sizeClasses} ${className}`}
    >
      {showIcon && <IconComponent className={`${iconSizes} shrink-0`} />}
      <span className="capitalize">{config.label}</span>
    </span>
  );
};
