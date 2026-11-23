import type { ComponentProps } from "react";
import { cn } from "../../utils/cn";

export type CheckboxProps = Omit<ComponentProps<"input">, "type"> & {
  invalid?: boolean;
};

export function Checkbox({ className, invalid, ...props }: CheckboxProps) {
  return (
    <input
      type="checkbox"
      className={cn(
        "size-4 shrink-0 rounded-sm accent-primary shadow-inset",
        "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:outline aria-invalid:outline-danger",
        className,
      )}
      {...props}
      aria-invalid={invalid ? true : props["aria-invalid"]}
    />
  );
}
