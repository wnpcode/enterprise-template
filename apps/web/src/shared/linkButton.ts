import { cn } from "@wnpcode/design-system";

const base =
  "inline-flex min-h-11 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

const variants = {
  primary: "bg-primary text-primary-foreground hover:bg-primary-hover shadow-raised active:shadow-inset",
  outline: "border border-border bg-surface hover:bg-muted shadow-raised active:shadow-inset",
};

// kelas untuk <Link> yang tampil seperti Button package; Button tidak punya asChild
export function linkButton(variant: keyof typeof variants = "primary", className?: string) {
  return cn(base, variants[variant], className);
}
