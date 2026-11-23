# Tutorial: template, design system, dan Storybook

Panduan berurutan untuk developer React yang baru masuk tim. Kamu diasumsikan sudah paham React, TypeScript, dan Tailwind. Tutorial ini mengajarkan konvensi repo ini, bukan dasar-dasarnya.

Dokumen lain yang akan sering dirujuk:

- `README.md`: referensi perintah, struktur, dan API.
- `CONTRIBUTING.md`: checklist komponen, review API publik, SemVer, langkah rilis.
- `DESIGN-SYSTEM.md`: daftar token dan nilainya, aturan skin dan brand.
- `packages/design-system/CHANGELOG.md`: catatan perubahan per rilis.

Dua studi kasus dipakai sepanjang tutorial: komponen `Alert` di design system (bagian 4) dan fitur `guru` di `apps/web` (bagian 5). Kodenya hanya ada di tutorial ini; kamu yang mengetiknya di repo.

## 0. Sebelum mulai

1. Pasang Node 20 atau lebih baru dan aktifkan pnpm 10:

```bash
corepack enable
node -v
pnpm -v
```

2. Pasang dependency dari root repo:

```bash
pnpm install
```

3. Kenali tiga workspace:

```text
packages/design-system/   paket @wnpcode/design-system: token, tema, komponen, Storybook
apps/web/                 boilerplate aplikasi "Portal Sekolah" yang memakai paket itu
apps/playground/          fixture kecil untuk mencoba paket dari export publiknya
```

Aturan yang berlaku di seluruh repo: `apps/*` hanya mengimpor dari `@wnpcode/design-system`, tidak pernah dari path dalam `packages/design-system/src`.

## 1. Menjalankan template

Tujuan: melihat semua yang disediakan template sebelum mengubah apa pun.

1. Jalankan aplikasi:

```bash
pnpm dev:web
```

Buka `http://localhost:5173`. Kamu akan melihat landing page. Klik "Masuk ke portal".

2. Login mock: isi email dan kata sandi apa pun yang tidak kosong. Tidak ada backend. Sesi disimpan di `localStorage["web-auth"]`.

3. Tur dashboard:
   - Sidebar kiri berisi Dashboard, Siswa, Komponen, Pengaturan. Tombol ikon di header menciutkan sidebar jadi ikon saja.
   - Pengaturan: tema (terang, gelap, ikuti sistem), gaya permukaan (flat, neumorphism, glassmorphism), orientasi navigasi (vertikal atau horisontal), dan ciut. Semua tersimpan di perangkat.
   - Komponen: galeri hidup setiap komponen design system di dalam portal. Pakai ini untuk melihat komponen dalam konteks tema dan skin yang sedang aktif.
   - Siswa: tabel dengan pencarian, pagination, state memuat, dan state kosong. Buka `/app/siswa?fail=1` untuk melihat state gagal dan tombol "Coba lagi".
   - Kecilkan jendela di bawah 768px: sidebar hilang, navigasi pindah ke pill di bagian bawah.

4. Preferensi tersimpan di empat key `localStorage`: `web-auth`, `web-layout`, `web-skin`, `ds-theme`. Hapus key itu dari devtools jika ingin kembali ke kondisi awal.

5. Jalankan "lampu hijau" dari root. Ketiganya harus lolos sebelum dan sesudah setiap perubahan:

```bash
pnpm typecheck && pnpm lint && pnpm test
```

## 2. Memakai design system di halaman

Tujuan: memahami bagaimana paket terhubung ke aplikasi, lalu memakai beberapa komponen.

1. Lihat urutan provider di `apps/web/src/app/App.tsx`:

```text
SkinProvider        pilihan skin milik app, disimpan di localStorage["web-skin"]
  ThemeProvider     dari paket; menulis data-theme dan data-skin ke <html>
    TooltipProvider dari paket; wajib agar Tooltip bekerja
      ToastProvider dari paket; wajib agar useToast() bekerja
        AppRoutes
```

2. Lihat CSS entry di `apps/web/src/app/styles.css`. Tiga baris pertama yang penting:

```css
@import "tailwindcss";
@import "@wnpcode/design-system/styles.css";
@source "../../../../packages/design-system/dist";
```

`@source` membuat Tailwind di app ikut menghasilkan kelas utilitas yang dipakai komponen paket. Paket tidak mengirim CSS Tailwind yang sudah dikompilasi. Karena `@source` menunjuk ke `dist`, setiap perubahan CSS atau komponen di paket baru terlihat di app setelah `pnpm --filter @wnpcode/design-system build`.

