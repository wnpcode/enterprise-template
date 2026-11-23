import type { ComponentProps } from "react";
import { Slot } from "radix-ui";
import { cn } from "../../utils/cn";
import { ChevronRightIcon } from "../icons";

export function Breadcrumb({ className, ...props }: ComponentProps<"nav">) {
  return <nav aria-label="Breadcrumb" className={className} {...props} />;
}

export function BreadcrumbList({ className, ...props }: ComponentProps<"ol">) {
  return <ol className={cn("gap-1.5 text-sm flex flex-wrap items-center text-muted-foreground", className)} {...props} />;
}

export function BreadcrumbItem({ className, ...props }: ComponentProps<"li">) {
  return <li className={cn("gap-1.5 inline-flex items-center", className)} {...props} />;
}

export type BreadcrumbLinkProps = ComponentProps<"a"> & {
  /** true untuk membungkus `<Link>` router: kelas digabung ke anak, bukan `<a>` baru. */
  asChild?: boolean;
};

export function BreadcrumbLink({ asChild, className, ...props }: BreadcrumbLinkProps) {
  const Comp = asChild ? Slot.Root : "a";
  return (
    <Comp
      className={cn(
        "rounded-sm underline-offset-4 transition-colors outline-none hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className,
      )}
      {...props}
    />
  );
}

export function BreadcrumbPage({ className, ...props }: ComponentProps<"span">) {
  return <span role="link" aria-disabled="true" aria-current="page" className={cn("font-medium text-foreground", className)} {...props} />;
}

export function BreadcrumbSeparator({ className, children, ...props }: ComponentProps<"li">) {
  return (
    <li role="presentation" aria-hidden="true" className={cn("[&>svg]:size-3.5", className)} {...props}>
      {children ?? <ChevronRightIcon />}
    </li>
  );
}
