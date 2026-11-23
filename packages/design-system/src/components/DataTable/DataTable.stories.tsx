import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Badge } from "../Badge";
import { Button } from "../Button";
import { EmptyState } from "../EmptyState";
import { createColumnHelper, DataTable, type RowSelectionState, type SortingState } from "./index";

type Siswa = { id: number; nama: string; kelas: string; status: "Aktif" | "Menunggu" | "Ditolak" };
const data: Siswa[] = [
  { id: 1, nama: "Aisyah Putri", kelas: "X IPA 1", status: "Aktif" },
  { id: 2, nama: "Bagas Pratama", kelas: "X IPA 2", status: "Menunggu" },
  { id: 3, nama: "Citra Lestari", kelas: "X IPS 1", status: "Ditolak" },
  { id: 4, nama: "Dimas Saputra", kelas: "XI IPA 1", status: "Aktif" },
];
const col = createColumnHelper<Siswa>();
const columns = [
  col.accessor("nama", { header: "Nama" }),
  col.accessor("kelas", { header: "Kelas" }),
  col.accessor("status", {
    header: "Status",
    enableSorting: false,
    cell: (c) => (
      <Badge variant={c.getValue() === "Aktif" ? "success" : c.getValue() === "Menunggu" ? "warning" : "danger"}>{c.getValue()}</Badge>
    ),
  }),
];

const meta: Meta<typeof DataTable<Siswa>> = {
  title: "Components/DataTable",
  component: DataTable,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `Tabel data di atas primitives Table dan TanStack Table: kolom terdeklarasi, sorting (klien atau server), seleksi baris, state memuat (Skeleton) dan kosong, serta Pagination. Tanpa filter builder dan pengaturan kolom; tambahkan saat proyek membutuhkannya.

**Import**
\`\`\`tsx
import { DataTable, createColumnHelper, type SortingState } from "@enterprise/design-system";

const col = createColumnHelper<Siswa>();
const columns = [col.accessor("nama", { header: "Nama" }), col.accessor("kelas", { header: "Kelas", enableSorting: false })];
<DataTable columns={columns} data={rows} sorting={sorting} onSortingChange={setSorting} manualSorting page={page} pageCount={pageCount} onPageChange={setPage} />
\`\`\`

**Keyboard dan aksesibilitas**
- Header yang bisa diurutkan adalah tombol (Enter/Space) berlabel "Urutkan menurut …"; \`<th>\` memakai \`aria-sort\`.
- Checkbox seleksi berlabel ("Pilih baris", "Pilih semua baris"); header menjadi indeterminate saat sebagian terpilih.
- Pembungkus memakai \`aria-busy\` saat memuat. Teks label bisa diganti lewat \`labels\` (untuk i18n).

**Do / Don't**
- Do: \`manualSorting\` + \`page/pageCount\` bila server yang mengurutkan dan memotong halaman.
- Do: isi \`empty\` dengan EmptyState yang menyebut aksi lanjutan.
- Don't: menaruh lebih dari satu aksi per baris sebagai tombol; pakai DropdownMenu.`,
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof DataTable<Siswa>>;

export const Default: Story = { args: { columns, data } };

function SortableSelectableDemo() {
  const [sorting, setSorting] = useState<SortingState>([{ id: "nama", desc: false }]);
  const [sel, setSel] = useState<RowSelectionState>({});
  return (
    <DataTable
      columns={columns}
      data={data}
      sorting={sorting}
      onSortingChange={setSorting}
      enableRowSelection
      rowSelection={sel}
      onRowSelectionChange={setSel}
      getRowId={(r) => String(r.id)}
      caption={`${Object.keys(sel).length} baris terpilih`}
    />
  );
}

export const SortableSelectable: Story = { render: () => <SortableSelectableDemo /> };

export const Loading: Story = { args: { columns, data: [], loading: true } };

export const Empty: Story = {
  args: {
    columns,
    data: [],
    empty: <EmptyState title="Belum ada siswa" description="Tambah siswa pertama." action={<Button>Tambah siswa</Button>} />,
  },
};

function PaginatedDemo() {
  const [page, setPage] = useState(1);
  return <DataTable columns={columns} data={data.slice((page - 1) * 2, page * 2)} page={page} pageCount={2} onPageChange={setPage} />;
}

export const Paginated: Story = { render: () => <PaginatedDemo /> };
