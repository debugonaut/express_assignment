import React, { createContext, useContext, useState } from 'react';
import { cn } from '../../lib/utils.js';

const TabsContext = createContext();

export function Tabs({ defaultValue, value, onValueChange, className, children, ...props }) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const activeValue = value !== undefined ? value : internalValue;

  const handleValueChange = (val) => {
    if (value === undefined) setInternalValue(val);
    if (onValueChange) onValueChange(val);
  };

  return (
    <TabsContext.Provider value={{ activeValue, handleValueChange }}>
      <div className={cn('flex flex-col gap-4', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, children, ...props }) {
  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex h-11 items-center justify-start rounded-lg bg-muted p-1 text-muted-foreground gap-1 border border-border/40',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({ value, className, children, ...props }) {
  const { activeValue, handleValueChange } = useContext(TabsContext);
  const isActive = activeValue === value;

  return (
    <button
      role="tab"
      type="button"
      aria-selected={isActive}
      onClick={() => handleValueChange(value)}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3.5 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
        isActive
          ? 'bg-card text-foreground shadow-sm font-semibold border border-border/50'
          : 'hover:text-foreground hover:bg-card/40',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, className, children, ...props }) {
  const { activeValue } = useContext(TabsContext);
  if (activeValue !== value) return null;

  return (
    <div
      role="tabpanel"
      className={cn('focus-visible:outline-none', className)}
      {...props}
    >
      {children}
    </div>
  );
}
