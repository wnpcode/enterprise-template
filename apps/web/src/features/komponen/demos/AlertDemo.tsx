import { Alert } from "@wnp_code/design-system";
import { DemoSection } from "../DemoSection";

export function AlertDemo() {
  return (
    <div className="space-y-8">
      <DemoSection title="Variant">
        <div className="max-w-md gap-3 flex flex-col">
          <Alert variant="info" title="Info">
            Jadwal ujian semester ganjil sudah diterbitkan.
          </Alert>
          <Alert variant="success" title="Berhasil">
            Data 23 siswa berhasil diimpor.
          </Alert>
          <Alert variant="warning" title="Perhatian">
            Kuota penyimpanan tersisa 5%.
          </Alert>
          <Alert variant="danger" title="Gagal" live>
            Server tidak merespons. Coba lagi beberapa saat.
          </Alert>
        </div>
      </DemoSection>
      <DemoSection title="Tanpa judul">
        <Alert className="max-w-md">Perubahan tersimpan otomatis setiap 30 detik.</Alert>
      </DemoSection>
    </div>
  );
}
