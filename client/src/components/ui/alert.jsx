import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils.js';

const alertVariants = cva(
  'relative w-full rounded-lg border p-4 text-sm [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground',
  {
    variants: {
      variant: {
        default: 'bg-card text-foreground border-border',
        destructive: 'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive bg-destructive/10',
        success: 'border-emerald-500/40 text-emerald-300 dark:border-emerald-500/40 [&>svg]:text-emerald-400 bg-emerald-950/30',
        warning: 'border-amber-500/40 text-amber-300 dark:border-amber-500/40 [&>svg]:text-amber-400 bg-amber-950/30',
        info: 'border-sky-500/40 text-sky-300 dark:border-sky-500/40 [&>svg]:text-sky-400 bg-sky-950/30',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export const Alert = React.forwardRef(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = 'Alert';

export const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn('mb-1 font-medium leading-none tracking-tight', className)}
    {...props}
  />
));
AlertTitle.displayName = 'AlertTitle';

export const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm [&_p]:leading-relaxed', className)}
    {...props}
  />
));
AlertDescription.displayName = 'AlertDescription';
