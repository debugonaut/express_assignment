import React from 'react';
import { cn } from '../../lib/utils.js';

export const Input = React.forwardRef(({ className, type, 'aria-invalid': ariaInvalid, ...props }, ref) => {
  return (
    <input
      type={type}
      aria-invalid={ariaInvalid}
      className={cn(
        'flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-foreground',
        ariaInvalid && 'border-destructive focus-visible:ring-destructive/40 text-destructive',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';
