import { useDeferredValue, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  Button,
  createColumnHelper,
  DataTable,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  EmptyState,
  Input,
  PageHeader,
  type SortingState,
} from "@enterprise/design-system";
import { formatTanggal } from "../../shared/format";
import { fetchSiswa, siswaKeys, type Siswa, type SiswaListParams } from "./api";
import { HapusSiswaDialog } from "./HapusSiswaDialog";
import { SiswaFormSheet } from "./SiswaFormSheet";
import { StatusBadge } from "./StatusBadge";

const PAGE_SIZE = 5;
const col = createColumnHelper<Siswa>();

export function SiswaPage() {
  const { t, i18n } = useTranslation();
  // filter disimpan di URL agar tab "halaman yang dibuka" bisa memulihkannya
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const page = Math.max(1, Number.parseInt(searchParams.get("page") ?? "", 10) || 1);
  const sortId = searchParams.get("sort");
  const sorting: SortingState = sortId ? [{ id: sortId, desc: searchParams.get("order") === "desc" }] : [];
  const setFilter = (patch: Record<string, string | undefined>) =>
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        for (const [k, v] of Object.entries(patch)) {
          if (v) next.set(k, v);
          else next.delete(k);
        }
        return next;
      },
      { replace: true },
    );
  // sheet ubah dan dialog hapus dikendalikan dari sini: item menu baris menutup menu (dan ikut membongkar isinya) saat dipilih
  const [editing, setEditing] = useState<Siswa | null>(null);
  const [deleting, setDeleting] = useState<Siswa | null>(null);
  const q = useDeferredValue(query.trim());
  const params: SiswaListParams = {
    q,
    page,
    size: PAGE_SIZE,
    sort: sorting[0]?.id as keyof Siswa | undefined,
    order: sorting[0] ? (sorting[0].desc ? "desc" : "asc") : undefined,
  };
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: siswaKeys.list(params),
    queryFn: () => fetchSiswa(params),
    placeholderData: keepPreviousData,
  });
  const columns = useMemo(
    () => [
      col.accessor("nama", { header: t("common.columns.nama") }),
      col.accessor("kelas", { header: t("common.columns.kelas") }),
      col.accessor("status", {
        header: t("common.columns.status"),
        enableSorting: false,
        cell: (c) => <StatusBadge status={c.getValue()} />,
      }),
      col.accessor("terdaftar", { header: t("common.columns.terdaftar"), cell: (c) => formatTanggal(c.getValue()) }),
      col.display({
        id: "aksi",
        header: t("siswa.actions"),
        cell: ({ row: { original: s } }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="min-h-11" aria-label={t("siswa.rowActions", { nama: s.nama })}>
                {t("siswa.actions")}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setEditing(s)}>{t("siswa.edit")}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem destructive onSelect={() => setDeleting(s)}>
                {t("siswa.delete.confirm")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps -- kolom dibangun ulang saat bahasa berganti
    [t, i18n.language],
  );
  const pageCount = Math.ceil((data?.total ?? 0) / PAGE_SIZE);
  const tambah = <SiswaFormSheet trigger={<Button className="min-h-11">{t("siswa.add")}</Button>} />;

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("siswa.title")}
        description={t("siswa.description")}
        actions={
          <>
            <Input
              type="search"
              aria-label={t("siswa.searchLabel")}
              placeholder={t("siswa.searchPlaceholder")}
              className="min-h-11"
              value={query}
              onChange={(e) => {
                setFilter({ q: e.target.value, page: undefined });
              }}
            />
            {tambah}
          </>
        }
      />
      {isError ? (
        <div className="space-y-3">
          <p role="alert">{t("siswa.loadError")}</p>
          <Button variant="outline" className="min-h-11" onClick={() => refetch()}>
            {t("common.retry")}
          </Button>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={data?.items ?? []}
          loading={isPending}
          skeletonRows={PAGE_SIZE}
          sorting={sorting}
          onSortingChange={(next) => {
            const [s] = typeof next === "function" ? next(sorting) : next;
            setFilter({ sort: s?.id, order: s ? (s.desc ? "desc" : "asc") : undefined, page: undefined });
          }}
          manualSorting
          page={page}
          pageCount={pageCount}
          onPageChange={(p) => setFilter({ page: p > 1 ? String(p) : undefined })}
          empty={
            q ? (
              t("siswa.emptySearch", { q })
            ) : (
              <EmptyState title={t("siswa.emptyTitle")} description={t("siswa.emptyText")} action={tambah} />
            )
          }
        />
      )}
      {editing && <SiswaFormSheet key={editing.id} siswa={editing} open onOpenChange={(open) => !open && setEditing(null)} />}
      <HapusSiswaDialog
        siswa={deleting}
        onClose={() => setDeleting(null)}
        // baris terakhir di halaman terakhir terhapus: mundur satu halaman agar tidak menampilkan halaman kosong
        onDeleted={() => data?.items.length === 1 && page > 1 && setFilter({ page: page > 2 ? String(page - 1) : undefined })}
      />
    </div>
  );
}
