import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../utils/cn";

export type EmptyStateProps = Omit<ComponentProps<"div">, "title"> & {
  title: ReactNode;
  description?: ReactNode;
  /** Ikon dekoratif; diberi `aria-hidden` oleh pemanggil. */
  icon?: ReactNode;
  /** Tombol atau tautan aksi utama. */
  action?: ReactNode;
};

export function EmptyState({ title, description, icon, action, className, ...props }: EmptyStateProps) {
  return (
    <div className={cn("px-4 py-10 flex flex-col items-center text-center", className)} {...props}>
      {icon && <div className="mb-3 [&>svg]:size-8 text-muted-foreground">{icon}</div>}
      <p className="font-medium text-foreground">{title}</p>
      {description && <p className="mt-1 max-w-prose text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