3. Pakai komponen. Contoh kartu dengan tombol yang menampilkan toast:

```tsx
import { Button, Card, CardContent, CardHeader, CardTitle, useToast } from "@wnpcode/design-system";

export function KartuContoh() {
  const { toast } = useToast();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pengumuman</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">Libur semester dimulai 22 Desember.</p>
        <Button onClick={() => toast({ variant: "success", title: "Tersimpan", description: "Pengumuman diterbitkan." })}>
          Terbitkan
        </Button>
      </CardContent>
    </Card>
  );
}
```

4. Aturan token. Pakai hanya kelas semantik: `bg-surface`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-primary`, `text-danger`, dan seterusnya. Jangan `bg-white`, `text-gray-500`, atau warna hex. Kelas semantik mengikuti tema gelap, brand, dan skin secara otomatis; warna mentah tidak. Daftar lengkap ada di `DESIGN-SYSTEM.md` bagian 2.

5. Kalau komponen yang kamu butuhkan belum ada di daftar komponen README, cek dulu apakah bisa dirangkai dari yang ada. Kalau tidak, lanjut ke bagian 4.

## 3. Storybook

Tujuan: menjelajah komponen secara terisolasi, membaca dokumentasinya, dan tahu cara menulis story.

1. Jalankan:

```bash
pnpm storybook
```

Buka `http://localhost:6006`.

2. Sidebar Storybook punya dua kelompok. "Foundations" (dari `packages/design-system/stories/Foundations.stories.tsx`) menampilkan warna, tipografi, radius, dan shadow. "Components" berisi satu entri per komponen, dari file `*.stories.tsx` di folder komponennya.

3. Toolbar atas punya dua pilihan global: Theme (light, dark) dan Skin (flat, neo, glass). Keduanya didefinisikan di `packages/design-system/.storybook/preview.tsx` dan bekerja dengan menulis `data-theme` dan `data-skin` ke `<html>`, sama seperti `ThemeProvider` di app.

4. Buka Components, Button. Tab "Docs" berisi tujuan, cara import, perilaku keyboard, dan Do/Don't. Teks itu berasal dari `parameters.docs.description.component` di `Button.stories.tsx`. Tabel props dirender otomatis dari tipe TypeScript, jadi JSDoc pada prop ikut muncul.

5. Pilih story "Default", lalu panel bawah: tab "Controls" mengubah props secara langsung; tab "Accessibility" menjalankan axe pada story. Konfigurasi `a11y.test: "error"` di `preview.tsx` membuat pelanggaran dianggap kegagalan, bukan peringatan.

6. Pola menulis story, diambil dari `Button.stories.tsx`:

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "..." } } },
  component: Button,
  args: { children: "Button" },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {};
