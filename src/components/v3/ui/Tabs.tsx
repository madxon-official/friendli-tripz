'use client';

import React, { useState } from 'react';
import { clsx } from 'clsx';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  size?: 'sm' | 'md';
  className?: string;
}

export function Tabs({
  tabs,
  defaultTab,
  onChange,
  variant = 'default',
  size = 'md',
  className,
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  return (
    <div
      className={clsx(
        'flex',
        variant === 'default' && 'bg-surface-100 p-1 rounded-card gap-1',
        variant === 'pills' && 'gap-2 flex-wrap',
        variant === 'underline' && 'border-b border-surface-200 gap-0',
        className
      )}
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            role="tab"
            aria-selected={isActive}
            className={clsx(
              'inline-flex items-center justify-center font-bold transition-all duration-200 whitespace-nowrap',
              size === 'sm' ? 'text-caption gap-1.5' : 'text-body-sm gap-2',

              // Default (segmented control)
              variant === 'default' && clsx(
                size === 'sm' ? 'px-3 py-1.5 rounded-button' : 'px-4 py-2 rounded-button',
                isActive
                  ? 'bg-white text-brand-navy shadow-subtle'
                  : 'text-brand-muted hover:text-brand-text'
              ),

              // Pills
              variant === 'pills' && clsx(
                size === 'sm' ? 'px-3 py-1.5 rounded-badge' : 'px-4 py-2 rounded-badge',
                isActive
                  ? 'bg-brand-navy text-white shadow-subtle'
                  : 'bg-surface-100 text-brand-muted hover:text-brand-text hover:bg-surface-200'
              ),

              // Underline
              variant === 'underline' && clsx(
                size === 'sm' ? 'px-3 py-2' : 'px-4 py-3',
                'border-b-2 -mb-px',
                isActive
                  ? 'border-brand-orange text-brand-navy'
                  : 'border-transparent text-brand-muted hover:text-brand-text hover:border-surface-300'
              )
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={clsx(
                  'text-[10px] font-extrabold px-1.5 py-0.5 rounded-badge min-w-[18px] text-center',
                  isActive
                    ? variant === 'pills'
                      ? 'bg-white/20 text-white'
                      : 'bg-brand-orange/10 text-brand-orange'
                    : 'bg-surface-200 text-brand-muted'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
