import { useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Container,
  createColumnHelper,
  DataTable,
  EmptyState,
  PageHeader,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  type RowSelectionState,
  type SortingState,
} from "@wnpcode/design-system";
import { Demo, Section } from "../../Section";

type Siswa = { id: number; nama: string; kelas: string; status: "Aktif" | "Menunggu" | "Ditolak" };

const siswa: Siswa[] = [
  { id: 1, nama: "Aisyah Putri", kelas: "7A", status: "Aktif" },
  { id: 2, nama: "Bagas Pratama", kelas: "7B", status: "Menunggu" },
  { id: 3, nama: "Citra Lestari", kelas: "8A", status: "Ditolak" },
  { id: 4, nama: "Dimas Saputra", kelas: "9A", status: "Aktif" },
];

const statusVariant = { Aktif: "success", Menunggu: "warning", Ditolak: "danger" } as const;

export function TableSection() {
  return (
    <Section id="table" title="Table" description="Primitif tabel statis. Untuk sorting, seleksi, dan pagination pakai DataTable.">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>Kelas</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {siswa.map((s) => (
            <TableRow key={s.id}>
              <TableCell>{s.nama}</TableCell>
              <TableCell>{s.kelas}</TableCell>
              <TableCell>
                <Badge variant={statusVariant[s.status]}>{s.status}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Section>
  );
}

const col = createColumnHelper<Siswa>();
const columns = [
  col.accessor("nama", { header: "Nama" }),
  col.accessor("kelas", { header: "Kelas" }),
  col.accessor("status", {
    header: "Status",
    enableSorting: false,
    cell: (c) => <Badge variant={statusVariant[c.getValue()]}>{c.getValue()}</Badge>,
  }),
];

export function DataTableSection() {
  const [sorting, setSorting] = useState<SortingState>([{ id: "nama", desc: false }]);
  const [selection, setSelection] = useState<RowSelectionState>({});
  return (
    <Section id="data-table" title="DataTable" description="Tabel dengan sorting, seleksi baris, state memuat, dan state kosong.">
      <Demo label="Sorting dan seleksi" className="block">
        <DataTable
          columns={columns}
          data={siswa}
          sorting={sorting}
          onSortingChange={setSorting}
          enableRowSelection
          rowSelection={selection}
          onRowSelectionChange={setSelection}
          getRowId={(r) => String(r.id)}
          caption={`${Object.keys(selection).length} baris terpilih`}
        />
      </Demo>
      <Demo label="Memuat" className="block">
        <DataTable columns={columns} data={[]} loading />
      </Demo>
      <Demo label="Kosong" className="block">
        <DataTable
          columns={columns}
          data={[]}
          empty={<EmptyState title="Belum ada siswa" description="Tambah siswa pertama." action={<Button>Tambah siswa</Button>} />}
        />
      </Demo>
    </Section>
  );
}

export function CardSection() {
  return (
    <Section id="card" title="Card" description="Pengelompokan konten yang berdiri sendiri, misalnya form atau ringkasan.">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Profil sekolah</CardTitle>
          <CardDescription>Data dasar yang tampil di halaman publik.</CardDescription>
        </CardHeader>
        <CardContent>SMA Negeri 1 · 24 kelas · 812 siswa aktif.</CardContent>
        <CardFooter className="gap-2">
          <Button>Simpan</Button>
          <Button variant="ghost">Batal</Button>
        </CardFooter>
      </Card>
    </Section>
  );
}

export function AvatarSection() {
  return (
    <Section
      id="avatar"
      title="Avatar"
      description="Foto profil dengan fallback inisial. sm untuk tabel dan header, lg untuk halaman profil."
    >
      <Demo label="Ukuran">
        <Avatar name="Budi Guru" size="sm" />
        <Avatar name="Budi Guru" size="md" />
        <Avatar name="Budi Guru" size="lg" />
      </Demo>
    </Section>
  );
}

export function LayoutSection() {
  return (
    <Section id="layout" title="Layout" description="Container membatasi lebar, Stack mengatur jarak, PageHeader membuka halaman.">
      <Demo label="PageHeader" className="block">
        <PageHeader
          title="Daftar siswa"
          description={`${siswa.length} siswa terdaftar tahun ajaran ini.`}
          actions={
            <>
              <Button variant="outline">Ekspor</Button>
              <Button>Tambah siswa</Button>
            </>
          }
        />
      </Demo>
      <Demo label="Stack · row, gap 3">
        <Stack direction="row" gap={3} align="center">
          <Badge variant="primary">Satu</Badge>
          <Badge variant="primary">Dua</Badge>
          <Badge variant="primary">Tiga</Badge>
        </Stack>
      </Demo>
      <Demo label="Container · size sm" className="block">
        <Container size="sm" className="px-4 py-3 text-sm rounded-md border border-dashed border-input text-muted-foreground">
          Lebar maksimal 672px, di tengah.
        </Container>
      </Demo>
    </Section>
  );
}
