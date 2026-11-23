import { cn } from "@enterprise/design-system";

// sumber bentuk: brand/mark.svg; warna dari currentColor
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true" className={cn("size-6 shrink-0 text-primary", className)}>
      <rect x="6" y="6" width="14" height="4" rx="1" />
      <rect x="6" y="14" width="10" height="4" rx="1" />
      <rect x="6" y="22" width="20" height="4" rx="1" />
    </svg>
  );
}
