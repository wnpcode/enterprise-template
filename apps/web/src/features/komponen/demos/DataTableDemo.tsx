import { useState } from "react";
import { Button, createColumnHelper, DataTable, EmptyState, type RowSelectionState, type SortingState } from "@wnpcode/design-system";
import { siswaContoh, StatusBadge, type Siswa } from "../../siswa";
import { DemoSection } from "../DemoSection";

const col = createColumnHelper<Siswa>();
const columns = [
  col.accessor("nama", { header: "Nama" }),
  col.accessor("kelas", { header: "Kelas" }),
  col.accessor("status", { header: "Status", enableSorting: false, cell: (c) => <StatusBadge status={c.getValue()} /> }),
];
const BARIS = siswaContoh.slice(0, 6);

export function DataTableDemo() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [sel, setSel] = useState<RowSelectionState>({});
  const [page, setPage] = useState(1);

  return (
    <div className="space-y-8">
      <DemoSection title="Sorting klien dan seleksi baris">
        <DataTable
          columns={columns}
          data={BARIS}
          sorting={sorting}
          onSortingChange={setSorting}
          enableRowSelection
          rowSelection={sel}
          onRowSelectionChange={setSel}
          getRowId={(r) => String(r.id)}
          caption={`${Object.keys(sel).length} baris terpilih`}
        />
      </DemoSection>
      <DemoSection title="Halaman">
        <DataTable columns={columns} data={BARIS.slice((page - 1) * 3, page * 3)} page={page} pageCount={2} onPageChange={setPage} />
      </DemoSection>
      <DemoSection title="Memuat">
        <DataTable columns={columns} data={[]} loading skeletonRows={3} />
      </DemoSection>
      <DemoSection title="Kosong">
        <DataTable
          columns={columns}
          data={[]}
          empty={<EmptyState title="Belum ada siswa" description="Tambah siswa pertama." action={<Button>Tambah siswa</Button>} />}
        />
      </DemoSection>
    </div>
  );
}
