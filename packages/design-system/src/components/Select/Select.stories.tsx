import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "../Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./Select";

const meta: Meta<typeof Select> = {
  title: "Components/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `Pilihan tunggal dari daftar tetap. Sub-komponen: \`Select\`, \`SelectTrigger\` (prop \`invalid\`), \`SelectValue\`, \`SelectContent\`, \`SelectItem\`, \`SelectGroup\`, \`SelectLabel\`, \`SelectSeparator\`.

**Import**
\`\`\`tsx
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel, SelectSeparator } from "@wnpcode/design-system";
\`\`\`

**Keyboard dan fokus**
- Trigger berperan \`combobox\`; Enter, Space, atau ArrowDown/ArrowUp membuka daftar, klik juga membuka.
- Di dalam daftar: ArrowUp/ArrowDown berpindah, Home/End ke awal/akhir, ketik huruf untuk typeahead, Enter/Space memilih, Escape menutup tanpa mengubah nilai.
- Setelah tutup, fokus kembali ke trigger. Hubungkan \`Label\` lewat \`htmlFor\` dan \`id\` pada \`SelectTrigger\`.
- \`invalid\` menyetel \`aria-invalid\` dan border danger pada trigger; \`disabled\` mencegah daftar terbuka. Di dalam \`<form>\`, prop \`name\` pada \`Select\` merender select native tersembunyi.
- Konten di-portal ke body; \`data-brand\` di subtree tidak menjangkau portal, pasang brand lewat \`ThemeProvider brand\`.

**Do / Don't**
- Do: pakai \`Select\` untuk pilihan yang pendek dan tetap (mis. jenjang), dengan \`SelectValue placeholder\`.
- Do: Kelompokkan opsi panjang dengan \`SelectGroup\` dan \`SelectLabel\`.
- Don't: jangan pakai \`Select\` untuk daftar panjang yang perlu dicari; pakai Combobox.
- Don't: jangan menandai error hanya dengan warna; sertakan pesan teks di dekat field.`,
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Select>;

function Field({ disabled, invalid }: { disabled?: boolean; invalid?: boolean }) {
  return (
    <div className="max-w-xs gap-2 flex flex-col">
      <Label htmlFor="jenjang">Jenjang</Label>
      <Select disabled={disabled}>
        <SelectTrigger id="jenjang" invalid={invalid} aria-describedby={invalid ? "jenjang-error" : undefined}>
          <SelectValue placeholder="Pilih jenjang" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="sd">SD</SelectItem>
          <SelectItem value="smp">SMP</SelectItem>
          <SelectItem value="sma">SMA</SelectItem>
        </SelectContent>
      </Select>
      {invalid && (
        <p id="jenjang-error" className="text-sm text-danger">
          Jenjang wajib dipilih.
        </p>
      )}
    </div>
  );
}

export const Default: Story = { render: () => <Field /> };
export const Disabled: Story = { render: () => <Field disabled /> };
export const Invalid: Story = { render: () => <Field invalid /> };
