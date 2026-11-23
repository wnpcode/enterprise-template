import type React from "react";
import { cn } from "../../utils/cn";

export type TextareaProps = React.ComponentProps<"textarea"> & {
  invalid?: boolean;
};

export function Textarea({ invalid, className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "min-h-20 px-3 py-2 text-sm flex w-full rounded-md border border-input bg-surface text-foreground shadow-inset transition-colors duration-150 outline-none placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger aria-invalid:focus-visible:outline-danger",
        className,
      )}
      {...props}
      aria-invalid={invalid ? true : props["aria-invalid"]}
    />
  );
}
