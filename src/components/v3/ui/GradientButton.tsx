import React from 'react';
import Link from 'next/link';
import { clsx } from 'clsx';
import { Sparkles, ArrowRight } from 'lucide-react';

interface GradientButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'orange' | 'navy' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  glow?: boolean;
  className?: string;
}

const variantStyles = {
  orange:
    'bg-gradient-to-r from-brand-orange to-[#FF8533] text-white shadow-button hover:shadow-button-hover',
  navy:
    'bg-gradient-to-r from-brand-navy to-brand-navy-light text-white shadow-subtle hover:shadow-card',
  glass:
    'glass text-brand-navy hover:bg-white/80',
};

const sizeStyles = {
  sm: 'px-5 py-2.5 text-body-sm gap-2 rounded-button',
  md: 'px-7 py-3.5 text-body gap-2.5 rounded-card',
  lg: 'px-10 py-4.5 text-body-lg gap-3 rounded-card-lg',
};

export function GradientButton({
  children,
  href,
  onClick,
  variant = 'orange',
  size = 'md',
  icon,
  glow = false,
  className,
}: GradientButtonProps) {
  const classes = clsx(
    'inline-flex items-center justify-center font-bold transition-all duration-300 ease-out-expo',
    'active:scale-[0.97] hover:scale-[1.02]',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange',
    variantStyles[variant],
    sizeStyles[size],
    glow && 'animate-glow-pulse',
    className
  );

  const content = (
    <>
      {icon || (variant === 'orange' && <Sparkles className="w-4 h-4" />)}
      <span>{children}</span>
      <ArrowRight className="w-4 h-4 opacity-70" />
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {content}
    </button>
  );
}
