import { Button } from "@wnpcode/design-system";
import { DemoSection } from "../DemoSection";

const variants = ["primary", "secondary", "outline", "ghost", "danger"] as const;
const variantLabels = {
  primary: "Simpan",
  secondary: "Pratinjau",
  outline: "Ekspor data",
  ghost: "Batal",
  danger: "Hapus siswa",
} as const;

export function ButtonDemo() {
  return (
    <div className="space-y-8">
      <DemoSection title="Variant">
        <div className="gap-3 flex flex-wrap">
          {variants.map((variant) => (
            <Button key={variant} variant={variant}>
              {variantLabels[variant]}
            </Button>
          ))}
        </div>
      </DemoSection>

      <DemoSection title="Ukuran">
        <div className="gap-3 flex flex-wrap items-center">
          <Button size="sm">Kecil</Button>
          <Button size="md">Sedang</Button>
          <Button size="lg">Besar</Button>
        </div>
      </DemoSection>

      <DemoSection title="Disabled dan loading">
        <div className="gap-3 flex flex-wrap">
          <Button disabled>Kirim tagihan</Button>
          <Button loading>Menyimpan</Button>
        </div>
      </DemoSection>

      <DemoSection title="Konten di depan dan belakang">
        <div className="gap-3 flex flex-wrap">
          <Button leading="+">Tambah siswa</Button>
          <Button variant="outline" trailing="Kelas 7A">
            Pilih kelas
          </Button>
        </div>
      </DemoSection>
    </div>
  );
}
