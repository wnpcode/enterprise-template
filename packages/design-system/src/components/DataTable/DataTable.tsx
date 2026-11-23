import { useEffect, useRef, type ComponentProps, type ReactNode } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type OnChangeFn,
  type RowSelectionState,
  type SortingState,
} from "@tanstack/react-table";
import { cn } from "../../utils/cn";
import { useLocale } from "../../locale/LocaleProvider";
import { Checkbox } from "../Checkbox";
import { Pagination } from "../Pagination";
import { Skeleton } from "../Skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../Table";
import { ChevronDownIcon } from "../icons";

export type DataTableLabels = {
  selectAll: string;
  selectRow: string;
  empty: ReactNode;
  sort: (column: string) => string;
};

export type DataTableProps<T> = {
  // any sesuai dokumentasi TanStack: tiap kolom punya tipe nilai sendiri (string, enum, Date)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<T, any>[];
  data: T[];
  /** Baris Skeleton menggantikan data. */
  loading?: boolean;
  skeletonRows?: number;
  /** Ditampilkan saat data kosong dan tidak loading; default teks `labels.empty`. */
  empty?: ReactNode;
  /** Sorting terkontrol. Tanpa `manualSorting`, data diurutkan di klien. */
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  manualSorting?: boolean;
  /** Kolom checkbox ditambahkan di depan. */
  enableRowSelection?: boolean;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  getRowId?: (row: T, index: number) => string;
  /** Pagination di bawah tabel; tampil bila `pageCount` dan `onPageChange` ada. */
  page?: number;
  pageCount?: number;
  onPageChange?: (page: number) => void;
  labels?: Partial<DataTableLabels>;
  caption?: ReactNode;
  className?: string;
};

function SelectCheckbox({
  checked,
  indeterminate,
  ...props
}: { checked: boolean; indeterminate?: boolean } & Omit<ComponentProps<typeof Checkbox>, "checked">) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = !!indeterminate && !checked;
  }, [indeterminate, checked]);
  return <Checkbox ref={ref} checked={checked} {...props} />;
}

export function DataTable<T>({
  columns,
  data,
  loading = false,
  skeletonRows = 5,
  empty,
  sorting,
  onSortingChange,
  manualSorting = false,
  enableRowSelection = false,
  rowSelection,
  onRowSelectionChange,
  getRowId,
  page,
  pageCount,
  onPageChange,
  labels,
  caption,
  className,
}: DataTableProps<T>) {
  const locale = useLocale();
  const t: DataTableLabels = { ...locale.dataTable, empty: locale.noData, ...labels };
  const table = useReactTable({
    data,
    columns,
    getRowId,
    state: { ...(sorting && { sorting }), ...(rowSelection && { rowSelection }) },
    onSortingChange,
    onRowSelectionChange,
    manualSorting,
    enableRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: manualSorting ? undefined : getSortedRowModel(),
  });
  const rows = table.getRowModel().rows;
  const colSpan = columns.length + (enableRowSelection ? 1 : 0);

  return (
    <div aria-busy={loading || undefined} className={cn("space-y-4", className)}>
      <Table>
        {caption && <caption className="mt-4 text-sm caption-bottom text-muted-foreground">{caption}</caption>}
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {enableRowSelection && (
                <TableHead className="w-10">
                  <SelectCheckbox
                    aria-label={t.selectAll}
                    checked={table.getIsAllRowsSelected()}
                    indeterminate={table.getIsSomeRowsSelected()}
                    disabled={loading || rows.length === 0}
                    onChange={table.getToggleAllRowsSelectedHandler()}
                  />
                </TableHead>
              )}
              {hg.headers.map((header) => {
                const sortable = header.column.getCanSort();
                const dir = header.column.getIsSorted();
                const label = typeof header.column.columnDef.header === "string" ? header.column.columnDef.header : header.column.id;
                return (
                  <TableHead
                    key={header.id}
                    aria-sort={dir === "asc" ? "ascending" : dir === "desc" ? "descending" : sortable ? "none" : undefined}
                    style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                  >
                    {header.isPlaceholder ? null : sortable ? (
                      <button
                        type="button"
                        aria-label={t.sort(label)}
                        onClick={header.column.getToggleSortingHandler()}
                        className="-mx-2 min-h-11 gap-1 px-2 font-medium inline-flex items-center rounded-md outline-none hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        <ChevronDownIcon
                          className={cn("transition-transform duration-150", dir === "asc" && "rotate-180", !dir && "opacity-0")}
                        />
                      </button>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: skeletonRows }, (_, i) => (
              <TableRow key={i}>
                {Array.from({ length: colSpan }, (_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-5 min-w-10 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={colSpan} className="text-center text-muted-foreground">
                {typeof (empty ?? t.empty) === "string" ? (
                  <div className="h-24 content-center">{empty ?? t.empty}</div>
                ) : (
                  (empty ?? t.empty)
                )}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
                {enableRowSelection && (
                  <TableCell>
                    <Checkbox
                      aria-label={t.selectRow}
                      checked={row.getIsSelected()}
                      disabled={!row.getCanSelect()}
                      onChange={row.getToggleSelectedHandler()}
                    />
                  </TableCell>
                )}
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {!loading && page !== undefined && pageCount !== undefined && onPageChange && (
        <Pagination page={page} pageCount={pageCount} onPageChange={onPageChange} />
      )}
    </div>
  );
}
