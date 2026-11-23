import { Checkbox, Input, Label } from "@wnp_code/design-system";
import { DemoSection } from "../DemoSection";

export function LabelDemo() {
  return (
    <div className="space-y-8">
      <DemoSection title="Terhubung ke Input">
        <div className="max-w-sm space-y-2">
          <Label htmlFor="label-wali">Nama wali</Label>
          <Input id="label-wali" placeholder="Contoh: Budi Santoso" />
        </div>
      </DemoSection>

      <DemoSection title="Wajib diisi">
        <div className="max-w-sm space-y-2">
          <Label htmlFor="label-telepon" required>
            Nomor telepon wali
          </Label>
          <Input id="label-telepon" type="tel" required placeholder="08xxxxxxxxxx" />
        </div>
      </DemoSection>

      <DemoSection title="Untuk Checkbox">
        <div className="min-h-11 gap-2 flex items-center">
          <Checkbox id="label-setuju" />
          <Label htmlFor="label-setuju">Saya setuju dengan tata tertib sekolah</Label>
        </div>
      </DemoSection>
    </div>
  );
}