export const AllVariants: Story = { render: () => <div className="flex gap-3">...</div> };
```

Konvensi: `title` selalu `Components/<Nama>`, `tags: ["autodocs"]` agar tab Docs dibuat otomatis, satu story `Default` yang bisa dimainkan lewat Controls, dan satu story per kumpulan variant atau state publik.

7. Build statis untuk dibagikan atau dipasang di CI:

```bash
pnpm build-storybook
```

Hasilnya di `packages/design-system/storybook-static/`.

## 4. Studi kasus A: menambah komponen Alert

Tujuan: menambah komponen baru ke paket dengan lengkap: implementasi, tes, story, export, CHANGELOG, lalu melihatnya di Storybook dan di app.

Alert adalah pesan inline (bukan toast) dengan empat varian warna. Polanya meniru `Badge`, komponen paling sederhana di paket.

1. Buat folder `packages/design-system/src/components/Alert/` dengan empat file.

`Alert.tsx`:

```tsx
import type { ComponentProps, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

const alertVariants = cva("rounded-md border px-4 py-3 text-sm", {
  variants: {
    variant: {
      info: "border-info/30 bg-info-subtle text-info-subtle-fg",
      success: "border-success/30 bg-success-subtle text-success-subtle-fg",
      warning: "border-warning/30 bg-warning-subtle text-warning-subtle-fg",
      danger: "border-danger/30 bg-danger-subtle text-danger-subtle-fg",
    },
  },
  defaultVariants: { variant: "info" },
});

export interface AlertProps extends Omit<ComponentProps<"div">, "title">, VariantProps<typeof alertVariants> {
  title?: ReactNode;
  /** true untuk pesan yang harus segera dibacakan screen reader (role="alert"); default role="status" */
  live?: boolean;
}

export function Alert({ variant, title, live = false, className, children, ...props }: AlertProps) {
  return (
    <div role={live ? "alert" : "status"} className={cn(alertVariants({ variant }), className)} {...props}>
      {title && <p className="font-medium">{title}</p>}
      {children && <div className={cn(title && "mt-1")}>{children}</div>}
    </div>
  );
}
```

Perhatikan: hanya token semantik (`*-subtle`, `*-subtle-fg`), menerima `className` dan semua atribut `div`, dan tidak ada logika bisnis.

`Alert.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { expectNoA11yViolations } from "../../test/axe";
import { Alert } from "./Alert";

describe("Alert", () => {
  it("defaults to info and role status", () => {
    render(<Alert>Pesan</Alert>);
    expect(screen.getByRole("status")).toHaveClass("bg-info-subtle");
  });

  it.each([
    ["info", "bg-info-subtle"],
    ["success", "bg-success-subtle"],
    ["warning", "bg-warning-subtle"],
    ["danger", "bg-danger-subtle"],
  ] as const)("renders %s variant", (variant, cls) => {
    render(<Alert variant={variant}>Pesan</Alert>);
    expect(screen.getByRole("status")).toHaveClass(cls);
  });

  it("uses role alert when live", () => {
    render(
      <Alert live title="Gagal">
        Coba lagi.
      </Alert>,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Gagal");
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Alert variant="warning" title="Perhatian">Kuota hampir habis.</Alert>);
    await expectNoA11yViolations(container);
  });
});
```

`Alert.stories.tsx`:

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Alert } from "./Alert";

const meta: Meta<typeof Alert> = {
  title: "Components/Alert",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: `Pesan inline yang menetap di halaman, untuk status atau peringatan yang terkait konten di sekitarnya. Untuk notifikasi sementara pakai Toast.

**Import**
\`\`\`tsx
import { Alert } from "@wnpcode/design-system";
\`\`\`

**Aksesibilitas**
- Default \`role="status"\` (dibacakan tanpa menyela). \`live\` mengubahnya jadi \`role="alert"\` untuk kegagalan yang butuh perhatian segera.
- Warna bukan satu-satunya penanda: selalu beri \`title\` atau teks yang menyebut jenis pesannya.

**Do / Don't**
- Do: satu Alert per konteks, di dekat hal yang dibicarakan.
- Don't: memakai \`live\` untuk pesan informatif biasa.` } } },
  component: Alert,
  args: { title: "Perhatian", children: "Kuota penyimpanan tersisa 5%." },
};
export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {};

export const AllVariants: Story = {
  render: () => (
    <div className="flex max-w-md flex-col gap-3">
      <Alert variant="info" title="Info">Jadwal ujian sudah diterbitkan.</Alert>
      <Alert variant="success" title="Berhasil">Data siswa tersimpan.</Alert>
      <Alert variant="warning" title="Perhatian">Kuota penyimpanan tersisa 5%.</Alert>
      <Alert variant="danger" title="Gagal" live>Server tidak merespons. Coba lagi.</Alert>
    </div>
  ),
};
```

`index.ts`:

```ts
export { Alert } from "./Alert";
export type { AlertProps } from "./Alert";
```

2. Export dari entry publik `packages/design-system/src/index.ts`, di urutan abjad bersama komponen lain:

```ts
export { Alert, type AlertProps } from "./components/Alert";
```

3. Tambah satu baris di `packages/design-system/CHANGELOG.md` bagian Unreleased, Added:

```md
- Komponen `Alert` (varian `info`, `success`, `warning`, `danger`; prop `title`, `live`).
```

4. Jalankan cek paket:

```bash
pnpm --filter @wnpcode/design-system typecheck
pnpm --filter @wnpcode/design-system lint
pnpm --filter @wnpcode/design-system test
```

5. Lihat di Storybook (`pnpm storybook`): entri Components, Alert muncul. Ganti Theme ke dark dan Skin ke glass; warna harus tetap terbaca. Buka panel Accessibility pada story AllVariants; harus tanpa pelanggaran.

6. Agar `apps/web` bisa memakainya, build paket:

```bash
pnpm --filter @wnpcode/design-system build
```

Lalu di halaman mana pun: `import { Alert } from "@wnpcode/design-system"`.

7. Sebelum membuka PR, ikuti checklist di `CONTRIBUTING.md` bagian "Menambah atau mengubah komponen". Perubahan nama export, prop, atau nilai variant adalah perubahan API publik dan punya aturan sendiri di dokumen itu.

## 5. Studi kasus B: menambah fitur Guru di apps/web

Tujuan: menambah halaman baru dengan data, route, dan item navigasi mengikuti struktur feature-based.

Setiap fitur tinggal di `apps/web/src/features/<nama>/` dan hanya mengekspos `index.ts`. Router dan fitur lain mengimpor dari `index.ts` itu saja.

1. Buat `apps/web/src/features/guru/api.ts`:

```ts
export type Guru = { id: number; nama: string; mapel: string; kelasDiampu: number };

