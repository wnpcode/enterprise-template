import type React from "react";
import { cn } from "../../utils/cn";

export type LabelProps = React.ComponentProps<"label"> & {
  /** Penanda visual saja; atribut `required` tetap dipasang di input. */
  required?: boolean;
};

export function Label({ required, className, children, ...props }: LabelProps) {
  return (
    <label className={cn("text-sm font-medium leading-none text-foreground", className)} {...props}>
      {children}
      {required && (
        <span aria-hidden="true" className="text-danger">
          {" *"}
        </span>
      )}
    </label>
  );
}
