import { useState } from "react";
import { Checkbox, Label } from "@wnpcode/design-system";
import { DemoSection } from "../DemoSection";

const ekstrakurikuler = ["Pramuka", "Basket", "Paduan suara", "Robotik"];

export function CheckboxDemo() {
  const [dipilih, setDipilih] = useState<string[]>(["Pramuka"]);

  const toggle = (nama: string, checked: boolean) =>
    setDipilih((prev) => (checked ? [...prev, nama] : prev.filter((item) => item !== nama)));

  return (
    <div className="space-y-8">
      <DemoSection title="Daftar ekstrakurikuler">
        <div className="space-y-1">
          {ekstrakurikuler.map((nama) => {
            const id = `checkbox-${nama.toLowerCase().replace(/\s+/g, "-")}`;
            return (
              <div key={nama} className="min-h-11 gap-2 flex items-center">
                <Checkbox id={id} checked={dipilih.includes(nama)} onChange={(e) => toggle(nama, e.target.checked)} />
                <Label htmlFor={id}>{nama}</Label>
              </div>
            );
          })}
        </div>
        <p className="text-sm text-muted-foreground">Dipilih: {dipilih.length}</p>
      </DemoSection>

      <DemoSection title="Invalid">
        <div className="space-y-1">
          <div className="min-h-11 gap-2 flex items-center">
            <Checkbox id="checkbox-izin" invalid aria-describedby="checkbox-izin-error" />
            <Label htmlFor="checkbox-izin">Wali menyetujui kegiatan luar sekolah</Label>
          </div>
          <p id="checkbox-izin-error" className="text-sm text-danger">
            Persetujuan wali wajib dicentang
          </p>
        </div>
      </DemoSection>

      <DemoSection title="Disabled">
        <div className="min-h-11 gap-2 flex items-center">
          <Checkbox id="checkbox-lunas" disabled defaultChecked />
          <Label htmlFor="checkbox-lunas">Tagihan semester ganjil lunas</Label>
        </div>
      </DemoSection>
    </div>
  );
}
