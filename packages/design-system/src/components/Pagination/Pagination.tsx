import type { ComponentProps } from "react";
import { cn } from "../../utils/cn";
import { useLocale } from "../../locale/LocaleProvider";
import { Button } from "../Button";

export interface PaginationProps extends Omit<ComponentProps<"nav">, "onChange"> {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  label?: string;
}

export function getPaginationRange(page: number, pageCount: number, siblingCount = 1): (number | "ellipsis")[] {
  if (pageCount < 1) return [];
  // elipsis tidak boleh menggantikan hanya satu-dua halaman: kalau semuanya muat, tampilkan semua
  if (pageCount <= 2 * siblingCount + 5) return Array.from({ length: pageCount }, (_, i) => i + 1);
  const shown = new Set([1, pageCount]);
  for (let n = page - siblingCount; n <= page + siblingCount; n++) {
    if (n >= 1 && n <= pageCount) shown.add(n);
  }
  const sorted = [...shown].sort((a, b) => a - b);
  const range: (number | "ellipsis")[] = [];
  sorted.forEach((n, i) => {
    const gap = i === 0 ? 1 : n - sorted[i - 1];
    if (gap === 2) range.push(n - 1);
    else if (gap > 2) range.push("ellipsis");
    range.push(n);
  });
  return range;
}

export function Pagination({ page, pageCount, onPageChange, siblingCount = 1, label, className, ...props }: PaginationProps) {
  const { pagination: t } = useLocale();
  if (pageCount < 1) return null;
  return (
    <nav aria-label={label ?? t.nav} className={cn(className)} {...props}>
      <ul className="gap-1 flex flex-wrap items-center">
        <li>
          <Button
            variant="ghost"
            size="sm"
            className="min-h-11"
            aria-label={t.previousLabel}
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            {t.previous}
          </Button>
        </li>
        {getPaginationRange(page, pageCount, siblingCount).map((item, i) =>
          item === "ellipsis" ? (
            <li key={`ellipsis-${i}`} aria-hidden="true" className="px-2 text-muted-foreground">
              …
            </li>
          ) : (
            <li key={item}>
              <Button
                variant={item === page ? "outline" : "ghost"}
                size="sm"
                className="min-h-11 min-w-11"
                aria-label={t.page(item)}
                aria-current={item === page ? "page" : undefined}
                onClick={() => onPageChange(item)}
              >
                {item}
              </Button>
            </li>
          ),
        )}
        <li>
          <Button
            variant="ghost"
            size="sm"
            className="min-h-11"
            aria-label={t.nextLabel}
            disabled={page >= pageCount}
            onClick={() => onPageChange(page + 1)}
          >
            {t.next}
          </Button>
        </li>
      </ul>
    </nav>
  );
}
