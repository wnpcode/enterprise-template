import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  createColumnHelper,
  DataTable,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  useToast,
  type SortingState,
} from "@wnp_code/design-system";
import { formatTanggal } from "../../shared/format";
import { linkButton } from "../../shared/linkButton";
import { siswaKeys, StatusBadge, SiswaFormSheet, updateSiswaStatus, type Siswa } from "../siswa";

const PAGE_SIZE = 5;
const col = createColumnHelper<Siswa>();

export function PendaftaranTable({ siswa }: { siswa: Siswa[] }) {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<SortingState>([]);

  const ubah = useMutation({
    mutationFn: ({ id, status }: { id: number; status: "Aktif" | "Ditolak" }) => updateSiswaStatus(id, status),
    onSuccess: (s) => {
      queryClient.invalidateQueries({ queryKey: siswaKeys.all });
      toast({
        title: t(s.status === "Aktif" ? "dashboard.table.approved" : "dashboard.table.rejected"),
        description: s.nama,
        variant: s.status === "Aktif" ? "success" : "default",
      });
    },
    onError: () => toast({ title: t("dashboard.table.updateError"), variant: "danger" }),
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
        header: t("dashboard.table.actions"),
        cell: ({ row: { original: s } }) =>
          s.status === "Menunggu" ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="min-h-11" aria-label={t("dashboard.table.reviewFor", { nama: s.nama })}>
                  {t("dashboard.table.review")}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{s.nama}</DropdownMenuLabel>
                <DropdownMenuItem disabled={ubah.isPending} onSelect={() => ubah.mutate({ id: s.id, status: "Aktif" })}>
                  {t("dashboard.table.approve")}
                </DropdownMenuItem>
                <DropdownMenuItem destructive disabled={ubah.isPending} onSelect={() => ubah.mutate({ id: s.id, status: "Ditolak" })}>
                  {t("dashboard.table.reject")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null,
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps -- kolom dibangun ulang saat bahasa berganti; ubah.mutate stabil
    [t, i18n.language, ubah.isPending],
  );

  // yang menunggu verifikasi tampil lebih dulu, lalu urutan pilihan pengguna; halaman dipotong di sini agar sorting berlaku lintas halaman
  const rows = useMemo(() => {
    const sorted = [...siswa].sort((a, b) => Number(b.status === "Menunggu") - Number(a.status === "Menunggu"));
    const s = sorting[0];
    if (s) {
      const key = s.id as keyof Siswa;
      const dir = s.desc ? -1 : 1;
      sorted.sort((a, b) => (a[key] < b[key] ? -dir : a[key] > b[key] ? dir : 0));
    }
    return sorted;
  }, [siswa, sorting]);
  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);

  return (
    <section aria-labelledby="dash-table" className="space-y-4">
      <div className="gap-3 flex flex-wrap items-center justify-between">
        <h2 id="dash-table" className="text-lg font-semibold">
          {t("dashboard.table.title")}
        </h2>
        <div className="gap-3 flex flex-wrap">
          <SiswaFormSheet trigger={<Button className="min-h-11">{t("siswa.add")}</Button>} />
          <Link to="/app/siswa" className={linkButton("outline")}>
            {t("dashboard.seeAll")}
          </Link>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={rows.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)}
        sorting={sorting}
        onSortingChange={(next) => {
          setSorting(next);
          setPage(1);
        }}
        manualSorting
        page={current}
        pageCount={pageCount}
        onPageChange={setPage}
        empty={t("dashboard.table.empty")}
      />
    </section>
  );
}
