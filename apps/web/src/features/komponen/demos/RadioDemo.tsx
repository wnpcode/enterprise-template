import { useState } from "react";
import { Label, Radio } from "@wnpcode/design-system";
import { DemoSection } from "../DemoSection";

const jenjang = ["SD", "SMP", "SMA"];

export function RadioDemo() {
  const [dipilih, setDipilih] = useState("SMP");

  return (
    <div className="space-y-8">
      <DemoSection title="Grup terkontrol">
        <fieldset className="space-y-1">
          <legend className="mb-1 text-sm font-medium">Jenjang</legend>
          {jenjang.map((nama) => (
            <div key={nama} className="min-h-11 gap-2 flex items-center">
              <Radio
                id={`radio-jenjang-${nama.toLowerCase()}`}
                name="radio-jenjang"
                value={nama}
                checked={dipilih === nama}
                onChange={() => setDipilih(nama)}
              />
              <Label htmlFor={`radio-jenjang-${nama.toLowerCase()}`}>{nama}</Label>
            </div>
          ))}
        </fieldset>
        <p className="text-sm text-muted-foreground">Jenjang terpilih: {dipilih}</p>
      </DemoSection>

      <DemoSection title="Disabled">
        <fieldset disabled className="space-y-1">
          <legend className="mb-1 text-sm font-medium">Jalur pendaftaran</legend>
          <div className="min-h-11 gap-2 flex items-center">
            <Radio id="radio-jalur-zonasi" name="radio-jalur" defaultChecked />
            <Label htmlFor="radio-jalur-zonasi">Zonasi</Label>
          </div>
          <div className="min-h-11 gap-2 flex items-center">
            <Radio id="radio-jalur-prestasi" name="radio-jalur" />
            <Label htmlFor="radio-jalur-prestasi">Prestasi</Label>
          </div>
        </fieldset>
      </DemoSection>
    </div>
  );
}
