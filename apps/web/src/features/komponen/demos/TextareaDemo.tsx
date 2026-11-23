import { Label, Textarea } from "@wnp_code/design-system";
import { DemoSection } from "../DemoSection";

export function TextareaDemo() {
  return (
    <div className="space-y-8">
      <DemoSection title="Default">
        <div className="max-w-md space-y-2">
          <Label htmlFor="textarea-catatan">Catatan wali kelas</Label>
          <Textarea id="textarea-catatan" placeholder="Tuliskan perkembangan siswa semester ini" />
        </div>
      </DemoSection>

      <DemoSection title="Invalid">
        <div className="max-w-md space-y-2">
          <Label htmlFor="textarea-alasan" required>
            Alasan izin
          </Label>
          <Textarea id="textarea-alasan" invalid required aria-describedby="textarea-alasan-error" />
          <p id="textarea-alasan-error" className="text-sm text-danger">
            Alasan izin wajib diisi
          </p>
        </div>
      </DemoSection>

      <DemoSection title="Disabled">
        <div className="max-w-md space-y-2">
          <Label htmlFor="textarea-arsip">Catatan semester lalu</Label>
          <Textarea id="textarea-arsip" disabled defaultValue="Aktif mengikuti kegiatan kelas dan rutin mengumpulkan tugas." />
        </div>
      </DemoSection>
    </div>
  );
}
