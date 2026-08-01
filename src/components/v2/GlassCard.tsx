'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  glow = false,
  ...props
}) => {
  return (
    <motion.div
      className={`relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-800/60 shadow-xl rounded-2xl p-5 ${
        glow ? 'after:absolute after:inset-0 after:rounded-2xl after:shadow-[0_0_30px_rgba(255,101,0,0.15)] after:pointer-events-none' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};
