'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Compass, UserCheck, Car, Users, Smile, Headphones, Calendar, Receipt } from 'lucide-react';

const iconTrustMap: Record<string, React.FC<{ className?: string }>> = {
  ShieldCheck,
  Compass,
  UserCheck,
  Car,
  Users,
  Smile,
  Headphones,
  Calendar,
  Receipt,
};

interface TrustCardProps {
  title: string;
  description: string;
  iconName?: string;
  icon?: string;
  index: number;
}

export const TrustCard: React.FC<TrustCardProps> = ({
  title,
  description,
  iconName,
  icon,
  index,
}) => {
  const key = iconName || icon || 'ShieldCheck';
  const IconComponent = iconTrustMap[key] || ShieldCheck;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
    >
      <div>
        <div className="w-12 h-12 rounded-2xl bg-brand-soft-navy text-brand-navy dark:bg-slate-800 dark:text-brand-orange flex items-center justify-center mb-4 group-hover:bg-brand-orange group-hover:text-white transition-all shadow-sm">
          <IconComponent className="w-6 h-6" />
        </div>

        <h3 className="font-heading font-extrabold text-base sm:text-lg text-brand-navy dark:text-white mb-1.5">
          {title}
        </h3>

        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
};
