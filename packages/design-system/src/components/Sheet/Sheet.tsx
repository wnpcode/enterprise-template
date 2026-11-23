import type { ComponentProps } from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";
import { useLocale } from "../../locale/LocaleProvider";
import { XIcon } from "../icons";

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;

const sheetVariants = cva(
  "fixed z-50 flex flex-col gap-4 overflow-y-auto border-border bg-surface p-6 text-surface-foreground shadow-md data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out motion-reduce:animate-none",
  {
    variants: {
      side: {
        right: "inset-y-0 right-0 h-dvh w-full max-w-md border-l",
        left: "inset-y-0 left-0 h-dvh w-full max-w-md border-r",
        bottom: "inset-x-0 bottom-0 max-h-[85dvh] rounded-t-md border-t",
      },
    },
    defaultVariants: { side: "right" },
  },
);

export type SheetContentProps = ComponentProps<typeof DialogPrimitive.Content> & VariantProps<typeof sheetVariants>;

export function SheetContent({ side, className, children, ...props }: SheetContentProps) {
  const { close } = useLocale();
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="inset-0 fixed z-50 bg-overlay data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in motion-reduce:animate-none" />
      <DialogPrimitive.Content className={cn(sheetVariants({ side }), className)} {...props}>
        {children}
        <DialogPrimitive.Close className="right-4 top-4 absolute rounded-sm text-muted-foreground outline-none hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
          <XIcon />
          <span className="sr-only">{close}</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function SheetHeader({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("gap-1.5 pr-8 flex flex-col", className)} {...props} />;
}

export function SheetFooter({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("gap-2 pt-4 mt-auto flex justify-end", className)} {...props} />;
}

export function SheetTitle({ className, ...props }: ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title className={cn("text-lg font-semibold leading-none", className)} {...props} />;
}

export function SheetDescription({ className, ...props }: ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description className={cn("text-sm text-muted-foreground", className)} {...props} />;
}
