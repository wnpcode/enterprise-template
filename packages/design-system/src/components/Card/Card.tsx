import type { ComponentProps } from "react";
import { cn } from "../../utils/cn";

export function Card({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("rounded-lg border border-border bg-surface text-surface-foreground shadow-sm", className)} {...props} />;
}

export function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("gap-1.5 p-6 flex flex-col", className)} {...props} />;
}

export function CardTitle({ className, ...props }: ComponentProps<"h3">) {
  // eslint-disable-next-line jsx-a11y/heading-has-content -- content arrives via props.children
  return <h3 className={cn("text-lg font-semibold leading-none", className)} {...props} />;
}

export function CardDescription({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

export function CardContent({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}

export function CardFooter({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("p-6 pt-0 flex items-center", className)} {...props} />;
}
