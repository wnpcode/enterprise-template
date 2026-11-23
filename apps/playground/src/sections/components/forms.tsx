import { useState } from "react";
import {
  Checkbox,
  Combobox,
  FormField,
  Input,
  Label,
  Radio,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Textarea,
} from "@enterprise/design-system";
import { Demo, Section } from "../../Section";

const kelas = ["7A", "7B", "7C", "8A", "8B", "9A"].map((k) => ({ value: k.toLowerCase(), label: `Kelas ${k}` }));

export function InputSection() {
  return (
    <Section id="input" title="Input" description="Field teks satu baris. Pasangkan dengan Label atau FormField.">
      <Demo label="Ukuran" className="max-w-xs flex-col items-stretch">
        <Input size="sm" placeholder="Kecil" aria-label="Input kecil" />
        <Input size="md" placeholder="Sedang" aria-label="Input sedang" />
        <Input size="lg" placeholder="Besar" aria-label="Input besar" />
      </Demo>
      <Demo label="State" className="max-w-xs flex-col items-stretch">
        <Input placeholder="SMA Negeri 1" aria-label="Normal" />
        <Input defaultValue="admin@sekolah" invalid aria-label="Tidak valid" />
        <Input defaultValue="Terkunci" disabled aria-label="Disabled" />
      </Demo>
    </Section>
  );
}

export function TextareaSection() {
  return (
    <Section id="textarea" title="Textarea" description="Untuk teks panjang seperti deskripsi atau catatan.">
      <Demo label="State" className="max-w-md flex-col items-stretch">
        <Textarea placeholder="Deskripsi singkat" aria-label="Normal" />
        <Textarea invalid defaultValue="Terlalu pendek" aria-label="Tidak valid" />
        <Textarea disabled defaultValue="Terkunci" aria-label="Disabled" />
      </Demo>
    </Section>
  );
}

export function FormFieldSection() {
  return (
    <Section
      id="form-field"
      title="Label dan FormField"
      description="FormField menghubungkan label, hint, dan pesan error ke kontrol lewat id dan aria-describedby."
    >
      <Demo label="Label">
        <div className="space-y-1.5">
          <Label htmlFor="ff-nama">Nama sekolah</Label>
          <Input id="ff-nama" placeholder="SMA Negeri 1" className="w-64" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ff-wajib" required>
            Nama sekolah
          </Label>
          <Input id="ff-wajib" placeholder="Wajib diisi" className="w-64" required />
        </div>
      </Demo>
      <Demo label="FormField" className="items-start">
        <FormField label="Email" required hint="Pakai email sekolah.">
          {(control) => <Input {...control} type="email" className="w-64" />}
        </FormField>
        <FormField label="NISN" required error="NISN harus 10 digit.">
          {(control) => <Input {...control} defaultValue="12345" inputMode="numeric" className="w-64" />}
        </FormField>
        <FormField label="Catatan" hint="Maksimal 500 karakter.">
          {(control) => <Textarea {...control} rows={3} className="w-64" />}
        </FormField>
      </Demo>
    </Section>
  );
}

export function CheckboxSection() {
  return (
    <Section id="checkbox" title="Checkbox" description="Pilihan independen. Label selalu inline di sebelahnya.">
      <Demo label="State" className="gap-6">
        <div className="gap-2 flex items-center">
          <Checkbox id="cb-default" />
          <Label htmlFor="cb-default">Setuju</Label>
        </div>
        <div className="gap-2 flex items-center">
          <Checkbox id="cb-checked" defaultChecked />
          <Label htmlFor="cb-checked">Terpilih</Label>
        </div>
        <div className="gap-2 flex items-center">
          <Checkbox id="cb-invalid" invalid />
          <Label htmlFor="cb-invalid">Tidak valid</Label>
        </div>
        <div className="gap-2 flex items-center">
          <Checkbox id="cb-disabled" disabled />
          <Label htmlFor="cb-disabled">Disabled</Label>
        </div>
      </Demo>
    </Section>
  );
}

export function RadioSection() {
  return (
    <Section id="radio" title="Radio" description="Satu pilihan dari grup kecil. Bungkus dengan fieldset dan legend.">
      <fieldset className="space-y-2">
        <legend className="mb-2 text-sm font-medium">Jenjang</legend>
        {["SD", "SMP", "SMA"].map((level) => (
          <div key={level} className="gap-2 flex items-center">
            <Radio id={`level-${level}`} name="level" value={level} defaultChecked={level === "SMA"} />
            <Label htmlFor={`level-${level}`}>{level}</Label>
          </div>
        ))}
        <div className="gap-2 flex items-center">
          <Radio id="level-disabled" name="level" value="SMK" disabled />
          <Label htmlFor="level-disabled">SMK (disabled)</Label>
        </div>
      </fieldset>
    </Section>
  );
}

export function SwitchSection() {
  const [notify, setNotify] = useState(true);
  return (
    <Section id="switch" title="Switch" description="Pengaturan on/off yang langsung berlaku.">
      <Demo label="State" className="gap-6">
        <div className="gap-2 flex items-center">
          <Switch id="sw-notify" checked={notify} onCheckedChange={setNotify} />
          <Label htmlFor="sw-notify">Kirim notifikasi email</Label>
        </div>
        <div className="gap-2 flex items-center">
          <Switch id="sw-disabled" disabled />
          <Label htmlFor="sw-disabled">Disabled</Label>
        </div>
      </Demo>
    </Section>
  );
}

export function SelectSection() {
  return (
    <Section id="select" title="Select" description="Pilihan dari daftar pendek. Untuk daftar panjang pakai Combobox.">
      <Demo label="State" className="items-start">
        <div className="w-56 space-y-1.5">
          <Label htmlFor="sel-jenjang">Jenjang</Label>
          <Select defaultValue="sma">
            <SelectTrigger id="sel-jenjang">
              <SelectValue placeholder="Pilih jenjang" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sd">SD</SelectItem>
              <SelectItem value="smp">SMP</SelectItem>
              <SelectItem value="sma">SMA</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-56 space-y-1.5">
          <Label htmlFor="sel-invalid">Tidak valid</Label>
          <Select>
            <SelectTrigger id="sel-invalid" invalid>
              <SelectValue placeholder="Pilih jenjang" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sd">SD</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-56 space-y-1.5">
          <Label htmlFor="sel-disabled">Disabled</Label>
          <Select disabled>
            <SelectTrigger id="sel-disabled">
              <SelectValue placeholder="Pilih jenjang" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sd">SD</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Demo>
    </Section>
  );
}

export function ComboboxSection() {
  return (
    <Section id="combobox" title="Combobox" description="Select dengan pencarian, untuk daftar yang panjang.">
      <Demo label="Default">
        <div className="w-56 space-y-1.5">
          <Label htmlFor="kelas-combobox">Kelas</Label>
          <Combobox id="kelas-combobox" options={kelas} placeholder="Pilih kelas" searchPlaceholder="Cari kelas" />
        </div>
      </Demo>
    </Section>
  );
}
