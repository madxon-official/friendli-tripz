'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ icon, error, className = '', ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={`w-full ${
            icon ? 'pl-10' : 'px-4'
          } pr-4 py-2.5 rounded-xl border text-sm text-slate-900 bg-white placeholder-slate-400 transition-all focus:outline-none focus:ring-2 ${
            error
              ? 'border-rose-300 focus:ring-rose-200 focus:border-rose-500'
              : 'border-slate-200 focus:ring-brand-orange/30 focus:border-brand-orange'
          } ${className}`}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';
