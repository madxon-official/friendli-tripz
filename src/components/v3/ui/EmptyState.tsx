import React from 'react';
import { clsx } from 'clsx';
import { Inbox, Search, FileText, MapPin, Compass } from 'lucide-react';
import { Button } from './Button';

type EmptyStatePreset = 'default' | 'search' | 'trips' | 'destinations' | 'content';

interface EmptyStateProps {
  preset?: EmptyStatePreset;
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

const presetIcons: Record<EmptyStatePreset, React.ReactNode> = {
  default: <Inbox className="w-12 h-12" />,
  search: <Search className="w-12 h-12" />,
  trips: <Compass className="w-12 h-12" />,
  destinations: <MapPin className="w-12 h-12" />,
  content: <FileText className="w-12 h-12" />,
};

export function EmptyState({
  preset = 'default',
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
}: EmptyStateProps) {
  const displayIcon = icon || presetIcons[preset];

  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center text-center py-16 px-6',
        className
      )}
    >
      <div className="w-20 h-20 rounded-full bg-surface-100 flex items-center justify-center text-brand-muted/40 mb-5">
        {displayIcon}
      </div>
      <h3 className="text-heading-sm font-heading font-bold text-brand-navy mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-body-sm text-brand-muted max-w-sm mb-6">
          {description}
        </p>
      )}
      {actionLabel && (
        <Button
          variant="primary"
          size="sm"
          href={actionHref}
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
