import React from 'react';
import Link from 'next/link';
import { clsx } from 'clsx';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'glass';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
}

interface ButtonAsButton extends ButtonBaseProps, Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> {
  href?: never;
}

interface ButtonAsLink extends ButtonBaseProps, Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps> {
  href: string;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-orange text-white shadow-button hover:bg-brand-orange-hover hover:shadow-button-hover active:scale-[0.98]',
  secondary:
    'bg-brand-navy text-white shadow-subtle hover:bg-brand-navy-light active:scale-[0.98]',
  outline:
    'bg-transparent text-brand-navy border-2 border-brand-navy/20 hover:border-brand-navy hover:bg-brand-navy/5 active:scale-[0.98]',
  ghost:
    'bg-transparent text-brand-navy hover:bg-surface-100 active:scale-[0.98]',
  danger:
    'bg-accent-rose text-white shadow-sm hover:bg-red-600 active:scale-[0.98]',
  glass:
    'glass text-brand-navy hover:bg-white/80 active:scale-[0.98]',
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: 'px-3 py-1.5 text-caption gap-1.5 rounded-lg',
  sm: 'px-4 py-2 text-body-sm gap-2 rounded-button',
  md: 'px-6 py-2.5 text-body-sm gap-2 rounded-button',
  lg: 'px-8 py-3.5 text-body gap-2.5 rounded-card',
  xl: 'px-10 py-4 text-body-lg gap-3 rounded-card',
};

export function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    size = 'md',
    icon,
    iconRight,
    loading = false,
    fullWidth = false,
    className,
    children,
    ...rest
  } = props;

  const classes = clsx(
    'inline-flex items-center justify-center font-bold transition-all duration-200 ease-out-expo',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
    variantStyles[variant],
    sizeStyles[size],
    fullWidth && 'w-full',
    className
  );

  const content = (
    <>
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        icon
      )}
      <span>{children}</span>
      {iconRight}
    </>
  );

  if ('href' in rest && rest.href) {
    const { href, ...linkRest } = rest as ButtonAsLink;
    return (
      <Link href={href} className={classes} {...linkRest}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classes} disabled={loading} {...(rest as ButtonAsButton)}>
      {content}
    </button>
  );
}
