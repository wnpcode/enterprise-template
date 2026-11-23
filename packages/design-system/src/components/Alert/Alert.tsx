import type { ComponentProps, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

const alertVariants = cva("rounded-md border px-4 py-3 text-sm", {
  variants: {
    variant: {
      info: "border-info/30 bg-info-subtle text-info-subtle-fg",
      success: "border-success/30 bg-success-subtle text-success-subtle-fg",
      warning: "border-warning/30 bg-warning-subtle text-warning-subtle-fg",
      danger: "border-danger/30 bg-danger-subtle text-danger-subtle-fg",
    },
  },
  defaultVariants: { variant: "info" },
});

export interface AlertProps extends Omit<ComponentProps<"div">, "title">, VariantProps<typeof alertVariants> {
  title?: ReactNode;
  /** true untuk pesan yang harus segera dibacakan pembaca layar (role="alert"); default role="status". */
  live?: boolean;
}

export function Alert({ variant, title, live = false, className, children, ...props }: AlertProps) {
  return (
    <div role={live ? "alert" : "status"} className={cn(alertVariants({ variant }), className)} {...props}>
      {title && <p className="font-medium">{title}</p>}
      {children && <div className={cn(title && "mt-1")}>{children}</div>}
    </div>
  );
}
