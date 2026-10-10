import React from 'react';
import { cn } from '../../lib/utils.js';

export function FieldGroup({ className, children, ...props }) {
  return (
    <div className={cn('flex flex-col gap-4', className)} {...props}>
      {children}
    </div>
  );
}

export function Field({ className, 'data-invalid': isInvalid, children, ...props }) {
  return (
    <div
      data-invalid={isInvalid ? true : undefined}
      className={cn(
        'group flex flex-col gap-1.5 transition-colors',
        isInvalid && 'data-[invalid=true]:text-destructive',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function FieldLabel({ className, htmlFor, required, children, ...props }) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        'text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1',
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-destructive font-bold">*</span>}
    </label>
  );
}

export function FieldDescription({ className, children, ...props }) {
  return (
    <p
      className={cn('text-[13px] text-muted-foreground', className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function FieldError({ className, children, ...props }) {
  if (!children) return null;
  return (
    <p
      role="alert"
      className={cn('text-xs font-medium text-destructive mt-0.5 flex items-center gap-1', className)}
      {...props}
    >
      <span className="inline-block size-1.5 rounded-full bg-destructive" />
      {children}
    </p>
  );
}
