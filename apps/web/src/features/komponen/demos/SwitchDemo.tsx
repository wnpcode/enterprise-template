import { useState } from "react";
import { Label, Switch } from "@wnp_code/design-system";
import { DemoSection } from "../DemoSection";

export function SwitchDemo() {
  const [aktif, setAktif] = useState(true);

  return (
    <div className="space-y-8">
      <DemoSection title="Terkontrol">
        <div className="min-h-11 gap-3 flex items-center">
          <Switch id="switch-notifikasi" checked={aktif} onCheckedChange={setAktif} />
          <Label htmlFor="switch-notifikasi">Kirim notifikasi ke wali</Label>
          <span className="text-sm text-muted-foreground">{aktif ? "Aktif" : "Nonaktif"}</span>
        </div>
      </DemoSection>

      <DemoSection title="Disabled">
        <div className="min-h-11 gap-3 flex items-center">
          <Switch id="switch-pengingat" disabled defaultChecked />
          <Label htmlFor="switch-pengingat">Pengingat tagihan otomatis</Label>
        </div>
      </DemoSection>
    </div>
  );
}
