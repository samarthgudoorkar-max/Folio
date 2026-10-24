import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error, label, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">
            {label}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          ref={ref}
          className={cn(
            'flex h-10 w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted transition-colors',
            'focus:border-primary focus:outline-none focus:ring-2 focus:ring-focus-ring/20',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-danger focus:border-danger focus:ring-danger/20',
            className
          )}
          {...props}
        />
        {helperText && !error && (
          <p className="text-xs text-text-muted">{helperText}</p>
        )}
        {error && (
          <p className="text-xs text-danger font-medium">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
