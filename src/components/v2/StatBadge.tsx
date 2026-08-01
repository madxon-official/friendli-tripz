'use client';

import React from 'react';
import { AnimatedCounter } from './AnimatedCounter';

interface StatBadgeProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export const StatBadge: React.FC<StatBadgeProps> = ({
  icon,
  value,
  label,
  prefix,
  suffix,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-2.5 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/20 text-white ${className}`}>
      <div className="w-8 h-8 rounded-xl bg-brand-orange/20 border border-brand-orange/40 flex items-center justify-center text-brand-orange">
        {icon}
      </div>
      <div>
        <div className="font-heading font-extrabold text-sm sm:text-base text-white flex items-center leading-none">
          <AnimatedCounter to={value} prefix={prefix} suffix={suffix} />
        </div>
        <span className="text-[10px] text-slate-300 font-medium leading-tight block mt-0.5">
          {label}
        </span>
      </div>
    </div>
  );
};
