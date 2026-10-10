import React, { createContext, useContext, useState, useCallback } from 'react';
import { cn } from '../../lib/utils.js';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext({
  toast: () => {},
});

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ title, description, variant = 'default', duration = 4000 }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, title, description, variant }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex max-w-md w-full flex-col gap-2 pointer-events-none p-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              'pointer-events-auto flex items-start gap-3 rounded-lg border p-4 shadow-lg transition-all animate-in slide-in-from-bottom-5',
              t.variant === 'destructive' && 'border-destructive/60 bg-card text-destructive shadow-destructive/10',
              t.variant === 'success' && 'border-emerald-500/50 bg-card text-emerald-400 shadow-emerald-500/10',
              t.variant === 'warning' && 'border-amber-500/50 bg-card text-amber-300 shadow-amber-500/10',
              (!t.variant || t.variant === 'default') && 'border-border bg-card text-foreground shadow-black/20'
            )}
          >
            {t.variant === 'destructive' && <XCircle className="size-5 shrink-0 text-destructive mt-0.5" />}
            {t.variant === 'success' && <CheckCircle2 className="size-5 shrink-0 text-emerald-400 mt-0.5" />}
            {t.variant === 'warning' && <AlertTriangle className="size-5 shrink-0 text-amber-400 mt-0.5" />}
            {(!t.variant || t.variant === 'default') && <Info className="size-5 shrink-0 text-primary mt-0.5" />}

            <div className="flex-1 flex flex-col gap-0.5">
              {t.title && <p className="text-sm font-semibold">{t.title}</p>}
              {t.description && <p className="text-xs text-muted-foreground">{t.description}</p>}
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