// shortcut: data contoh lokal dan jeda buatan, ganti dengan panggilan API saat backend ada
export const guruContoh: Guru[] = [
  { id: 1, nama: "Ahmad Fauzi", mapel: "Matematika", kelasDiampu: 4 },
  { id: 2, nama: "Budi Santoso", mapel: "Fisika", kelasDiampu: 3 },
  { id: 3, nama: "Dewi Lestari", mapel: "Bahasa Indonesia", kelasDiampu: 5 },
  { id: 4, nama: "Eko Prasetyo", mapel: "Sejarah", kelasDiampu: 2 },
  { id: 5, nama: "Fitri Handayani", mapel: "Kimia", kelasDiampu: 3 },
  { id: 6, nama: "Gilang Ramadhan", mapel: "Olahraga", kelasDiampu: 6 },
];

export async function fetchGuru({ delay = 400 }: { delay?: number } = {}): Promise<Guru[]> {
  await new Promise((r) => setTimeout(r, delay));
  return guruContoh;
}
```

2. Buat `apps/web/src/features/guru/GuruPage.tsx`. Ini versi ringkas dari `features/siswa/SiswaPage.tsx` (tanpa pencarian dan state error):

```tsx
import { useEffect, useState } from "react";
import {
  PageHeader,
  Pagination,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from "@wnpcode/design-system";
import { fetchGuru, type Guru } from "./api";

const PAGE_SIZE = 5;
const KOLOM = ["Nama", "Mata pelajaran", "Kelas diampu"];

export function GuruPage() {
  const [data, setData] = useState<Guru[] | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let active = true;
    fetchGuru().then((d) => active && setData(d));
    return () => {
      active = false;
    };
  }, []);

  const pageCount = data ? Math.ceil(data.length / PAGE_SIZE) : 0;
  const rows = data ? data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) : [];

  return (
    <div className="space-y-6">
      <PageHeader title="Guru" description="Daftar guru aktif tahun ajaran ini. Data contoh." />
      <div aria-busy={data === null} className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              {KOLOM.map((k) => (
                <TableHead key={k}>{k}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data === null ? (
              Array.from({ length: PAGE_SIZE }, (_, i) => (
                <TableRow key={i}>
                  {KOLOM.map((k) => (
                    <TableCell key={k}>
                      <Skeleton className="h-5 w-full min-w-16" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : rows.length === 0 ? (
              <TableEmpty colSpan={KOLOM.length}>Belum ada guru.</TableEmpty>
            ) : (
              rows.map((g) => (
                <TableRow key={g.id}>
                  <TableCell>{g.nama}</TableCell>
                  <TableCell>{g.mapel}</TableCell>
                  <TableCell>{g.kelasDiampu}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {data !== null && <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />}
      </div>
    </div>
  );
}
```

3. Buat `apps/web/src/features/guru/index.ts` sebagai public API fitur:

```ts
export { GuruPage } from "./GuruPage";
export { fetchGuru, guruContoh, type Guru } from "./api";
```

4. Daftarkan route di `apps/web/src/app/routes.tsx`. Tambah import dan satu baris di bawah `DashboardLayout`, setelah route `siswa`:

```tsx
import { GuruPage } from "../features/guru";
// ...
<Route path="guru" element={<GuruPage />} />
```

5. Tambah item navigasi di `apps/web/src/app/shell/nav.ts`. File ini satu-satunya sumber tujuan navigasi; Sidebar, header horisontal, dan BottomNav membacanya:

```ts
import { GraduationCap, LayoutDashboard, LayoutGrid, Settings, Users, type LucideIcon } from "lucide-react";
// ...
{ to: "/app/guru", label: "Guru", icon: GraduationCap },
```

6. Jalankan `pnpm dev:web`. Item "Guru" muncul di sidebar, di header saat orientasi horisontal, dan di pill bawah pada layar sempit. Halaman menampilkan skeleton sebentar lalu tabel enam guru dengan pagination dua halaman.

7. Tambah tes `apps/web/src/features/guru/GuruPage.test.tsx`. Vitest di app memakai `globals: true`, jadi `describe`, `it`, `expect` tidak perlu diimpor:

```tsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { GuruPage } from "./GuruPage";

it("menampilkan daftar guru setelah memuat", async () => {
  render(
    <MemoryRouter>
      <GuruPage />
    </MemoryRouter>,
  );
  expect(screen.getByRole("heading", { name: "Guru" })).toBeInTheDocument();
  expect(await screen.findByText("Ahmad Fauzi")).toBeInTheDocument();
});
```

Jalankan `pnpm --filter web test`.

8. Menghapus fitur: hapus folder `features/guru`, baris route di `routes.tsx`, dan item di `nav.ts`. Tidak ada tempat lain yang mengetahuinya. Hal yang sama berlaku untuk fitur `komponen` saat app dipakai produksi.

## 6. Theming, brand, dan skin

Tujuan: tahu apa yang diubah di mana saat identitas visual harus berbeda.

1. Tema. Komponen tidak perlu tahu tema; cukup pakai token semantik. Untuk membaca atau mengubah tema dari kode:

```tsx
import { useTheme } from "@wnpcode/design-system";

const { theme, setTheme } = useTheme(); // "light" | "dark" | "system"
```

Halaman Pengaturan di `apps/web/src/features/pengaturan/PengaturanPage.tsx` adalah contoh lengkapnya.

2. Brand. Brand hanya mengganti token semantik, bukan komponen. Tambah blok di CSS app, misalnya di `apps/web/src/app/styles.css`, meniru contoh `acme` di `packages/design-system/src/styles/index.css`:

```css
[data-brand="sekolahku"] {
  --ds-color-primary: #0f766e;
  --ds-color-primary-hover: #115e59;
  --ds-color-ring: #0f766e;
}
[data-theme="dark"][data-brand="sekolahku"] {
  --ds-color-primary: #2dd4bf;
  --ds-color-primary-hover: #5eead4;
  --ds-color-ring: #5eead4;
}
```

Lalu aktifkan lewat `<ThemeProvider brand="sekolahku">` di `App.tsx`. Pasang brand lewat ThemeProvider, bukan atribut di sebagian subtree, karena Dialog, Select, Dropdown, Tooltip, Popover, dan Toast di-portal ke `<body>` dan tidak mewarisi atribut subtree. Cek kontras pasangan `primary-foreground` di atas `primary` untuk kedua tema; daftar pasangan yang wajib dicek ada di `DESIGN-SYSTEM.md` bagian 4.

3. Skin. Tiga skin tersedia: flat (tanpa `data-skin`), `neo`, dan `glass`. Skin mengubah perlakuan permukaan (bayangan, radius, transparansi) tanpa mengubah API komponen, dan bisa digabung dengan brand. Di `apps/web` pilihan skin ada di Pengaturan lewat `src/app/skin.tsx`. Nilai token tiap skin dan keterbatasannya dijelaskan di `DESIGN-SYSTEM.md` bagian 3. Saat membuat panel baru di app, pakai resep Card (`rounded-lg border border-border bg-surface shadow-sm`) agar panel ikut skin.

## 7. Sebelum membuka PR

1. Dari root, semuanya harus hijau:

```bash
pnpm typecheck && pnpm lint && pnpm test && pnpm build
```

Tambah `pnpm build-storybook` bila mengubah paket.

2. Perubahan di paket: ikuti checklist dan aturan review API publik di `CONTRIBUTING.md`, dan tambah baris CHANGELOG.

3. Perubahan di app: jaga agar fitur hanya mengekspor lewat `index.ts`, hanya memakai token semantik, dan punya state memuat, kosong, dan gagal untuk data dari server.

4. Saat template ini dipakai untuk produk sungguhan, kerjakan daftar "Yang harus diganti saat dipakai sungguhan" di `README.md`: auth mock, data contoh, ikon PWA, nama produk, dan font.
