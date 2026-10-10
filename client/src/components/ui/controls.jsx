import React from 'react';
import { cn } from '../../lib/utils.js';

export const Select = React.forwardRef(({ className, 'aria-invalid': ariaInvalid, children, ...props }, ref) => {
  return (
    <div className="relative">
      <select
        ref={ref}
        aria-invalid={ariaInvalid}
        className={cn(
          'flex h-9 w-full appearance-none rounded-md border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-foreground pr-8',
          ariaInvalid && 'border-destructive focus-visible:ring-destructive/40 text-destructive',
          className
        )}
        {...props}
      >
        {children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
        <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
});
Select.displayName = 'Select';

export const Textarea = React.forwardRef(({ className, 'aria-invalid': ariaInvalid, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      aria-invalid={ariaInvalid}
      className={cn(
        'flex min-h-[80px] w-full rounded-md border border-input bg-card px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-foreground',
        ariaInvalid && 'border-destructive focus-visible:ring-destructive/40 text-destructive',
        className
      )}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';

export function Separator({ className, orientation = 'horizontal', ...props }) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        'shrink-0 bg-border',
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
        className
      )}
      {...props}
    />
  );
}
