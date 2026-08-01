'use client';

import React, { useEffect, useCallback } from 'react';
import { clsx } from 'clsx';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  side?: 'left' | 'right' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'full';
  showClose?: boolean;
  className?: string;
}

const sizeMap = {
  left: { sm: 'max-w-xs', md: 'max-w-sm', lg: 'max-w-md', full: 'max-w-full' },
  right: { sm: 'max-w-xs', md: 'max-w-sm', lg: 'max-w-md', full: 'max-w-full' },
  bottom: { sm: 'max-h-[40vh]', md: 'max-h-[60vh]', lg: 'max-h-[80vh]', full: 'max-h-screen' },
};

const slideVariants = {
  left: {
    initial: { x: '-100%' },
    animate: { x: 0 },
    exit: { x: '-100%' },
  },
  right: {
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '100%' },
  },
  bottom: {
    initial: { y: '100%' },
    animate: { y: 0 },
    exit: { y: '100%' },
  },
};

export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  side = 'right',
  size = 'md',
  showClose = true,
  className,
}: DrawerProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  const positionClasses = clsx(
    'fixed z-[100]',
    side === 'left' && 'inset-y-0 left-0 w-full',
    side === 'right' && 'inset-y-0 right-0 w-full',
    side === 'bottom' && 'inset-x-0 bottom-0 w-full'
  );

  const variants = slideVariants[side];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[99] bg-brand-navy/30 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            initial={variants.initial}
            animate={variants.animate}
            exit={variants.exit}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={clsx(
              positionClasses,
              'bg-white shadow-elevated flex flex-col',
              side === 'bottom' ? 'rounded-t-card-lg' : '',
              sizeMap[side][size],
              className
            )}
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            {/* Header */}
            {(title || showClose) && (
              <div className="flex items-center justify-between p-5 border-b border-surface-200/60 shrink-0">
                {title && (
                  <h2 className="text-heading-sm font-heading font-bold text-brand-navy">
                    {title}
                  </h2>
                )}
                {showClose && (
                  <button
                    onClick={onClose}
                    className="p-2 rounded-button text-brand-muted hover:text-brand-text hover:bg-surface-100 transition-colors ml-auto"
                    aria-label="Close drawer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 scrollbar-thin">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
