import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "../Badge";
import { Skeleton } from "../Skeleton";
import { Table, TableBody, TableCaption, TableCell, TableEmpty, TableHead, TableHeader, TableRow } from "./Table";

const meta: Meta<typeof Table> = {
  title: "Components/Table",
  tags: ["autodocs"],
  component: Table,
  parameters: {
    docs: {
      description: {
        component: `Tabel data berbasis elemen HTML native. Sub-komponen: \`Table\`, \`TableHeader\`, \`TableBody\`, \`TableFooter\`, \`TableRow\`, \`TableHead\`, \`TableCell\`, \`TableCaption\`, \`TableEmpty\`.

**Import**
\`\`\`tsx
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption, TableEmpty } from "@wnpcode/design-system";
\`\`\`

**Keyboard dan fokus**
- Memakai semantik \`table\` native, sehingga pembaca layar mengenali baris dan kolom; tidak ada interaksi keyboard khusus.
- \`Table\` dibungkus kontainer \`overflow-x-auto\` agar tabel lebar bisa digulir horizontal; \`TableCaption\` ditempatkan di bawah tabel.
- \`TableEmpty\` butuh \`colSpan\` sama dengan jumlah kolom; tanpa children menampilkan "Tidak ada data".
- Sorting, paging, dan fetching milik consumer: komponen ini hanya menyajikan data. Status loading adalah baris \`Skeleton\` yang dirender consumer.
- \`TableRow\` mendukung \`data-state="selected"\` untuk sorotan baris terpilih. \`Table\` tak di-portal.

**Do / Don't**
- Do: tambahkan \`TableCaption\` atau \`aria-label\` pada \`Table\` agar tabel punya nama.
- Do: Pasangkan dengan \`Pagination\` untuk data banyak, dan tampilkan \`TableEmpty\` saat hasil kosong.
- Don't: jangan memakai Table untuk tata letak.
- Don't: jangan menyembunyikan loading dengan tabel kosong; render baris \`Skeleton\` selama data diambil.`,
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Table>;

const students = [
  { nama: "Aisyah Putri", kelas: "7A", status: "Aktif" },
  { nama: "Bima Prasetyo", kelas: "7B", status: "Aktif" },
  { nama: "Citra Lestari", kelas: "8A", status: "Cuti" },
  { nama: "Dimas Anggara", kelas: "9C", status: "Lulus" },
];

const head = (
  <TableHeader>
    <TableRow>
      <TableHead>Nama</TableHead>
      <TableHead>Kelas</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
);

export const Default: Story = {
  render: () => (
    <Table>
      {head}
      <TableBody>
        {students.map((s) => (
          <TableRow key={s.nama}>
            <TableCell className="font-medium">{s.nama}</TableCell>
            <TableCell>{s.kelas}</TableCell>
            <TableCell>
              <Badge variant={s.status === "Aktif" ? "success" : s.status === "Cuti" ? "warning" : "neutral"}>{s.status}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const WithCaption: Story = {
  render: () => (
    <Table>
      <TableCaption>Daftar siswa tahun ajaran 2026/2027</TableCaption>
      {head}
      <TableBody>
        {students.map((s) => (
          <TableRow key={s.nama}>
            <TableCell className="font-medium">{s.nama}</TableCell>
            <TableCell>{s.kelas}</TableCell>
            <TableCell>{s.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const Empty: Story = {
  render: () => (
    <Table>
      {head}
      <TableBody>
        <TableEmpty colSpan={3}>Belum ada siswa terdaftar</TableEmpty>
      </TableBody>
    </Table>
  ),
};

/** Table has no loading state: while fetching, the consumer renders Skeleton rows. */
export const Loading: Story = {
  render: () => (
    <Table aria-busy="true">
      {head}
      <TableBody>
        {[0, 1, 2].map((i) => (
          <TableRow key={i}>
            <TableCell>
              <Skeleton className="h-4 w-40" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-10" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-16" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};
