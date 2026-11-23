import { useState } from "react";
import {
  Label,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@enterprise/design-system";
import { DemoSection } from "../DemoSection";

const jenjang: Record<string, string> = { sd: "SD", smp: "SMP", sma: "SMA" };

export function SelectDemo() {
  const [nilaiJenjang, setNilaiJenjang] = useState("");
  const [kelas, setKelas] = useState("");

  return (
    <div className="space-y-8">
      <DemoSection title="Terkontrol">
        <div className="max-w-xs space-y-2">
          <Label htmlFor="select-jenjang">Jenjang</Label>
          <Select value={nilaiJenjang} onValueChange={setNilaiJenjang}>
            <SelectTrigger id="select-jenjang">
              <SelectValue placeholder="Pilih jenjang" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sd">SD</SelectItem>
              <SelectItem value="smp">SMP</SelectItem>
              <SelectItem value="sma">SMA</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p role="status" className="text-sm text-muted-foreground">
          {nilaiJenjang ? `Jenjang terpilih: ${jenjang[nilaiJenjang]}` : "Belum ada jenjang dipilih"}
        </p>
      </DemoSection>

      <DemoSection title="Grup, label grup, dan pemisah">
        <div className="max-w-xs space-y-2">
          <Label htmlFor="select-kelas">Kelas</Label>
          <Select value={kelas} onValueChange={setKelas}>
            <SelectTrigger id="select-kelas">
              <SelectValue placeholder="Pilih kelas" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Kelas X</SelectLabel>
                <SelectItem value="X IPA 1">X IPA 1</SelectItem>
                <SelectItem value="X IPA 2">X IPA 2</SelectItem>
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>Kelas XI</SelectLabel>
                <SelectItem value="XI IPS 1">XI IPS 1</SelectItem>
                <SelectItem value="XI IPS 2">XI IPS 2</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <p role="status" className="text-sm text-muted-foreground">
          {kelas ? `Kelas terpilih: ${kelas}` : "Belum ada kelas dipilih"}
        </p>
      </DemoSection>

      <DemoSection title="Invalid">
        <div className="max-w-xs space-y-2">
          <Label htmlFor="select-invalid" required>
            Peminatan
          </Label>
          <Select>
            <SelectTrigger id="select-invalid" invalid aria-describedby="select-invalid-pesan">
              <SelectValue placeholder="Pilih peminatan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ipa">IPA</SelectItem>
              <SelectItem value="ips">IPS</SelectItem>
              <SelectItem value="bahasa">Bahasa</SelectItem>
            </SelectContent>
          </Select>
          <p id="select-invalid-pesan" className="text-sm text-danger">
            Peminatan wajib dipilih.
          </p>
        </div>
      </DemoSection>

      <DemoSection title="Disabled">
        <div className="max-w-xs space-y-2">
          <Label htmlFor="select-disabled">Tahun ajaran</Label>
          <Select defaultValue="2026">
            <SelectTrigger id="select-disabled" disabled>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2026">2026/2027</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </DemoSection>
    </div>
  );
}
