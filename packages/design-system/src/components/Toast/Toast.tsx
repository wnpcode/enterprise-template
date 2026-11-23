import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Toast as ToastPrimitive } from "radix-ui";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn";
import { useLocale } from "../../locale/LocaleProvider";
import { XIcon } from "../icons";

export type ToastVariant = "default" | "success" | "danger";

export interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastItem extends ToastOptions {
  id: string;
}

interface ToastContextValue {
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const toastVariants = cva(
  "group relative flex w-full items-start gap-3 rounded-md border p-4 shadow-md data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out motion-reduce:animate-none",
  {
    variants: {
      variant: {
        default: "border-border bg-surface-elevated text-surface-foreground",
        success: "border-success-subtle bg-success-subtle text-success-subtle-fg",
        danger: "border-danger-subtle bg-danger-subtle text-danger-subtle-fg",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface ToastProviderProps {
  children: ReactNode;
  duration?: number;
}

export function ToastProvider({ children, duration }: ToastProviderProps) {
  const { close } = useLocale();
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counter = useRef(0);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((options: ToastOptions) => {
    const id = String(++counter.current);
    setToasts((prev) => [...prev, { ...options, id }]);
    return id;
  }, []);

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      <ToastPrimitive.Provider duration={duration}>
        {children}
        {toasts.map((t) => (
          <ToastPrimitive.Root
            key={t.id}
            duration={t.duration}
            onOpenChange={(open) => !open && dismiss(t.id)}
            className={toastVariants({ variant: t.variant })}
          >
            <div className="gap-1 grid flex-1">
              <ToastPrimitive.Title className="text-sm font-semibold">{t.title}</ToastPrimitive.Title>
              {t.description ? (
                <ToastPrimitive.Description className="text-sm opacity-90">{t.description}</ToastPrimitive.Description>
              ) : null}
            </div>
            <ToastPrimitive.Close
              className={cn(
                "rounded-sm opacity-70 outline-none hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              )}
            >
              <XIcon />
              <span className="sr-only">{close}</span>
            </ToastPrimitive.Close>
          </ToastPrimitive.Root>
        ))}
        <ToastPrimitive.Viewport className="bottom-0 right-0 max-w-sm gap-2 p-4 fixed z-50 flex max-h-screen w-full flex-col outline-none" />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
