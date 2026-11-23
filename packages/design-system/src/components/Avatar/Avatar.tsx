import type { ComponentProps } from "react";
import { Avatar as AvatarPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

const avatarVariants = cva("relative inline-flex shrink-0 overflow-hidden rounded-full bg-muted", {
  variants: { size: { sm: "size-8 text-xs", md: "size-10 text-sm", lg: "size-14 text-lg" } },
  defaultVariants: { size: "md" },
});

export type AvatarProps = Omit<ComponentProps<typeof AvatarPrimitive.Root>, "children"> &
  VariantProps<typeof avatarVariants> & {
    /** Nama orang; dipakai untuk inisial fallback dan `alt` gambar. */
    name: string;
    src?: string;
    /** Kosongkan (`""`) bila nama sudah tampil di sebelahnya agar tidak dibaca dua kali. */
    alt?: string;
  };

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function Avatar({ name, src, alt, size, className, ...props }: AvatarProps) {
  const label = alt ?? name;
  return (
    <AvatarPrimitive.Root className={cn(avatarVariants({ size }), className)} {...props}>
      {src && <AvatarPrimitive.Image src={src} alt={label} className="size-full object-cover" />}
      <AvatarPrimitive.Fallback
        delayMs={src ? 300 : undefined}
        role={label ? "img" : undefined}
        aria-label={label || undefined}
        aria-hidden={label ? undefined : true}
        className="font-medium flex size-full items-center justify-center text-muted-foreground"
      >
        {initials(name)}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}
