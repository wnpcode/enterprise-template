import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "../Label";
import { Combobox, type ComboboxProps } from "./Combobox";

const options = [
  { value: "7a", label: "Kelas 7A" },
  { value: "7b", label: "Kelas 7B" },
  { value: "7c", label: "Kelas 7C" },
  { value: "8a", label: "Kelas 8A" },
  { value: "8b", label: "Kelas 8B" },
  { value: "9a", label: "Kelas 9A", disabled: true },
];

const meta: Meta<typeof Combobox> = {
  title: "Components/Combobox",
  component: Combobox,
  tags: ["autodocs"],
  args: { options, placeholder: "Pilih kelas" },
  render: (args: ComboboxProps) => (
    <div className="max-w-xs gap-2 flex flex-col">
      <Label htmlFor="kelas">Kelas</Label>
      <Combobox {...args} id="kelas" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        component: `Pilihan tunggal dengan kolom pencarian, dibangun dari Popover dan \`cmdk\`. Satu komponen dengan data via prop \`options\` (\`{ value, label, disabled? }\`), \`value\`/\`defaultValue\`, dan \`onValueChange\`.

**Import**
\`\`\`tsx
import { Combobox } from "@enterprise/design-system";
\`\`\`

**Keyboard dan fokus**
- Trigger berperan \`combobox\` dengan \`aria-expanded\` dan \`aria-controls\`; klik atau Enter/Space membuka panel berisi kolom cari.
- Mengetik memfilter opsi berdasarkan \`label\`; ArrowUp/ArrowDown menyorot opsi, Enter memilih dan menutup panel, Escape menutup tanpa memilih.
- Panel dibuka dengan fokus di kolom cari; setelah tutup, fokus kembali ke trigger. Hubungkan \`Label\` lewat \`htmlFor\` dan \`id\`.
- \`emptyText\` tampil saat tidak ada hasil; \`invalid\` menyetel \`aria-invalid\`; \`disabled\` mencegah panel terbuka.
- Konten di-portal ke body; \`data-brand\` di subtree tidak menjangkau portal, pasang brand lewat \`ThemeProvider brand\`.

**Do / Don't**
- Do: pakai untuk daftar panjang (mis. puluhan kelas) yang perlu dicari.
- Do: Isi \`placeholder\`, \`searchPlaceholder\`, dan \`emptyText\` dengan teks Bahasa Indonesia yang spesifik.
- Don't: jangan pakai Combobox untuk beberapa pilihan pendek; \`Select\` lebih ringan.
- Don't: jangan harapkan multi-pilih atau input teks bebas, komponen ini hanya pilihan tunggal dari \`options\`.`,
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Combobox>;

export const Default: Story = {};
export const WithValue: Story = { args: { defaultValue: "8a" } };
export const Disabled: Story = { args: { disabled: true } };
export const Invalid: Story = { args: { invalid: true } };
