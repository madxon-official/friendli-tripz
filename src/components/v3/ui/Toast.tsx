'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { clsx } from 'clsx';
import { X, CheckCircle2, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type ToastVariant = 'success' | 'error' | 'warning' | 'info';

interface ToastData {
  id: string;
  message: string;
  variant?: ToastVariant;
  duration?: number;
}

const variantConfig: Record<ToastVariant, { icon: React.ReactNode; className: string }> = {
  success: {
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    className: 'border-emerald-200 bg-emerald-50',
  },
  error: {
    icon: <AlertCircle className="w-5 h-5 text-rose-500" />,
    className: 'border-rose-200 bg-rose-50',
  },
  warning: {
    icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    className: 'border-amber-200 bg-amber-50',
  },
  info: {
    icon: <Info className="w-5 h-5 text-sky-500" />,
    className: 'border-sky-200 bg-sky-50',
  },
};

/* Standalone toast item */
function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastData;
  onDismiss: (id: string) => void;
}) {
  const config = variantConfig[toast.variant || 'info'];

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={clsx(
        'flex items-start gap-3 p-4 rounded-card border shadow-card min-w-[300px] max-w-md',
        config.className
      )}
      role="alert"
    >
      <div className="shrink-0 mt-0.5">{config.icon}</div>
      <p className="text-body-sm font-medium text-brand-text flex-1">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4 text-brand-muted" />
      </button>
    </motion.div>
  );
}

/* Toast container with state management */
let toastEmitter: ((toast: Omit<ToastData, 'id'>) => void) | null = null;

export function toast(data: Omit<ToastData, 'id'>) {
  toastEmitter?.(data);
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    toastEmitter = (data) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev, { ...data, id }]);
    };
    return () => {
      toastEmitter = null;
    };
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <div className="toast-container" aria-live="polite">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}
