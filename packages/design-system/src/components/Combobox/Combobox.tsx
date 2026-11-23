import { useId, useState } from "react";
import { Command } from "cmdk";
import { Popover as PopoverPrimitive } from "radix-ui";
import { cn } from "../../utils/cn";
import { useLocale } from "../../locale/LocaleProvider";
import { CheckIcon, ChevronDownIcon } from "../icons";

export type ComboboxOption = { value: string; label: string; disabled?: boolean };

export type ComboboxProps = {
  options: ComboboxOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  invalid?: boolean;
  id?: string;
  className?: string;
};

export function Combobox({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder,
  searchPlaceholder,
  emptyText,
  disabled,
  invalid,
  id,
  className,
}: ComboboxProps) {
  const locale = useLocale();
  const placeholderText = placeholder ?? locale.select;
  const searchText = searchPlaceholder ?? locale.search;
  const emptyLabel = emptyText ?? locale.noResults;
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [inner, setInner] = useState(defaultValue);
  const current = value !== undefined ? value : inner;
  const selected = options.find((o) => o.value === current);

  function select(next: string) {
    if (value === undefined) setInner(next);
    onValueChange?.(next);
    setOpen(false);
  }

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          id={id}
          disabled={disabled}
          aria-invalid={invalid ? true : undefined}
          className={cn(
            "h-10 gap-2 px-3 text-sm flex w-full items-center justify-between rounded-md border border-input bg-surface text-foreground shadow-inset outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger aria-invalid:focus-visible:outline-danger",
            className,
          )}
        >
          <span className={cn("truncate", !selected && "text-muted-foreground")}>{selected ? selected.label : placeholderText}</span>
          <ChevronDownIcon className="text-muted-foreground" />
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          aria-label={searchText}
          className="p-0 z-50 w-[var(--radix-popover-trigger-width)] rounded-md border border-border bg-surface-elevated text-surface-foreground shadow-md data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in motion-reduce:animate-none"
        >
          <Command>
            <Command.Input
              placeholder={searchText}
              className="h-10 px-3 text-sm w-full border-b border-border bg-transparent outline-none placeholder:text-muted-foreground"
            />
            <Command.List id={listId} className="max-h-64 p-1 overflow-y-auto">
              <Command.Empty className="py-6 text-sm text-center text-muted-foreground">{emptyLabel}</Command.Empty>
              {options.map((opt) => (
                <Command.Item
                  key={opt.value}
                  value={opt.label}
                  disabled={opt.disabled}
                  onSelect={() => select(opt.value)}
                  className="gap-2 px-2 py-1.5 text-sm relative flex cursor-default items-center rounded-sm outline-none select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[selected=true]:bg-muted data-[selected=true]:text-foreground"
                >
                  {opt.label}
                  <CheckIcon className={cn("ml-auto", opt.value === current ? "opacity-100" : "opacity-0")} />
                </Command.Item>
              ))}
            </Command.List>
          </Command>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
