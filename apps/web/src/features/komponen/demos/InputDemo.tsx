import { Input, Label } from "@enterprise/design-system";
import { DemoSection } from "../DemoSection";

export function InputDemo() {
  return (
    <div className="space-y-8">
      <DemoSection title="Default">
        <div className="max-w-sm space-y-2">
          <Label htmlFor="input-nama">Nama siswa</Label>
          <Input id="input-nama" placeholder="Contoh: Siti Rahmawati" />
        </div>
      </DemoSection>

      <DemoSection title="Ukuran">
        <div className="max-w-sm space-y-4">
          <div className="space-y-2">
            <Label htmlFor="input-sm">Kelas (kecil)</Label>
            <Input id="input-sm" size="sm" defaultValue="7A" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="input-md">Kelas (sedang)</Label>
            <Input id="input-md" size="md" defaultValue="7A" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="input-lg">Kelas (besar)</Label>
            <Input id="input-lg" size="lg" defaultValue="7A" />
          </div>
        </div>
      </DemoSection>

      <DemoSection title="Invalid">
        <div className="max-w-sm space-y-2">
          <Label htmlFor="input-nisn">NISN</Label>
          <Input id="input-nisn" invalid defaultValue="12345" inputMode="numeric" aria-describedby="input-nisn-error" />
          <p id="input-nisn-error" className="text-sm text-danger">
            NISN harus 10 digit
          </p>
        </div>
      </DemoSection>

      <DemoSection title="Disabled">
        <div className="max-w-sm space-y-2">
          <Label htmlFor="input-tagihan">Nomor tagihan</Label>
          <Input id="input-tagihan" disabled defaultValue="INV-2026-0142" />
        </div>
      </DemoSection>
    </div>
  );
}
