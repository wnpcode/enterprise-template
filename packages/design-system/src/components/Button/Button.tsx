import type { ComponentProps, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";
import { Spinner } from "../Spinner";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 transition-colors duration-150",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary-hover shadow-raised active:shadow-inset",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary-hover shadow-raised active:shadow-inset",
        outline: "border border-border bg-transparent text-foreground hover:bg-muted shadow-raised active:shadow-inset",
        ghost: "bg-transparent text-foreground hover:bg-muted",
        danger: "bg-danger text-danger-foreground hover:bg-danger-hover shadow-raised active:shadow-inset",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps extends ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leading?: ReactNode;
  trailing?: ReactNode;
}

const slot = (node: ReactNode) => (
  <span aria-hidden="true" className="inline-flex shrink-0">
    {node}
  </span>
);

export function Button({
  variant,
  size,
  loading = false,
  leading,
  trailing,
  type = "button",
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {loading ? <Spinner size="sm" aria-hidden="true" /> : leading ? slot(leading) : null}
      {children}
      {trailing ? slot(trailing) : null}
    </button>
  );
}
