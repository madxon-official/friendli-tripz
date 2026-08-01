'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Users, ArrowRight, Sparkles, Compass, CheckCircle2, HeartHandshake } from 'lucide-react';
import { ROUTES } from '@/lib/routes';

interface DepartureNode {
  id: string;
  destination: string;
  date: string;
  duration: string;
  price: string;
  seatsLeft: number;
  image: string;
  month: string;
}

interface UpcomingTimelineProps {
  departures: DepartureNode[];
}

export const UpcomingTimeline: React.FC<UpcomingTimelineProps> = ({ departures }) => {
  return (
    <div className="relative py-4">
      {/* Horizontal connecting line on desktop */}
      <div className="hidden md:block absolute top-1/2 left-8 right-8 h-1 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 rounded-full z-0" />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 relative z-10">
        {departures.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -6 }}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl shadow-md hover:shadow-xl transition-all flex flex-col justify-between group"
          >
            {/* Timeline node badge top */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-orange bg-brand-orange-light px-2 py-0.5 rounded-full">
                {item.month}
              </span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                {item.seatsLeft} seats left
              </span>
            </div>

            {/* Thumbnail + info */}
            <div className="flex items-center gap-3 mb-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                <Image src={item.image} alt={item.destination} fill className="object-cover" />
              </div>
              <div>
                <h4 className="font-heading font-extrabold text-sm text-brand-navy dark:text-white group-hover:text-brand-orange transition-colors">
                  {item.destination}
                </h4>
                <p className="text-[11px] text-slate-500 font-semibold">{item.date} • {item.duration}</p>
              </div>
            </div>

            {/* Price & Action */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="font-heading font-extrabold text-sm text-brand-navy dark:text-white">
                {item.price}
              </span>
              <Link
                href={ROUTES.KODAIKANAL}
                className="text-[11px] font-bold text-brand-orange hover:text-brand-orange-hover flex items-center gap-1 group/btn"
              >
                <span>Book</span>
                <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const iconStepMap: Record<string, React.FC<{ className?: string }>> = {
  Sparkles,
  Compass,
  CheckCircle2,
  HeartHandshake,
};

interface HowItWorksStep {
  step: string;
  title: string;
  description: string;
  icon: string;
}

interface ProcessTimelineProps {
  steps: HowItWorksStep[];
}

export const ProcessTimeline: React.FC<ProcessTimelineProps> = ({ steps }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
      {steps.map((item, index) => {
        const IconComponent = iconStepMap[item.icon] || Sparkles;
        return (
          <motion.div
            key={item.step}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-3xl shadow-sm hover:shadow-lg transition-all group"
          >
            {/* Step number badge */}
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-orange-light text-brand-orange flex items-center justify-center font-extrabold group-hover:bg-brand-orange group-hover:text-white transition-all shadow-inner">
                <IconComponent className="w-6 h-6" />
              </div>
              <span className="font-mono text-xs font-bold text-slate-300 dark:text-slate-700 uppercase tracking-widest">
                STEP {item.step}
              </span>
            </div>

            <h3 className="font-heading font-extrabold text-lg text-brand-navy dark:text-white mb-2">
              {item.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {item.description}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
};
