import React from 'react';
import { cn } from '../../lib/utils.js';

export function InputGroup({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'relative flex w-full items-center rounded-md border border-input bg-card shadow-sm transition-colors focus-within:ring-1 focus-within:ring-ring focus-within:border-ring overflow-hidden',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export const InputGroupInput = React.forwardRef(
  ({ className, 'aria-invalid': ariaInvalid, ...props }, ref) => {
    return (
      <input
        ref={ref}
        aria-invalid={ariaInvalid}
        className={cn(
          'flex h-9 w-full bg-transparent px-3 py-1 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
          ariaInvalid && 'text-destructive',
          className
        )}
        {...props}
      />
    );
  }
);
InputGroupInput.displayName = 'InputGroupInput';

export function InputGroupAddon({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center px-3 text-sm text-muted-foreground select-none shrink-0',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
