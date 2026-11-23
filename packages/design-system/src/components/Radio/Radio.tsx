import type { ComponentProps } from "react";
import { cn } from "../../utils/cn";

// Validitas radio milik grupnya: pasang aria-invalid di <fieldset>/[role=radiogroup], bukan di tiap radio.
export type RadioProps = Omit<ComponentProps<"input">, "type">;

export function Radio({ className, ...props }: RadioProps) {
  return (
    <input
      type="radio"
      className={cn(
        "size-4 shrink-0 rounded-full accent-primary shadow-inset",
        "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
