import { useState, type ComponentProps } from "react";
import { cn } from "../../utils/cn";

export type SwitchProps = Omit<ComponentProps<"button">, "onChange"> & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  invalid?: boolean;
};

export function Switch({
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  invalid,
  className,
  onClick,
  ...props
}: SwitchProps) {
  const [internal, setInternal] = useState(defaultChecked);
  const checked = checkedProp ?? internal;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={cn(
        "h-6 w-11 inline-flex shrink-0 items-center rounded-full border-2 border-transparent bg-input shadow-inset aria-checked:bg-primary",
        "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "transition-colors duration-150",
        "aria-invalid:outline aria-invalid:outline-danger",
        className,
      )}
      {...props}
      aria-invalid={invalid ? true : props["aria-invalid"]}
      onClick={(event) => {
        const next = !checked;
        if (checkedProp === undefined) setInternal(next);
        onCheckedChange?.(next);
        onClick?.(event);
      }}
    >
      <span
        aria-hidden="true"
        className={cn(
          "size-5 block rounded-full bg-background shadow-sm transition-transform duration-150",
          checked ? "translate-x-5" : "translate-x-0",
        )}
      />
    </button>
  );
}
