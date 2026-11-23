import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../utils/cn";
import { useLocale } from "../../locale/LocaleProvider";

export function Table({ className, ...props }: ComponentProps<"table">) {
  return (
    <div className="relative w-full overflow-x-auto">
      <table className={cn("text-sm w-full caption-bottom", className)} {...props} />
    </div>
  );
}

export function TableHeader({ className, ...props }: ComponentProps<"thead">) {
  return <thead className={cn("[&_tr]:border-b", className)} {...props} />;
}

export function TableBody({ className, ...props }: ComponentProps<"tbody">) {
  return <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />;
}

export function TableFooter({ className, ...props }: ComponentProps<"tfoot">) {
  return <tfoot className={cn("font-medium border-t bg-muted/50", className)} {...props} />;
}

export function TableRow({ className, ...props }: ComponentProps<"tr">) {
  return (
    <tr
      className={cn("border-b border-border transition-colors duration-150 hover:bg-muted/50 data-[state=selected]:bg-muted", className)}
      {...props}
    />
  );
}

export function TableHead({ className, ...props }: ComponentProps<"th">) {
  return <th className={cn("h-10 px-3 font-medium text-left align-middle text-muted-foreground", className)} {...props} />;
}

export function TableCell({ className, ...props }: ComponentProps<"td">) {
  return <td className={cn("p-3 align-middle", className)} {...props} />;
}

export function TableCaption({ className, ...props }: ComponentProps<"caption">) {
  return <caption className={cn("mt-4 text-sm text-muted-foreground", className)} {...props} />;
}

export interface TableEmptyProps {
  colSpan: number;
  children?: ReactNode;
  className?: string;
}

export function TableEmpty({ colSpan, children, className }: TableEmptyProps) {
  const { noData } = useLocale();
  return (
    <tr>
      <td colSpan={colSpan} className={cn("h-24 text-center text-muted-foreground", className)}>
        {children ?? noData}
      </td>
    </tr>
  );
}
