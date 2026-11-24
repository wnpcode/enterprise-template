import type { ComponentProps } from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { cn } from "../../utils/cn";
import { ignoreTourPointer } from "../../utils/tourGuard";
import { useLocale } from "../../locale/LocaleProvider";
import { XIcon } from "../icons";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export type DialogContentProps = ComponentProps<typeof DialogPrimitive.Content>;

export function DialogContent({ className, children, onPointerDownOutside, ...props }: DialogContentProps) {
  const { close } = useLocale();
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="inset-0 fixed z-50 bg-overlay data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in motion-reduce:animate-none" />
      <DialogPrimitive.Content
        onPointerDownOutside={(e) => {
          onPointerDownOutside?.(e);
          ignoreTourPointer(e);
        }}
        className={cn(
          "max-w-lg p-6 fixed top-1/2 left-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2 rounded-md border border-border bg-surface text-surface-foreground shadow-md data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in motion-reduce:animate-none",
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="right-4 top-4 absolute rounded-sm text-muted-foreground outline-none hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
          <XIcon />
          <span className="sr-only">{close}</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DialogHeader({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("gap-1.5 flex flex-col", className)} {...props} />;
}

export function DialogFooter({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("gap-2 pt-4 flex justify-end", className)} {...props} />;
}

export function DialogTitle({ className, ...props }: ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title className={cn("text-lg font-semibold leading-none", className)} {...props} />;
}

export function DialogDescription({ className, ...props }: ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description className={cn("text-sm text-muted-foreground", className)} {...props} />;
}
