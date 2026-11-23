import { Button, Spinner } from "@enterprise/design-system";
import { DemoSection } from "../DemoSection";

export function SpinnerDemo() {
  return (
    <div className="space-y-8">
      <DemoSection title="Ukuran">
        <div className="gap-6 flex items-center">
          <div className="gap-2 text-sm flex items-center">
            <Spinner size="sm" />
            <span>sm</span>
          </div>
          <div className="gap-2 text-sm flex items-center">
            <Spinner size="md" />
            <span>md (bawaan)</span>
          </div>
          <div className="gap-2 text-sm flex items-center">
            <Spinner size="lg" />
            <span>lg</span>
          </div>
        </div>
      </DemoSection>

      <DemoSection title="Label kustom">
        <div className="gap-3 text-sm flex items-center">
          <Spinner label="Memuat daftar kelas" />
          <span aria-hidden="true">Memuat daftar kelas</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Label dibaca pembaca layar lewat role status. Teks di sebelahnya disembunyikan dari pembaca layar agar tidak terbaca dua kali.
        </p>
      </DemoSection>

      <DemoSection title="Di dalam tombol loading">
        <div className="gap-4 flex flex-wrap items-center">
          <Button loading>Menyimpan</Button>
          <Button variant="outline" loading>
            Mengekspor nilai
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Button dengan loading memasang Spinner kecil sendiri dan menonaktifkan tombol, jadi tidak perlu menambahkannya manual.
        </p>
      </DemoSection>
    </div>
  );
}
