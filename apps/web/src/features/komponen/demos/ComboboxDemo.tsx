import { useState } from "react";
import { Combobox, Label, type ComboboxOption } from "@enterprise/design-system";
import { DemoSection } from "../DemoSection";

const kelasOptions: ComboboxOption[] = [
  { value: "x-ipa-1", label: "X IPA 1" },
  { value: "x-ipa-2", label: "X IPA 2" },
  { value: "x-ips-1", label: "X IPS 1" },
  { value: "xi-ipa-1", label: "XI IPA 1" },
  { value: "xi-ips-1", label: "XI IPS 1" },
  { value: "xi-ips-2", label: "XI IPS 2" },
  { value: "xii-ipa-1", label: "XII IPA 1" },
  { value: "xii-ips-1", label: "XII IPS 1" },
];

const kelasDenganPenuh: ComboboxOption[] = kelasOptions.map((o) => (o.value === "x-ips-1" ? { ...o, disabled: true } : o));

export function ComboboxDemo() {
  const [kelas, setKelas] = useState("");
  const [kelasPenuh, setKelasPenuh] = useState("");
  const label = (opts: ComboboxOption[], v: string) => opts.find((o) => o.value === v)?.label;

  return (
    <div className="space-y-8">
      <DemoSection title="Terkontrol dengan pencarian">
        <div className="max-w-xs space-y-2">
          <Label htmlFor="combobox-kelas">Kelas</Label>
          <Combobox
            id="combobox-kelas"
            options={kelasOptions}
            value={kelas}
            onValueChange={setKelas}
            placeholder="Pilih kelas"
            searchPlaceholder="Cari kelas"
            emptyText="Kelas tidak ditemukan"
          />
        </div>
        <p role="status" className="text-sm text-muted-foreground">
          {kelas ? `Kelas terpilih: ${label(kelasOptions, kelas)}` : "Belum ada kelas dipilih"}
        </p>
      </DemoSection>

      <DemoSection title="Option disabled">
        <div className="max-w-xs space-y-2">
          <Label htmlFor="combobox-penuh">Kelas tujuan pindah</Label>
          <Combobox
            id="combobox-penuh"
            options={kelasDenganPenuh}
            value={kelasPenuh}
            onValueChange={setKelasPenuh}
            placeholder="Pilih kelas tujuan"
            searchPlaceholder="Cari kelas"
          />
        </div>
        <p className="text-sm text-muted-foreground">X IPS 1 sudah penuh sehingga tidak bisa dipilih.</p>
        <p role="status" className="text-sm text-muted-foreground">
          {kelasPenuh ? `Tujuan: ${label(kelasDenganPenuh, kelasPenuh)}` : "Belum ada tujuan dipilih"}
        </p>
      </DemoSection>

      <DemoSection title="Invalid">
        <div className="max-w-xs space-y-2">
          <Label htmlFor="combobox-invalid" required>
            Kelas asal
          </Label>
          <Combobox id="combobox-invalid" options={kelasOptions} invalid placeholder="Pilih kelas asal" searchPlaceholder="Cari kelas" />
          <p className="text-sm text-danger">Kelas asal wajib dipilih.</p>
        </div>
      </DemoSection>

      <DemoSection title="Disabled">
        <div className="max-w-xs space-y-2">
          <Label htmlFor="combobox-disabled">Kelas</Label>
          <Combobox id="combobox-disabled" options={kelasOptions} defaultValue="xii-ipa-1" disabled />
        </div>
      </DemoSection>
    </div>
  );
}
