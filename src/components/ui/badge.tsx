import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'primary' | 'outline' | 'slate';
}

export function Badge({
  className,
  variant = 'default',
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default: 'bg-slate-100 text-text-secondary border-slate-200',
    success: 'bg-success-soft text-success border-green-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    primary: 'bg-primary-soft text-primary border-indigo-200',
    outline: 'bg-transparent text-text-secondary border-border-strong',
    slate: 'bg-slate-800 text-white border-transparent',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-tight',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
