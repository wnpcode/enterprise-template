import { Link } from "react-router";
import { Button, Container, Stack } from "@enterprise/design-system";
import { DemoSection } from "../DemoSection";

const SIZES = [
  { size: "sm", max: "42rem (max-w-2xl)" },
  { size: "md", max: "56rem (max-w-4xl)" },
  { size: "lg", max: "72rem (max-w-6xl)" },
] as const;

const frame = "border border-dashed border-border";

export function LayoutDemo() {
  return (
    <div className="space-y-8">
      <DemoSection title="Container">
        <p className="text-sm text-muted-foreground">
          Halaman ini sudah berada di dalam Container lg, jadi sm dan md tampak lebih sempit dan lg memenuhi lebar yang ada.
        </p>
        <div className="space-y-3">
          {SIZES.map(({ size, max }) => (
            <Container key={size} size={size} className={`${frame} px-3 py-3 text-sm sm:px-3`}>
              size="{size}": lebar maksimum {max}
            </Container>
          ))}
        </div>
      </DemoSection>

      <DemoSection title="Stack row">
        <p className="text-sm text-muted-foreground">
          direction="row" gap=3 align="center" justify="between" wrap. Menyempit ke baris baru di layar kecil.
        </p>
        <Stack direction="row" gap={3} align="center" justify="between" wrap className={`${frame} p-3`}>
          <span className="text-sm">Rekap absensi 2 November</span>
          <Stack direction="row" gap={2} wrap>
            <Button size="sm" variant="outline" className="min-h-11">
              Ekspor
            </Button>
            <Button size="sm" variant="outline" className="min-h-11">
              Cetak
            </Button>
            <Button size="sm" className="min-h-11">
              Kirim ke wali kelas
            </Button>
          </Stack>
        </Stack>
      </DemoSection>

      <DemoSection title="Stack column">
        <p className="text-sm text-muted-foreground">direction="column" (bawaan) gap=2, align="start". Tombol tidak melebar.</p>
        <Stack gap={2} align="start" className={`${frame} p-3`}>
          <Button size="sm" variant="outline" className="min-h-11">
            Data siswa
          </Button>
          <Button size="sm" variant="outline" className="min-h-11">
            Jadwal pelajaran
          </Button>
          <Button size="sm" variant="outline" className="min-h-11">
            Nilai semester
          </Button>
        </Stack>
      </DemoSection>

      <DemoSection title="PageHeader">
        <p className="text-sm text-muted-foreground">
          Judul dan deskripsi di bagian atas halaman ini dirender oleh PageHeader. PageHeader selalu memakai h1, jadi hanya satu per
          halaman. Prop actions menempatkan kontrol di sisi kanan, contohnya kolom cari di{" "}
          <Link to="/app/siswa" className="text-primary underline-offset-4 hover:underline">
            halaman Siswa
          </Link>
          .
        </p>
      </DemoSection>
    </div>
  );
}
