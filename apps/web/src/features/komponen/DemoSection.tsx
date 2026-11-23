import type { ReactNode } from "react";

export function DemoSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-base font-medium">{title}</h2>
      {children}
    </section>
  );
}
