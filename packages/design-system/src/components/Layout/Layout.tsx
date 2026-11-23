import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../utils/cn";

const containerVariants = cva("mx-auto w-full px-4 sm:px-6", {
  variants: {
    size: { sm: "max-w-2xl", md: "max-w-4xl", lg: "max-w-6xl", full: "max-w-none" },
  },
  defaultVariants: { size: "lg" },
});

export type ContainerProps = ComponentProps<"div"> & VariantProps<typeof containerVariants>;

export function Container({ size, className, ...props }: ContainerProps) {
  return <div className={cn(containerVariants({ size }), className)} {...props} />;
}

const stackVariants = cva("flex", {
  variants: {
    direction: { row: "flex-row", column: "flex-col" },
    gap: { 1: "gap-1", 2: "gap-2", 3: "gap-3", 4: "gap-4", 6: "gap-6", 8: "gap-8" },
    align: { start: "items-start", center: "items-center", end: "items-end", stretch: "items-stretch" },
    justify: { start: "justify-start", center: "justify-center", end: "justify-end", between: "justify-between" },
    wrap: { true: "flex-wrap", false: "" },
  },
  defaultVariants: { direction: "column", gap: 4, wrap: false },
});

export type StackProps = ComponentProps<"div"> & VariantProps<typeof stackVariants>;

export function Stack({ direction, gap, align, justify, wrap, className, ...props }: StackProps) {
  return <div className={cn(stackVariants({ direction, gap, align, justify, wrap }), className)} {...props} />;
}

export type PageHeaderProps = Omit<ComponentProps<"header">, "title"> & {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  /** Biasanya `<Breadcrumb>`; tampil di atas judul. */
  breadcrumb?: ReactNode;
};

export function PageHeader({ title, description, actions, breadcrumb, className, ...props }: PageHeaderProps) {
  return (
    <header
      className={cn("gap-4 pb-6 sm:flex-row sm:items-start sm:justify-between flex flex-col border-b border-border", className)}
      {...props}
    >
      <div className="space-y-1">
        {breadcrumb && <div className="mb-2">{breadcrumb}</div>}
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="gap-2 flex shrink-0 items-center">{actions}</div>}
    </header>
  );
}
