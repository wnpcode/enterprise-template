import type React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

const inputVariants = cva(
  "flex w-full rounded-md border border-input bg-surface shadow-inset text-foreground placeholder:text-muted-foreground outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-150 aria-invalid:border-danger aria-invalid:focus-visible:outline-danger",
  {
    variants: {
      size: {
        sm: "h-8 px-2.5 text-sm",
        md: "h-10 px-3 text-sm",
        lg: "h-12 px-4 text-base",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export type InputProps = Omit<React.ComponentProps<"input">, "size"> &
  VariantProps<typeof inputVariants> & {
    invalid?: boolean;
  };

export function Input({ size, invalid, className, ...props }: InputProps) {
  return <input className={cn(inputVariants({ size }), className)} {...props} aria-invalid={invalid ? true : props["aria-invalid"]} />;
}
