import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";
import { useLocale } from "../../locale/LocaleProvider";

const spinnerVariants = cva("animate-spin motion-reduce:[animation-duration:1.5s]", {
  variants: { size: { sm: "size-4", md: "size-5", lg: "size-6" } },
  defaultVariants: { size: "md" },
});

export interface SpinnerProps extends Omit<ComponentProps<"svg">, "size">, VariantProps<typeof spinnerVariants> {
  /** Teks aksesibel untuk pembaca layar. */
  label?: string;
}

export function Spinner({ size, label, className, ...props }: SpinnerProps) {
  const { loading } = useLocale();
  const text = label ?? loading;
  return (
    <svg role="status" aria-label={text} viewBox="0 0 24 24" fill="none" className={cn(spinnerVariants({ size }), className)} {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
