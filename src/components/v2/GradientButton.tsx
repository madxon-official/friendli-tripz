'use client';

import React from 'react';
import Link from 'next/link';
import { motion, HTMLMotionProps } from 'framer-motion';

interface GradientButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode;
  href?: string;
  variant?: 'primary' | 'secondary' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  className?: string;
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  children,
  href,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-bold tracking-tight rounded-xl transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2 active:scale-[0.98] shrink-0';

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-brand-orange via-amber-500 to-brand-orange text-white hover:brightness-110 shadow-brand-orange/20 border border-brand-orange/30',
    secondary:
      'bg-brand-navy text-white hover:bg-brand-navy-dark shadow-brand-navy/20 border border-brand-navy/40',
    glass:
      'bg-white/10 backdrop-blur-md text-white border border-white/30 hover:bg-white/20 hover:border-white/50 shadow-black/10',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-xs gap-1.5 min-h-[38px]',
    md: 'px-5 py-2.5 text-sm gap-2 min-h-[44px]',
    lg: 'px-7 py-3.5 text-base gap-2.5 min-h-[52px]',
  };

  const content = (
    <>
      <span>{children}</span>
      {icon && <span className="transition-transform group-hover:translate-x-1">{icon}</span>}
    </>
  );

  const combinedClass = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} group ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClass}>
        {content}
      </Link>
    );
  }

  return (
    <motion.button className={combinedClass} {...props}>
      {content}
    </motion.button>
  );
};
