import React from 'react';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'white';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  target?: string;
  rel?: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  href,
  target,
  rel,
  children,
  className = '',
  icon,
  iconPosition = 'right',
  onClick,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] min-h-[44px]';

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm gap-1.5',
    md: 'px-5 py-2.5 text-base gap-2',
    lg: 'px-7 py-3.5 text-lg gap-2.5 shadow-button',
  };

  const variantStyles = {
    primary:
      'bg-brand-orange text-white hover:bg-brand-orange-hover focus-visible:ring-brand-orange shadow-button',
    secondary:
      'bg-brand-navy text-white hover:bg-brand-navy-dark focus-visible:ring-brand-navy',
    outline:
      'border-2 border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white focus-visible:ring-brand-navy',
    ghost:
      'text-brand-navy hover:bg-brand-soft-navy focus-visible:ring-brand-navy',
    white:
      'bg-white text-brand-navy hover:bg-brand-warm focus-visible:ring-white shadow-md',
  };

  const combinedClasses = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  const content = (
    <>
      {icon && iconPosition === 'left' && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="inline-flex shrink-0">{icon}</span>}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        target={target}
        rel={rel}
        onClick={onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>}
        className={combinedClasses}
      >
        {content}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} onClick={onClick} {...props}>
      {content}
    </button>
  );
};
