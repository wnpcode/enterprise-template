import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Button";
import { Input } from "../Input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../Sheet";
import { Tour } from "./index";

const meta: Meta<typeof Tour> = {
  title: "Components/Tour",
  tags: ["autodocs"],
  component: Tour,
  parameters: {
    docs: {
      description: {
        component: `Tur produk untuk mengenalkan alur fitur baru: menyorot elemen satu per satu di halaman yang sama, lengkap dengan penjelasan singkat.

**Import**
\`\`\`tsx
import { Tour, type TourStep } from "@wnp_code/design-system";
\`\`\`

**Cara pakai**
- Beri elemen yang disorot atribut \`data-tour\`, lalu tulis \`target\` tiap step sebagai CSS selector, mis. \`[data-tour="tambah"]\`.
- Tour dikendalikan lewat \`open\` dan \`onOpenChange\`. Komponen tidak menyimpan status "sudah dilihat"; simpan sendiri (mis. di localStorage) supaya tour tidak muncul terus.
- Tour muncul setelah elemen targetnya dirender. Step yang elemennya tidak ada atau tersembunyi (mis. kolom yang disembunyikan di mobile) dilewati, dan nomor langkah hanya menghitung step yang tampil.
- Untuk target yang belum ada di halaman (mis. isian di dalam Sheet), beri step \`before\` yang membuka Sheet-nya. Tour menunggu sampai target muncul (maksimal 2 detik, lalu step dilewati). \`before\` dipanggil tiap step tampil, jadi harus idempoten; bila step berikutnya ada di luar Sheet, beri \`before\` yang menutupnya. Tour tidak menutup Sheet saat selesai.
- Satu tur bisa menjelaskan beberapa fitur. Beri \`group\` (nama fitur) pada tiap step: label fitur tampil di atas judul, nomor langkah dihitung di dalam fitur, titik di bawah isi menandai batas fitur, dan "Lewati fitur ini" melompati satu fitur. Tombol X menutup seluruh tur. Tur dengan satu fitur tampil tanpa titik dan tanpa tombol X.
- Teks tombol dan nomor langkah bisa diganti lewat \`LocaleProvider\` (\`tour\`).

**Keyboard dan fokus**
- Tab berpindah antar tombol di panel; Escape atau klik di luar menutup tour. Tour tidak modal, jadi halaman di belakangnya tetap bisa dijangkau.
- Panel berperan sebagai \`dialog\` dengan judul step sebagai nama aksesibelnya.

**Do / Don't**
- Do: batasi 3-5 step per tour, satu halaman saja.
- Do: tulis judul step sebagai tindakan atau fungsi elemen, bukan nama elemen.
- Don't: jangan menyorot elemen yang bisa berpindah saat halaman memuat data; tunggu data siap sebelum membuka tour.
- Don't: jangan pakai untuk pesan penting yang harus dibaca; gunakan Alert atau Dialog.`,
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Tour>;

function Demo() {
  const [open, setOpen] = useState(true);
  return (
    <div className="gap-4 p-16 flex items-center">
      <Input data-tour="cari" aria-label="Cari siswa" placeholder="Cari siswa" className="w-56" />
      <Button data-tour="tambah">Tambah siswa</Button>
      <Button variant="outline" data-tour="ekspor">
        Ekspor
      </Button>
      <Button variant="ghost" onClick={() => setOpen(true)}>
        Lihat tur
      </Button>
      <Tour
        open={open}
        onOpenChange={setOpen}
        steps={[
          { target: '[data-tour="cari"]', title: "Cari siswa", content: "Ketik nama atau kelas untuk menyaring daftar." },
          { target: '[data-tour="tambah"]', title: "Tambah siswa baru", content: "Buka form untuk mendaftarkan satu siswa." },
          {
            target: '[data-tour="ekspor"]',
            title: "Ekspor data",
            content: "Unduh daftar yang sedang tampil sebagai file.",
            side: "bottom",
          },
        ]}
      />
    </div>
  );
}

export const TigaLangkah: Story = { render: () => <Demo /> };

function SheetDemo() {
  const [tour, setTour] = useState(true);
  const [sheet, setSheet] = useState(false);
  return (
    <div className="gap-4 p-16 flex items-center">
      <Sheet open={sheet} onOpenChange={setSheet}>
        <SheetTrigger asChild>
          <Button data-tour="tambah">Tambah siswa</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Tambah siswa</SheetTitle>
            <SheetDescription>Isi data lalu simpan.</SheetDescription>
          </SheetHeader>
          <Input data-tour="nama" aria-label="Nama" placeholder="Nama" />
        </SheetContent>
      </Sheet>
      <Button variant="ghost" data-tour="lihat" onClick={() => setTour(true)}>
        Lihat tur
      </Button>
      <Tour
        open={tour}
        onOpenChange={setTour}
        steps={[
          {
            target: '[data-tour="tambah"]',
            group: "Tambah siswa",
            title: "Tombol tambah",
            content: "Tombol ini membuka form.",
            before: () => setSheet(false),
          },
          {
            target: '[data-tour="nama"]',
            group: "Tambah siswa",
            title: "Isi nama",
            content: "Nama wajib diisi.",
            before: () => setSheet(true),
            side: "left",
          },
          {
            target: '[data-tour="lihat"]',
            group: "Lihat tur",
            title: "Ulangi kapan saja",
            content: "Tombol ini memutar tur dari awal.",
            before: () => setSheet(false),
          },
        ]}
      />
    </div>
  );
}

export const StepDiDalamSheet: Story = { render: () => <SheetDemo /> };
