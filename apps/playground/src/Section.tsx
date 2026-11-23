import type { ReactNode } from "react";
import { cn } from "@wnp_code/design-system";

type SectionProps = { id: string; title: string; description?: string; children: ReactNode };

export function Section({ id, title, description, children }: SectionProps) {
  return (
    <section id={id} className="space-y-6 py-10 first:pt-0 border-t border-border first:border-t-0">
      <header className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {description && <p className="max-w-prose text-sm text-muted-foreground">{description}</p>}
      </header>
      {children}
    </section>
  );
}

type DemoProps = { label: string; className?: string; children: ReactNode };

export function Demo({ label, className, children }: DemoProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</h3>
      <div className={cn("gap-3 flex flex-wrap items-center", className)}>{children}</div>
    </div>
  );
}
