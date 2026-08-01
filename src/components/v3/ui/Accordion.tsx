'use client';

import React, { useState } from 'react';
import { clsx } from 'clsx';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  defaultOpen?: string;
  allowMultiple?: boolean;
  variant?: 'default' | 'card' | 'minimal';
  className?: string;
}

export function Accordion({
  items,
  defaultOpen,
  allowMultiple = false,
  variant = 'default',
  className,
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(
    defaultOpen ? new Set([defaultOpen]) : new Set()
  );

  const toggle = (id: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (!allowMultiple) next.clear();
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className={clsx('space-y-3', className)} role="region">
      {items.map((item) => {
        const isOpen = openItems.has(item.id);

        return (
          <div
            key={item.id}
            className={clsx(
              'overflow-hidden transition-all duration-200',
              variant === 'default' &&
                'bg-white border border-surface-200/80 rounded-card-lg shadow-subtle',
              variant === 'card' &&
                clsx(
                  'bg-surface-50 border rounded-card-lg',
                  isOpen
                    ? 'border-brand-orange/30 bg-white shadow-card'
                    : 'border-surface-200/80'
                ),
              variant === 'minimal' &&
                'border-b border-surface-200/60 rounded-none'
            )}
          >
            <button
              onClick={() => toggle(item.id)}
              className={clsx(
                'w-full text-left flex items-center justify-between font-heading font-bold transition-colors',
                variant === 'minimal' ? 'py-4 px-0' : 'p-5',
                'text-body-sm sm:text-body',
                isOpen ? 'text-brand-navy' : 'text-brand-text hover:text-brand-orange'
              )}
              aria-expanded={isOpen}
              aria-controls={`accordion-panel-${item.id}`}
            >
              <span className="flex items-center gap-3 pr-4">
                {item.icon}
                {item.title}
              </span>
              <ChevronDown
                className={clsx(
                  'w-5 h-5 text-brand-orange transition-transform duration-300 shrink-0',
                  isOpen && 'rotate-180'
                )}
              />
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`accordion-panel-${item.id}`}
                  role="region"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div
                    className={clsx(
                      'text-body-sm text-brand-muted leading-relaxed',
                      variant === 'minimal'
                        ? 'pb-4'
                        : 'px-5 pb-5 border-t border-surface-200/60 pt-3'
                    )}
                  >
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
